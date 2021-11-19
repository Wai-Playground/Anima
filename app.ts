require("dotenv").config();
require("console-stamp")(console, "HH:MM:ss.l");
/*
const http = require("http");

const requestLogs = [];
const server = http.createServer((req, res) => {
  requestLogs.push({ url: req.url, date: new Date() });
  res.end(JSON.stringify(requestLogs));
});

server.listen(3000);

//console.log("Server listening to port 3000. Press Ctrl+C to stop it.");
*/
import Amadeus from "./client/Amadeus_Client";
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
new Amadeus("Kringe", process.env.TOKEN, process.env.DURI).run()