import { Client, CommandInteraction, MessageAttachment } from "discord.js";
import { createReadStream, createWriteStream } from "fs";
import { Commands } from "../../client/Amadeus_Commands";
import Queries from "../../tomoEngine/queries";
import Character from "../../tomoEngine/tomoClasses/characters";
const { SlashCommandBuilder } = require("@discordjs/builders");

class Ping extends Commands {
  constructor() {
    super("ping", {
      description: "For pinging the bot.",
      data: new SlashCommandBuilder(),
      dbRequired: false,
      ownerOnly: false,
      coolDown: 4000,
    });
  }

  async execute(bot: typeof Client, interaction: CommandInteraction) {


    

    
    
    
    

  }
}

export = Ping;
