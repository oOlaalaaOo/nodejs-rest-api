import http from "http";
import app from "./app";
import socketIOService from "./services/socket-io.service";
import databaseService from "./services/database.service";
import config from "./config";

const port: any = config.portNumber;

databaseService.connect();

const server = http.createServer(app);

const io = socketIOService(server);

app.set("io", io);

server.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
