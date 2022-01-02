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
      // COOL DOWN IS IN SECONDS
      coolDown?: number; // SECONDS
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

  async isUserInCooldown(interaction: AmadeusInteraction) {
    // Definition block.
    const key = interaction.user.id, redis = red.memory();

    // If the user id exists in the cooldown.
    if (await redis.exists("cooldown", key)) return true; // If it does, return true.
    this.addUserToCoolDown(interaction);
    return false; // Return false since the user was not in the cooldown.
  }

  async addUserToCoolDown(interaction: AmadeusInteraction, command: string = this.name, cooldown: number = this.coolDown) {
    const redis = red.memory(), key = interaction.user.id;

    await redis.hset("cooldown", key, command); // Add the user to the cooldown cluster.
    redis.expire("cooldown", cooldown); // TTL is the command's cooldown property.

  }

  async removeUserFromCoolDown(interaction: AmadeusInteraction) {
    const key = interaction.user.id, redis = red.memory();

    if (this.isUserInCooldown(interaction)) redis.hdel("cooldown", key);
  }

  async checkIfInteractionCanRun(interaction: AmadeusInteraction) {
    if (this.disabled) return interaction.reply("Sorry, this command is disabled.")

    if (this.ownerOnly) {
      console.log(interaction.user.id == process.env.OWNER_ID) // if true then bottom is false
      //CHANGE SIGN
      if (interaction.user.id !== process.env.OWNER_ID) return interaction.reply("Sorry, this is an owner only command. Try again when you become the owner?")
      
    }

    if (this.coolDown > 0 && interaction.user.id != process.env.OWNER_ID) {
      if (await this.isUserInCooldown(interaction)) return interaction.reply("Sorry, your are on cooldown.")
    }


    if (this.dbRequired) await this.checkDB(interaction)

    return true;

  }
  


  
  async execute(bot: CustomClient, interaction: AmadeusInteraction): Promise<any> {
    return;
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
          level: 1,
          xp: 0,
          money: 0,
          tickets: 0,
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


}