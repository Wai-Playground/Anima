import { ButtonInteraction, Client, CommandInteraction, InteractionCollector, Message, MessageActionRow, MessageButton, PartialMessage } from "discord.js";
import { Commands } from "../../client/Amadeus_Commands";
import engineBase from "../../tomoEngine/base";
import tomoEngine from "../../tomoEngine/tomoEngine";
import Novel from "../../tomoEngine/novel";
import Queries from "../../tomoEngine/queries";
import { APIMessage } from "discord-api-types";
import Character from "../../tomoEngine/tomoClasses/characters";
import Background from "../../tomoEngine/tomoClasses/backgrounds";
import TomoEngine from "../../tomoEngine/tomoEngine";
import Red from "../../client/Amadeus_Redis";

const json = require("../../assets/story.json")

const { SlashCommandBuilder } = require("@discordjs/builders");

class Test extends Commands {
  message: any;
  buttonCollector: InteractionCollector<ButtonInteraction>;
  constructor() {
    super("test", {
      description: "For pinging the bot.",
      data: new SlashCommandBuilder().addSubcommand((subc) =>
      subc.setName("flush").setDescription("flush")
    ),
      dbRequired: false,
      ownerOnly: false,
    });
  }

  async execute(bot , interaction: CommandInteraction) {

    
    await interaction.deferReply({ephemeral: true});
    /*
    let jsons = JSON.parse(JSON.stringify(json));
    console.time('Novel')
    let nvl = new Novel(jsons, interaction, true)
    //console.log(json)
    nvl.once("ready", () => {
      console.timeEnd("Novel")
      return nvl.start();
      
    })*/
    console.time("Novel")
    let jsons = JSON.parse(JSON.stringify(json));
    
    
    let x = new Novel(jsons, interaction, true)
    x.once("ready", (d => {
      console.timeEnd("Novel")
      return x.start()
    }))
      


      
      
    
    /*

    
    console.log("works")
    let menu = new Novel(json, interaction)
    
    menu.once("ready", async () => {
      await interaction.deferReply()
      menu.start();
    })
    
    

*/
  }

  flush() {
    Red.flush()
  }
  
}

export = Test;
