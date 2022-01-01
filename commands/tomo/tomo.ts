import {
  ButtonInteraction,
  InteractionCollector
} from "discord.js";
import { Commands } from "../../client/Amadeus_Commands";
import TomoEngine from "../../tomoEngine/tomoEngine";
import Character from "../../tomoEngine/tomoClasses/characters";
import { AmadeusInteraction } from "../../tomoEngine/statics/types";
import CustomClient from "../../client/Amadeus_Client";
import { goAsync } from "fuzzysort";

const { SlashCommandBuilder } = require("@discordjs/builders");

class Tomo extends Commands {
  message: any;
  buttonCollector: InteractionCollector<ButtonInteraction>;
  constructor() {
    super("tomo", {
      description: "Tomo bs",
      data: new SlashCommandBuilder()
      .addSubcommand((subc) =>
        subc
        .setName("info")
        .setDescription("info").addStringOption((option) =>
        option
          .setName('tomo_name')
          .setDescription('duh')
          .setRequired(false),
      )
      ).addSubcommand((subc) =>
        subc
        .setName("gift")
        .setDescription("hug").addStringOption((option) =>
        option
          .setName('tomo_name')
          .setDescription('duh')
          .setRequired(false),
      )
      ).addSubcommand((subc) =>
      subc
      .setName("dachi")
      .setDescription("lol").addStringOption((option) =>
      option
        .setName('tomo_name')
        .setDescription('duh')
        .setRequired(false),
    )
      
      ).addSubcommand((subc) =>
      subc
      .setName("interact")
      .setDescription("itneract").addStringOption((option) =>
      option
        .setName('tomo_name')
        .setDescription('duh')
        .setRequired(false),
    )
    ),
      dbRequired: true,
      ownerOnly: false,
    });
  }


  async execute(bot, interaction: AmadeusInteraction) {

    
  }

  async getCardIDofChInUser(menu: TomoEngine, interaction: AmadeusInteraction) {
    const option = interaction.options.getString("tomo_name");
    let ret = 0;
    
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
        ret = nodeIndex;
      }   
      return ret;
    
  }
  async getNewTomoEngine(interaction: AmadeusInteraction, ephemeral: boolean = true) {

    await interaction.deferReply({ ephemeral: ephemeral });
    const menu = new TomoEngine(interaction)
    
    return menu;

    

  }

  /**
   *  JUST PROOF OF CONCEPT< REWRITE >
   * @param bot 
   * @param interaction 
   */
  async gift(bot: CustomClient, interaction: AmadeusInteraction) {
    let menu = await this.getNewTomoEngine(interaction, true);

    
    menu.once("ready", async () => {
      
        menu.gift(interaction, menu.cards[await this.getCardIDofChInUser(menu, interaction)])
    })
  }

  async info(bot: CustomClient, interaction: AmadeusInteraction) {
    let menu: TomoEngine
    
    menu = await this.getNewTomoEngine(interaction, false);

    menu.once("ready", async () => {

      menu.stats()
  })

  }

  async dachi(bot: CustomClient, interaction: AmadeusInteraction) {
    let menu: TomoEngine
    
    menu = await this.getNewTomoEngine(interaction, false);

    menu.once("ready", async () => {

      menu.start()
  })

  }

  async interact(bot: CustomClient, interaction: AmadeusInteraction) {
    
    let menu = await this.getNewTomoEngine(interaction, false);

    menu.once("ready", async () => {
      
      menu.interact(interaction, menu.cards[await this.getCardIDofChInUser(menu, interaction)]);
      
    })
    
  }
}

export = Tomo;
