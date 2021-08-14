import { Client } from "discord.js";

const { SlashCommandBuilder } = require("@discordjs/builders");

export class Commands {
  name: string = null;
  data: typeof SlashCommandBuilder;
  dbRequired: Boolean = false;
  ownerOnly: Boolean = false;
  checks: Function = null;

  constructor(
    name: string,
    settings: {
      data: typeof SlashCommandBuilder;
      dbRequired: Boolean;
      ownerOnly: Boolean;
    }
  ) {
    this.name = name;
    this.data = settings.data;
    this.dbRequired = settings.dbRequired;
    this.ownerOnly = settings.ownerOnly;

  }

  async check() {
    return true;
  }

  async formatName(this: Commands, interaction) {}
}
