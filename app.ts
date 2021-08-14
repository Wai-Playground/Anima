require("dotenv").config();
require("console-stamp")(console, "HH:MM:ss.l");
import CustomClient from "./client/Amadeus_Client";
const Anima = new CustomClient("Eni", process.env.TOKEN, process.env.URI);
Anima.run();

