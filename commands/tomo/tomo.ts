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
import { AmadeusInteraction, CharacterInUser } from "../../tomoEngine/statics/types";
import CustomClient from "../../client/Amadeus_Client";
import { goAsync } from "fuzzysort";
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
      .addStringOption((option) =>
      option
        .setName('tomo_name')
        .setDescription('duh')
        .setRequired(false),
    )
      
      ).addSubcommand((subc) =>
      subc
      .setName("interact")
      .setDescription("itneract")
    ),
      dbRequired: true,
      ownerOnly: true,
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
    let menu: TomoEngine
    
    const option = interaction.options.getString("tomo_name");
    
    menu = await this.getNewTomoEngine(interaction, false);
    
    menu.once("ready", async () => {
      if (option) {
        // Define stuff.
        let arrOfChs: Character[], arrOfChsNames: Array<string>, fuzzySearched: Fuzzysort.Results, finalFuzzyString: string, finalFuzzyId: number, nodeIndex: number = 0, fuzzyFind: Character;

        arrOfChs = Array.from(menu.characters.values()) // Firstly, we smash the map values(k = id of ch, v = ch obj) into just array of values, [...ch];
        arrOfChsNames = arrOfChs.map(ch => ch.getName); // Array of ch names are just the names of ch like ["guide", "whoever"].
        fuzzySearched = await goAsync(option, arrOfChsNames, { allowTypo: true}) // A fuzzy search of the 

        finalFuzzyString = fuzzySearched[0]?.target;

        fuzzyFind = arrOfChs.find(ch => ch.name == finalFuzzyString) 

        if (fuzzyFind) finalFuzzyId = arrOfChs.find(ch => ch.name == finalFuzzyString).getId as number;
        else finalFuzzyId = interaction.DBUser.getMainTomoDachi().originalID;

        nodeIndex = menu.cards.findIndex(value => value.chInUser.originalID == finalFuzzyId);
        console.log(nodeIndex + "_" + finalFuzzyString)

        menu.start(nodeIndex);
        
      

      } else menu.start();
      
      
      
      
      
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
