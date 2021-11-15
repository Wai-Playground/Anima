import { Client, CommandInteraction } from "discord.js";
import { Commands } from "../../client/Amadeus_Commands";
import { createConnection } from "mongoose";
import engineBase from "../../tomoEngine/base";
import user from "../../db_schemas/user_type";
import tomoEngine from "../../tomoEngine/tomoEngine";
import Novel from "../../tomoEngine/novel";
import bg from "../../db_schemas/universe/background_type";
import Queries from "../../tomoEngine/queries";

const json = require("../../assets/story.json")

const { SlashCommandBuilder } = require("@discordjs/builders");

class Test extends Commands {
  constructor() {
    super("test", {
      description: "For pinging the bot.",
      data: new SlashCommandBuilder(),
      dbRequired: false,
      ownerOnly: false,
    });
  }

  async execute(bot , interaction: CommandInteraction) {

    
    console.log("works")
    let menu = new Novel(json, interaction)
    
    menu.once("ready", async () => {
      await interaction.deferReply()
      menu.start();
    })
    
    


  }
}

export = Test;
