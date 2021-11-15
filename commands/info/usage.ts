import { Client, CommandInteraction } from "discord.js";
import { Commands } from "../../client/Amadeus_Commands";
const { SlashCommandBuilder } = require("@discordjs/builders");

class Usage extends Commands {
  constructor() {
    super("usage", {
      description: "For pinging the bot.",
      data: new SlashCommandBuilder(),
      dbRequired: false,
      ownerOnly: false,
    });
  }

  async execute(bot: typeof Client, interaction: CommandInteraction) {
    


  }
}

export = Usage;
