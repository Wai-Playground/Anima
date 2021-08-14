import { Client } from "discord.js";
import { Commands } from "../client/Custom_Commands";
const { SlashCommandBuilder } = require("@discordjs/builders");

class Ping extends Commands {
  constructor() {
    super("ping", {
      data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!")
        .addIntegerOption((option) =>
          option
            .setName("input")
            .setDescription("The input to echo back")
            .setRequired(false)
        ),
      dbRequired: false,
      ownerOnly: false,
    });
  }

  async execute(bot: typeof Client, interaction) {
    const string = interaction.options.getInteger("input");
    await interaction.reply({ content: "Pong!asdasda " + string, ephemeral: true });
  }
}

export = Ping;
