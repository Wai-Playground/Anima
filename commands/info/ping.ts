import { Client, CommandInteraction, MessageAttachment } from "discord.js";
import { createReadStream, createWriteStream } from "fs";
import CustomClient from "../../client/Amadeus_Client";
import { Commands } from "../../client/Amadeus_Commands";
import Queries from "../../tomoEngine/queries";
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
      dbRequired: false,
      ownerOnly: false,
      coolDown: 4000,
    });
  }

  async execute(bot: typeof Client, interaction: CommandInteraction) {
    console.log('exculted')




  }

  async test(bot: CustomClient, interaction: CommandInteraction) {
    console.log("test")
    let payload = await Queries.character(0);
    console.log(payload)

  }
}

export = Ping;
