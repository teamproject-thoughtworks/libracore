const express = require("express");
const router = express.Router();

const Queue = require("../model/Queue.model");

// GET QUEUE POSITION
const queuePosition= async (req, res) => {
  try {
    const { bookId, userId } = req.params;
    const queue = await Queue.findOne({ bookId });

    if (!queue) {
      return res.json({
        position: null
      });
    }

    const index = queue.users.findIndex(
      u => u.userId.toString() === userId
    );

    if (index === -1) {
      return res.json({
        position: null
      });
    }

    res.json({
      position: index + 1
    });
  }
  catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// 📋 Get Full Queue (Admin)
const queue= async (req, res) => {
  try {
    const queue = await Queue.findOne({ bookId: req.params.bookId });

    res.json(queue || { users: [] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    queuePosition,
    queue
};