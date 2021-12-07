import { Client, CommandInteraction } from "discord.js";
import Queries from "../tomoEngine/queries";
import Tomo_Dictionaries from "../tomoEngine/statics/tomo_dict";
import { AmadeusInteraction, UserUniversePayload } from "../tomoEngine/statics/types";
import DBUsers from "../tomoEngine/tomoClasses/users";
import Amadeus_Base from "./Amadeus_Base";
import CustomClient from "./Amadeus_Client";
import red from "./Amadeus_Redis";

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
  
  async checkCoolDown(interaction: CommandInteraction) {
    const key = interaction.user.id, redis = red.memory()
    console.log(await redis.hgetall("cooldown"))
    // check if redis cache has the key in it
    if (await redis.exists("cooldown", key)) {
      // if it does, return true
      console.log("true")
      return true;
    }
    // if it doesn't, set the key and the value will be the interaction command name
    await redis.hset("cooldown", key, this.name);
    redis.expire("cooldown", this.coolDown);
    // then return false
    console.log("false")
    return false;
    
  }

  
  async execute(bot: CustomClient, interaction: AmadeusInteraction) {
    

  }
  

  async check(bot: CustomClient, interaction: AmadeusInteraction) {
    return true;
  }

  async checkDB(interaction: AmadeusInteraction) {
    let user: UserUniversePayload;
    try {
      user = await Queries.userUniverse(interaction.user.id);
      if (!user) {
        const author = interaction.user;
        const newUserDocument: UserUniversePayload = {
          _id: author.id,
          discord_username: author.username,
          characters: [
            Tomo_Dictionaries.default_CharInUser()

          ],
          reserved: [],
          inventory: []

        }

        user = await Queries.insertUserUniverse(newUserDocument)
      }
      

    } catch (e) {
      console.log(e)

    } finally {
      interaction.DBUser = new DBUsers(user._id, user)
      return true;
    }

  }

  async default_checks(bot: CustomClient, interaction: AmadeusInteraction) {
    
    if (this.disabled) return interaction.reply("Sorry, this command is disabled.")

    if (this.ownerOnly) {
      console.log(interaction.user.id == process.env.OWNER_ID) // if true then bottom is false
      //CHANGE SIGN
      if (interaction.user.id != process.env.OWNER_ID ? false : true) return interaction.reply("Sorry, this is an owner only command. Try again when you become the owner?")
      
    }

    if (this.coolDown > 0 && interaction.user.id != process.env.OWNER_ID) {
      if (await this.checkCoolDown(interaction)) return interaction.reply("Sorry, your are on cooldown.")
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

    if (this.dbRequired) await this.checkDB(interaction)

    return true;
  }
}