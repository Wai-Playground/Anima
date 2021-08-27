import { Client, CommandInteraction } from "discord.js";
import { Commands } from "../client/Amadeus_Commands";
const { SlashCommandBuilder } = require("@discordjs/builders");
import CustomClient from "../client/Amadeus_Client";

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

  async execute(bot: CustomClient, interaction: CommandInteraction) {
    let cmdObj: Commands, cmd: String
    

     
    cmd = interaction.options.getString("command")
    cmdObj = bot.commands.get(cmd)

    
  
    

    if (cmdObj) {
      return interaction.reply(cmdObj.data.description)
      

    } else {
      return interaction.reply("Could not find the command! Mispelled?")

    }

  }
}

export = Help;