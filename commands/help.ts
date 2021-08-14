import { Client } from "discord.js";
import { Commands } from "../client/Custom_Commands";
const { SlashCommandBuilder } = require("@discordjs/builders");

class Help extends Commands {
  constructor() {
    super("help", {
      data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Replies with Pong!")
        .addStringOption((option) =>
          option
            .setName("input")
            .setDescription("The input to echo back")
            .setRequired(false)
        ),
      dbRequired: false,
      ownerOnly: false,
    });
  }
  async check() {
      return true

  }

  async execute(bot: typeof Client, interaction) {
    const string = interaction.options.getString("input");
    await interaction.reply({ content: "get help nerd " + string, ephemeral: true });
  }
}

export = Help;