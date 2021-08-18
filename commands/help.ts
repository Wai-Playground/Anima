import { Client, CommandInteraction } from "discord.js";
import { Commands } from "../client/Amadeus_Commands";
const { SlashCommandBuilder } = require("@discordjs/builders");

class Help extends Commands {
  lol: number
  constructor() {
    super("help", {
      description: "Peen",
      data: new SlashCommandBuilder()
        .addStringOption((option) =>
          option
            .setName("command")
            .setDescription("Optional | Specify which command you would like to see.")
            .setRequired(false)
        ),
      dbRequired: true,
      ownerOnly: true,
    });
  

    
    
  }
  async check() {
      return true

  }

  async execute(bot: Client, interaction: CommandInteraction) {

    
    const cmd = interaction.options.getString("command")

    if (cmd) {
      //bot.

    } else {

    }

  }
}

export = Help;