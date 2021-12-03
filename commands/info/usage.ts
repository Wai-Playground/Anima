import { Client, CommandInteraction } from "discord.js";
import { Commands } from "../../client/Amadeus_Commands";
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

  async execute(bot: typeof Client, interaction: CommandInteraction) {
    // init a variable that stores a number
    
    


  }
}

export = Add;
