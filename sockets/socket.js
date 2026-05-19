const initSocket = (io) => {
  io.on("connection", (socket) => {
    // Join user-specific room for targeted notifications
    socket.on("join_user", (userId) => {
      socket.join(`user_${userId}`);
    });

    // Join book-specific room for queue updates
    socket.on("join_book", (bookId) => {
      socket.join(`book_${bookId}`);
    });

    socket.on("leave_book", (bookId) => {
      socket.leave(`book_${bookId}`);
    });

    socket.on("disconnect", () => {
      // Rooms are auto-cleaned on disconnect
    });
  });
};

module.exports = initSocket;
