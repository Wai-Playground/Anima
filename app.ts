require("dotenv").config();
require("console-stamp")(console, "HH:MM:ss.l");
import CustomClient from "./client/custom_client";
const Anima = new CustomClient("Eni", process.env.TOKEN, process.env.URI);

Anima.run();
console.time("Bot_Load_Time");
