import {CommandInteraction } from "discord.js";
import { Commands } from "../../client/Amadeus_Commands";
const { SlashCommandBuilder } = require("@discordjs/builders");
import CustomClient from "../../client/Amadeus_Client";

import Menu from "../../utils/menuEngine";
class Help extends Commands {
  bot: CustomClient
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
      dbRequired: true,
      ownerOnly: false,
    });
    
  }
  async makeFullCommandData(commandList: Array<Commands>, command: Commands = null) {

    let ret = [], index = 0, i = 1
    for (const pair of commandList) { 
      const cObj = pair[1];   
      if (command) {
        if (command == pair[1]) index = i;
      } 

      
      
      ret.push({
        embed: {
          title: i + `. ${cObj.name.charAt(0).toUpperCase() + cObj.name.slice(1)}`,
          description: cObj.description,
          color: "#23aa8f",
          footer: {
            text: "Help menu"
          },
          fields: [
            {
              inline: true,
              name: "Owner Only?",
              value: cObj.ownerOnly.toString()
            },
            {
              inline: true,
              name: "Disabled?",
              value: cObj.disabled.toString()
            }
          ]

          
        }
      })
      i++;
    }

    return [ret, index];
  }

  public async execute(bot: CustomClient, interaction: CommandInteraction) {
    

    let data = [];
    let commandOption = interaction.options.getString("command");

    let command: Commands = bot.commands.get(commandOption) || null
    
  
    data = await this.makeFullCommandData(bot.commands, command)
 

    data[0].unshift({
      embed: {
        title: "Help Menu",
        description: "Use the buttons or select menu to navigate.",
        color: "#23aa8f",
        fields: [
          {
            inline: true,
            name: "Server info",
            value: "\`\`/serverinfo\`\` for server help."
          }
        ]
      }

    })
    let menu = new Menu({multiples: data[0], ephemeral: false}, interaction)
    
    menu.once("ready", () => {
      menu.index = data[1];
      menu.start();
      console.log(menu.test);
    })

    menu.once("end", () => {
      console.log("going to END")
      interaction.deleteReply()  .then(console.log)
      .catch(console.error);
    })

  }


}
export = Help;