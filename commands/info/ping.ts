import { Client, CommandInteraction, MessageAttachment } from "discord.js";
import { createReadStream, createWriteStream } from "fs";
import CustomClient from "../../client/Amadeus_Client";
import { Commands } from "../../client/Amadeus_Commands";
import Queries from "../../tomoEngine/queries";
import { AmadeusInteraction } from "../../tomoEngine/statics/types";
import Character from "../../tomoEngine/tomoClasses/characters";
const { SlashCommandBuilder } = require("@discordjs/builders");

class Ping extends Commands {
  constructor() {
    super("ping", {
      description: "For pinging the bot.",
      data: new SlashCommandBuilder()
      .addSubcommand(subc => 
        subc
        .setName("test")
        .setDescription("description for 1_test"))
      .addSubcommand(subc => 
          subc
          .setName("teaa")
          .setDescription("description for 2_test"))
        ,
      dbRequired: true,
      ownerOnly: false,
      coolDown: 4,
    });
  }

  async execute(bot: CustomClient, interaction: AmadeusInteraction) {
    console.log('exculted')
    




  }

  async test(bot: CustomClient, interaction: AmadeusInteraction) {
    console.log(interaction.DBUser)

  }
}

export = Ping;
