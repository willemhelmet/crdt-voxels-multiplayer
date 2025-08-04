import { Server } from "socket.io";

const rooms = {};

const io = new Server({
  cors: {
    origin: "https://willemhelmet.github.io",
    methods: ["GET", "POST"],
  },
});

io.listen(3000);

io.on("connection", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
    if (!rooms[room]) {
      rooms[room] = {};
    }
    rooms[room][socket.id] = {
      position: { x: 0, y: 0, z: 0 },
      view: "editor",
      color: "#ff0000",
      rotation: 0,
    };
    io.to(room).emit("update", rooms[room]);
  });

  socket.on("position", (data) => {
    const { room, position, rotation, view } = data;
    if (rooms[room] && rooms[room][socket.id]) {
      rooms[room][socket.id].position = position;
      rooms[room][socket.id].rotation = rotation;
      if (view) {
        rooms[room][socket.id].view = view;
      }
      io.to(room).emit("update", rooms[room]);
    }
  });

  socket.on("viewChange", (data) => {
    const { room, view } = data;
    console.log("view change", view);
    if (rooms[room] && rooms[room][socket.id]) {
      rooms[room][socket.id].view = view;
      io.to(room).emit("update", rooms[room]);
    }
  });

  socket.on("colorChange", (data) => {
    const { room, color } = data;
    console.log("color change", color);
    if (rooms[room] && rooms[room][socket.id]) {
      rooms[room][socket.id].color = color;
      io.to(room).emit("update", rooms[room]);
    }
  });

  socket.on("disconnect", () => {
    for (const room in rooms) {
      if (rooms[room][socket.id]) {
        delete rooms[room][socket.id];
        io.to(room).emit("update", rooms[room]);
        break;
      }
    }
  });
});
