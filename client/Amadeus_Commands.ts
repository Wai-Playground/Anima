import { Client, GuildMember, User } from "discord.js";
import user from "../db_schemas/user_type";

const { SlashCommandBuilder } = require("@discordjs/builders");

export class Commands {
  name: string = null;
  data: typeof SlashCommandBuilder = new SlashCommandBuilder();
  description: string = null;
  dbRequired: boolean = false;
  ownerOnly: boolean = false;
  checks: Function = null;
  disabled: boolean = false;

  constructor(
    name: string,
    settings: {
      description: string,
      data: typeof SlashCommandBuilder;
      dbRequired: boolean;
      ownerOnly: boolean;
    }
  ) {
    this.name = name.toLowerCase();
    this.data = settings.data;
    ///console.log(settings.description)
    this.data.setName(name)

    this.data.setDescription(settings.description) 
    this.dbRequired = settings.dbRequired;
    this.ownerOnly = settings.ownerOnly;
    this.description = settings.description.toString();

    

  }

  async check(bot, interaction) {
    return true;
  }

  async default_checks(bot, interaction) {

    if (this.ownerOnly) {
      const ret = (interaction.user.id == process.env.OWNER_ID ? true : false)
      if (!ret) return interaction.reply("Sorry, this is for the owner only. Try again when you become the owner I guess.")
      
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
