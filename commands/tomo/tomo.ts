import {
  ButtonInteraction,
  Client,
  CommandInteraction,
  InteractionCollector,
  Message,
  MessageActionRow,
  MessageButton,
  PartialMessage,
} from "discord.js";
import { Commands } from "../../client/Amadeus_Commands";
import engineBase from "../../tomoEngine/base";
import TomoEngine from "../../tomoEngine/tomoEngine";
import Novel from "../../tomoEngine/novel";
import Queries from "../../tomoEngine/queries";
import { APIMessage } from "discord-api-types";
import Character from "../../tomoEngine/tomoClasses/characters";
import Background from "../../tomoEngine/tomoClasses/backgrounds";
import Cards from "../../tomoEngine/tomoEngine";
import DBUsers from "../../tomoEngine/tomoClasses/users";
import { AmadeusInteraction } from "../../tomoEngine/statics/types";
import CustomClient from "../../client/Amadeus_Client";

const json = require("../../assets/tale.json");

const { SlashCommandBuilder } = require("@discordjs/builders");

class Tomo extends Commands {
  message: any;
  buttonCollector: InteractionCollector<ButtonInteraction>;
  constructor() {
    super("tomo", {
      description: "Tomo bs",
      data: new SlashCommandBuilder().addSubcommand((subc) =>
        subc
        .setName("gift")
        .setDescription("hug")
      ).addSubcommand((subc) =>
      subc
      .setName("dachi")
      .setDescription("lol")
      ).addSubcommand((subc) =>
      subc
      .setName("interact")
      .setDescription("itneract")
    ),
      dbRequired: true,
      ownerOnly: false,
    });
  }


  async execute(bot, interaction: AmadeusInteraction) {

    
  }

  async getNewTomoEngine(interaction: AmadeusInteraction, ephemeral: boolean = true) {
    await interaction.deferReply({ ephemeral: ephemeral });
    return new TomoEngine(interaction)

  }

  /**
   *  JUST PROOF OF CONCEPT< REWRITE >
   * @param bot 
   * @param interaction 
   */
  async gift(bot: CustomClient, interaction: AmadeusInteraction) {
    let menu = await this.getNewTomoEngine(interaction, true);
    
    menu.once("ready", async () => {
        menu.gift()
    })
  }

  async dachi(bot: CustomClient, interaction: AmadeusInteraction) {
    
    let menu = await this.getNewTomoEngine(interaction, false);
    
    menu.once("ready", async () => {
        menu.start();
    })
  }

  async interact(bot: CustomClient, interaction: AmadeusInteraction) {
    
    let menu = await this.getNewTomoEngine(interaction, false);
    
    menu.once("ready", async () => {
        menu.interact();
    })
  }
}

export = Tomo;
