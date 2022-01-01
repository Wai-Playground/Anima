import { ButtonInteraction, Client, CommandInteraction, InteractionCollector, Message, MessageActionRow, MessageButton, PartialMessage } from "discord.js";
import { Commands } from "../../client/Amadeus_Commands";
import engineBase from "../../tomoEngine/base";
import tomoEngine from "../../tomoEngine/tomoEngine";
import Novel from "../../tomoEngine/novel";
import Queries from "../../tomoEngine/queries";
import { APIMessage } from "discord-api-types";
import Character from "../../tomoEngine/tomoClasses/characters";
import Background from "../../tomoEngine/tomoClasses/backgrounds";
import TomoEngine from "../../tomoEngine/tomoEngine";
import Red from "../../client/Amadeus_Redis";
import CustomClient from "../../client/Amadeus_Client";
import { AmadeusInteraction } from "../../tomoEngine/statics/types";

const json = require("../../assets/story.json")

const { SlashCommandBuilder } = require("@discordjs/builders");

class Test extends Commands {
  message: any;
  buttonCollector: InteractionCollector<ButtonInteraction>;
  constructor() {
    super("test", {
      description: "For pinging the bot.",
      data: new SlashCommandBuilder().addSubcommand((subc) =>
      subc.setName("flush").setDescription("flush")
    ).addSubcommand((subc) =>
    subc.setName("hset").setDescription("set")
  ).addSubcommand((subc) =>
  subc.setName("hget").setDescription("get")
),
      dbRequired: false,
      ownerOnly: true,
    });
  }

  async execute(bot , interaction: AmadeusInteraction) {

    
    await interaction.deferReply({ephemeral: true});

    



  }

  async flush(bot: CustomClient, interaction: CommandInteraction) {

    await Red.flushAll()
    interaction.reply("Flushed Redis")
  }

  async hset(bot:CustomClient, interaction) {
    await Red.memory().hset("lol", "ok", 1);
    await Red.memory().expire("lol", 5);
  }

  async hget(bot: CustomClient, interaction: CommandInteraction) {

    console.log(await Red.memory().hget("lol", "ok"))
    
  }


}

export = Test;
