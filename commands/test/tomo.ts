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

const json = require("../../assets/tale.json");

const { SlashCommandBuilder } = require("@discordjs/builders");

class Tomo extends Commands {
  message: any;
  buttonCollector: InteractionCollector<ButtonInteraction>;
  constructor() {
    super("tomo", {
      description: "Tomo bs",
      data: new SlashCommandBuilder().addSubcommand((subc) =>
        subc.setName("gift").setDescription("hug")
      ),
      dbRequired: true,
      ownerOnly: false,
    });
  }

  async execute(bot, interaction: CommandInteraction) {
    
  }

  /**
   *  JUST PROOF OF CONCEPT< REWRITE >
   * @param bot 
   * @param interaction 
   */
  async gift(bot, interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    console.log("uh hi")
    let xd = new TomoEngine(interaction)
    xd.once("ready", async () => {
        let card = await TomoEngine.buildCard(0, interaction.user.id)
        xd.gift(card)
    })
  }

}

export = Tomo;
