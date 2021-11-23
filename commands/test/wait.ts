import { Client, CommandInteraction } from "discord.js";
import { Commands } from "../../client/Amadeus_Commands";


const { SlashCommandBuilder } = require("@discordjs/builders");

class Wait extends Commands {
  constructor() {
    super("wait", {
      description: "For pinging the bot.",
      data: new SlashCommandBuilder(),
      dbRequired: false,
      ownerOnly: true,
    });
  }

  sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async execute(bot , interaction: CommandInteraction) {
      let sleep: number = 100000;
      interaction.reply("Sleeping for " + sleep / 1000 + " seconds.")
      await this.sleep(sleep)
      interaction.followUp("Done!")

/*
    
    console.log("works")
    let menu = new Novel(json, interaction)
    
    menu.once("ready", () => {
      menu.start();
    })
    */
    


  }
}

export = Wait;
