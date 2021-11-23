import { ClientUser } from "discord.js";
import CustomClient from "../../client/Amadeus_Client";
import { Listeners } from "../../client/Amadeus_listeners";

class Ready extends Listeners {
  constructor() {
    super("ready", {
      once: true,
    });
  }

  async execute(bot: CustomClient, msg) {
    console.log("READY!")
  }
}

export = Ready;