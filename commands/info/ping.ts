import { Client, CommandInteraction } from "discord.js";
import { Commands } from "../../client/Amadeus_Commands";
const { SlashCommandBuilder } = require("@discordjs/builders");

class Ping extends Commands {
  constructor() {
    super("ping", {
      description: "For pinging the bot.",
      data: new SlashCommandBuilder(),
      dbRequired: false,
      ownerOnly: false,
    });
  }

  async execute(bot: typeof Client, interaction: CommandInteraction) {
    

    return interaction.reply({ content: "Pong!", ephemeral: true });
  }
}

export = Ping;
