import { Client, CommandInteraction, MessageAttachment } from "discord.js";
import { createReadStream, createWriteStream } from "fs";
import { Commands } from "../../client/Amadeus_Commands";
import Queries from "../../tomoEngine/queries";
import Character from "../../tomoEngine/tomoClasses/characters";
const { SlashCommandBuilder } = require("@discordjs/builders");

const GIFEncoder = require('gif-encoder-2')
const { createCanvas } = require('canvas')
const { writeFile } = require('fs')
const path = require('path')

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
    const payload = await Queries.character(1);
    const char = new Character(payload._id, payload);

    const payload1 = await Queries.character(1);
    const char1 = new Character(payload._id, payload);
    console.log(char)
    console.log(char1)


    

    
    
    
    

  }
}

export = Ping;
