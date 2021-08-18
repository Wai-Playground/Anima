import { Client } from "discord.js";
import user from "../db_schemas/user_type";

const { SlashCommandBuilder } = require("@discordjs/builders");

export class Commands {
  name: string = null;
  data: typeof SlashCommandBuilder;
  description: string = null;
  dbRequired: Boolean = false;
  ownerOnly: Boolean = false;
  checks: Function = null;

  constructor(
    name: string,
    settings: {
      description: string,
      data: typeof SlashCommandBuilder;
      dbRequired: Boolean;
      ownerOnly: Boolean;
    }
  ) {
    this.name = name.toLowerCase();
    this.data = settings.data;
    ///console.log(settings.description)
    this.data.setName(name)
    //console.log(this.data)
    this.data.setDescription(settings.description) 
    this.dbRequired = settings.dbRequired;
    this.ownerOnly = settings.ownerOnly;

  }

  async check() {
    return true;
  }

  async default_checks(bot, interaction) {

    if (this.ownerOnly) {
      interaction.reply("Sorry, this is for the owner only. Try again when you- wait...")
      return (interaction.user.id == process.env.OWNER_ID ? true : false)
    }
    
    if (this.dbRequired) {
      const author = await user.findOne({_id: interaction.user.id})
      if (!author) {
        const author_db = new user({
          _id: interaction.user.id,
          name: interaction.user.username,
          xp: 0,
          lvl: 1
        }) 

        author_db.save()
        interaction.reply("Sorry, you weren't on the list, try again!")
        return false;
      }

      


    }
    return true;
  }

  async formatName(this: Commands, interaction) {}
}
