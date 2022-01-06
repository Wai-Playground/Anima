
import { goAsync } from "fuzzysort";
import CustomClient from "../../client/Amadeus_Client";
import { Commands } from "../../client/Amadeus_Commands";
import GachaEngine from "../../tomoEngine/gacha/gachaEngine";
import { AmadeusInteraction } from "../../tomoEngine/statics/types";
const { SlashCommandBuilder } = require("@discordjs/builders");

class Roll extends Commands {
  constructor() {
    super("roll", {
      description: "rol",
      data: new SlashCommandBuilder().addStringOption((option) =>
      option
        .setName("banner")
        .setDescription("Optional | The name of the banner you want to roll.")
        .setRequired(false)
    ),
      dbRequired: true,
      ownerOnly: false,
    });
  }

  async execute(bot: CustomClient, interaction: AmadeusInteraction) {
    const banner = new GachaEngine(interaction.user, interaction)
    banner.once("ready", () => {
      banner.start()

    })
    
    
    //const menu = new Lunch(interaction.user, interaction, );

    //menu.start(5)

  }
}

export = Roll;
