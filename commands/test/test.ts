import { ButtonInteraction, Client, CommandInteraction, InteractionCollector, Message, MessageActionRow, MessageButton, PartialMessage } from "discord.js";
import { Commands } from "../../client/Amadeus_Commands";
import { createConnection } from "mongoose";
import engineBase from "../../tomoEngine/base";
import user from "../../db_schemas/user_type";
import tomoEngine from "../../tomoEngine/tomoEngine";
import Novel from "../../tomoEngine/novel";
import bg from "../../db_schemas/universe/background_type";
import Queries from "../../tomoEngine/queries";
import { APIMessage } from "discord-api-types";
import Character from "../../tomoEngine/tomoClasses/characters";

const json = require("../../assets/story.json")

const { SlashCommandBuilder } = require("@discordjs/builders");

class Test extends Commands {
  message: any;
  buttonCollector: InteractionCollector<ButtonInteraction>;
  constructor() {
    super("test", {
      description: "For pinging the bot.",
      data: new SlashCommandBuilder(),
      dbRequired: false,
      ownerOnly: false,
    });
  }

  async execute(bot , interaction: CommandInteraction) {

    const char1: Character = new Character(323, await Queries.character(323));

    await char1.getVariant("sad")
    /*
    

    const buttonRow = new MessageActionRow();
    const filter = async (i) => {
      await i.deferUpdate();
      return i.user.id === interaction.user.id;
    };

    
      buttonRow.addComponents(
        new MessageButton()
          .setCustomId("lol")
          .setLabel("HI")
          .setStyle(1)
      );
      await interaction.reply("Ready?");
      await interaction.editReply({components: [buttonRow]});
      this.message = await interaction.fetchReply();

      this.buttonCollector = this.message.createMessageComponentCollector({
        filter,
        componentType: "BUTTON",
        time: 60000,
      });

      
      this.buttonCollector.on("collect", async (b_interaction: ButtonInteraction & CommandInteraction) => {
        let menu = new Novel(json, b_interaction)
        menu.once("ready", async ()=> {
          await menu.start();
        })        
        

      });
      */
      
    
    /*

    
    console.log("works")
    let menu = new Novel(json, interaction)
    
    menu.once("ready", async () => {
      await interaction.deferReply()
      menu.start();
    })
    
    

*/
  }
  
}

export = Test;
