import { Client, CommandInteraction } from "discord.js";
import CustomClient from "../../client/Amadeus_Client";
import { Commands } from "../../client/Amadeus_Commands";
import { AmadeusInteraction } from "../../tomoEngine/statics/types";
const { SlashCommandBuilder } = require("@discordjs/builders");

class Add extends Commands {
  constructor() {
    super("add", {
      description: "Add",
      data: new SlashCommandBuilder(),
      dbRequired: false,
      ownerOnly: true,
    });
  }

  async execute(bot: CustomClient, interaction: AmadeusInteraction) {
    // init a variable that stores a number
    
    


  }
}

export = Add;
