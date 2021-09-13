import { Client, CommandInteraction } from "discord.js";
import { Commands } from "../client/Amadeus_Commands";
const { SlashCommandBuilder } = require("@discordjs/builders");
import CustomClient from "../client/Amadeus_Client";
const help = require("../assets/test.json")
import Menu from "../utils/menuEngine";

import{ EventEmitter }from 'events';

class Help extends Commands {
  constructor() {
    super("help", {
      description: "Peen",
      data: new SlashCommandBuilder()
        .addStringOption((option) =>
          option
            .setName("command")
            .setDescription("Optional | If you want a list of all commands or ")
            .setRequired(false)
        ),
      dbRequired: false,
      ownerOnly: false,
    });
    
  }



  public async execute(bot: CustomClient, interaction: CommandInteraction) {

    const test = {
      multiples: [
        {

        embed: {
          title: "te",
          color: "#fafa6e",
          fields: [
            {
              name: "te",
              value: "Body One",
              inline: true
            },
            {
              name: "Title Two",
              value: "Body Two",
              inline: true
            }
          ],
          description: "Description for header 1"
          },
          
        },
        {

          embed: {
            title: "TAETAE",
            color: "#fafade",
            fields: [
              {
                name: "TiASDe",
                value: "BodA",
                inline: true
              },
              {
                name: "TA Two",
                value: "BA Two",
                inline: true
              }
            ],
            description: "Description for hasd1"
            },
          
        }
        

          
          
 
      ]
    }
    const menu = new Menu(test, interaction)
    menu.on("ready", () => {
      menu.start()
    })
    menu.once("stop", () => {
      interaction.deleteReply()
    })
    

    

    
    


    /*
    let cmdObj: Commands, cmd: String

    cmd = interaction.options.getString("command")
    cmdObj = bot.commands.get(cmd)

    if (cmdObj) {
      return interaction.reply(cmdObj.data.description)
      

    } else {
      return interaction.reply("Could not find the command! Mispelled?")

    }*/

    
  }
}


export = Help;