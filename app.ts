require("dotenv").config();
require("console-stamp")(console, "HH:MM:ss.l");

import Amadeus from "./client/Amadeus_Client";
new Amadeus("Ema", process.env.TOKEN, process.env.URI).run()