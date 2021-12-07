import { Client, CommandInteraction } from "discord.js";
import CustomClient from "../../client/Amadeus_Client";
import { Commands } from "../../client/Amadeus_Commands";
import { AmadeusInteraction } from "../../tomoEngine/statics/types";
const { SlashCommandBuilder } = require("@discordjs/builders");

class Level extends Commands {
  constructor() {
    super("level", {
      description: "For pinging the bot.",
      data: new SlashCommandBuilder()
      .addNumberOption((option) =>
      option
        .setName("test")
        .setDescription("test2")
        .setRequired(false)
    ),
      dbRequired: false,
      ownerOnly: false,
      coolDown: 1,
    });
  }
  

  async execute(bot: CustomClient, interaction: AmadeusInteraction) {
    

    return interaction.reply({ content: "Pong!", ephemeral: true });
  }
}

export = Level;