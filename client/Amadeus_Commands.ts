import { Client, CommandInteraction } from "discord.js";
import { UserNotFoundError } from "../tomoEngine/statics/errors";
import Amadeus_Base from "./Amadeus_Base";
import CustomClient from "./Amadeus_Client";

const { SlashCommandBuilder } = require("@discordjs/builders");

export abstract class Commands extends Amadeus_Base {
  name: string = null;
  data: typeof SlashCommandBuilder = new SlashCommandBuilder();
  description: string = null;
  dbRequired: boolean = false;
  ownerOnly: boolean = false;
  checks: Function = null;
  disabled: boolean = false;
  inGuildOnly: boolean = false;
  inMainOnly: boolean = false;
  coolDown?: number = 0;

  constructor(
    name: string,
    settings: {
      description: string,
      data: typeof SlashCommandBuilder;
      dbRequired?: boolean;
      ownerOnly?: boolean;
      inGuildOnly?: boolean;
      inMainOnly?: boolean ;
      coolDown?: number;
    }
  ) {
    super()
    this.name = name.toLowerCase();
    this.data = settings.data;
    ///console.log(settings.description)
    this.data.setName(name)

    this.data.setDescription(settings.description) 
    this.dbRequired = settings.dbRequired;
    this.ownerOnly = settings.ownerOnly;
    this.description = settings.description.toString();
    this.inGuildOnly = settings.inGuildOnly;
    this.inMainOnly = settings.inMainOnly;
    this.coolDown = settings.coolDown;

    

  }

  async checkCoolDown(storage: Set<string>, interaction: CommandInteraction) {
    if (!storage.has(interaction.user.id)) {
      
      console.log(interaction.user.username + " Is in cool down.")
      storage.add(interaction.user.id)
      setTimeout(() => {
        storage.delete(interaction.user.id);
        console.log(interaction.user.username + " Is no longer in cooldown.")
      }, this.coolDown)
      return false;
    } else return true;
    
  }

  async check(bot: Client, interaction: CommandInteraction) {
    return true;
  }

  async default_checks(bot: CustomClient, interaction: CommandInteraction) {
    
    if (this.disabled) return interaction.reply("Sorry, this command is disabled.")

    if (this.ownerOnly) {
      console.log(interaction.user.id == process.env.OWNER_ID) // if true then bottom is false
      
      if (interaction.user.id == process.env.OWNER_ID ? false : true) return interaction.reply("Sorry, this is an owner only command. Try again when you become the owner?")
      
    }

    if (this.coolDown > 0) {
      if (await this.checkCoolDown(bot.coolDown, interaction)) return interaction.reply("Sorry, your are on cooldown.")
    }
    /*
    if (this.dbRequired) {
      try {
        const author = await user.findOne({_id: interaction.user.id});
        if (!author) throw new UserNotFoundError(interaction.user.id, "user");
        

      } catch (error) {

        const author_db = new user({
          _id: interaction.user.id,
          name: interaction.user.username,
          xp: 0,
          lvl: 1
        }) 
        await author_db.save();
        
      
      }
    }*/

    

    return true;
  }

  async formatName(this: Commands, interaction) {}
}
