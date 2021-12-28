import { Client, CommandInteraction, MessageAttachment } from "discord.js";
import { createReadStream, createWriteStream } from "fs";
import CustomClient from "../../client/Amadeus_Client";
import { Commands } from "../../client/Amadeus_Commands";
import Queries from "../../tomoEngine/queries";
import { AmadeusInteraction } from "../../tomoEngine/statics/types";
import Character from "../../tomoEngine/tomoClasses/characters";
const { SlashCommandBuilder } = require("@discordjs/builders");

class Top extends Commands {
  constructor() {
    super("top", {
      description: "Check top",
      data:new SlashCommandBuilder().addSubcommand((subc) =>
      subc
      .setName("level")
      .setDescription("level?")
    ).addSubcommand((subc) =>
    subc
    .setName("simp")
    .setDescription("lol").addStringOption((option) =>
    option
      .setName('tomo_name')
      .setDescription('duh')
      .setRequired(false),
  )
    
    ).addSubcommand((subc) =>
    subc
    .setName("currency")
    .setDescription("top moni")
  ),
        
            
      dbRequired: true,
      ownerOnly: false,
      coolDown: 4,
    });
  }

  async level(bot: CustomClient, interaction: AmadeusInteraction) {
      

  }
  async simp(bot: CustomClient, interaction: AmadeusInteraction) {

  }

  async currency(bot: CustomClient, interaction: AmadeusInteraction) {

  }

  async execute(bot: CustomClient, interaction: AmadeusInteraction) {

  }

}

export = Top;
