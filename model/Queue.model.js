const mongoose = require("mongoose"); 
const queueSchema = new mongoose.Schema({
    bookId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        unique: true 
    }, 
    users: [ 
        { 
            userId: mongoose.Schema.Types.ObjectId, 
            joinedAt: { 
                type: Date, 
                default: Date.now 
            } 
        } 
    ] 
});

module.exports = mongoose.model("Queue", queueSchema);