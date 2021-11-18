import { Client, CommandInteraction, MessageAttachment } from "discord.js";
import { createReadStream, createWriteStream } from "fs";
import { Commands } from "../../client/Amadeus_Commands";
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
    //return interaction.reply({ content: "Pong!", ephemeral: true });

    const size = 200;
    const half = size / 2;

    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    function drawBackground() {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
    }

    const encoder = new GIFEncoder(size, size);
    encoder.setDelay(500);
    encoder.start();

    drawBackground();
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(0, 0, half, half);
    encoder.addFrame(ctx);

    drawBackground();
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(half, 0, half, half);
    encoder.addFrame(ctx);

    drawBackground();
    ctx.fillStyle = "#0000ff";
    ctx.fillRect(half, half, half, half);
    encoder.addFrame(ctx);

    drawBackground();
    ctx.fillStyle = "#ffff00";
    ctx.fillRect(0, half, half, half);
    encoder.addFrame(ctx);

    encoder.finish();


    const attachment = new MessageAttachment(encoder.out.getData(), 'lolol.gif')

    await interaction.reply({files: [attachment]})
    
    

  }
}

export = Ping;
