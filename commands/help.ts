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
            .setDescription("Optional | Specify which command you would like to see.")
            .setRequired(false)
        ),
      dbRequired: true,
      ownerOnly: true,
    });
    
  }



  public async execute(bot: CustomClient, interaction: CommandInteraction) {

    const test = {
      multiples: [
        {
        index: 0,
        embed: {
          title: "Hey! Heaasdasdsaer 1",
          color: "#fafa6e",
          fields: [
            {
              name: "Title One",
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
          }
        },
        {
          index: 1,
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
            }
        }
        

          
          
 
      ]
    }
    const menu = new Menu(test, interaction)
    menu.on("ready", () => {
      menu.start()
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