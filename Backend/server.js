import "dotenv/config";
import app from "./src/app.js";
import { connectToDB } from "./src/config/database.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";

const port = process.env.PORT || 8000;

// socket.io configuration
const httpServer = http.createServer(app);
initSocket(httpServer);

connectToDB();

httpServer.listen(port, () => {
  console.log("Server is running on port", port);
});
