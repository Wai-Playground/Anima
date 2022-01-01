
import CustomClient from "../../client/Amadeus_Client";
import { Commands } from "../../client/Amadeus_Commands";
import Lunch from "../../tomoEngine/lunchEngine";
import Queries from "../../tomoEngine/queries";
import { AmadeusInteraction, BentoPayload } from "../../tomoEngine/statics/types";
import LunchBox from "../../tomoEngine/tomoClasses/lunchBox";
const { SlashCommandBuilder } = require("@discordjs/builders");

class Roll extends Commands {
  constructor() {
    super("roll", {
      description: "rol",
      data: new SlashCommandBuilder(),
      dbRequired: true,
      ownerOnly: false,
    });
  }

  async execute(bot: CustomClient, interaction: AmadeusInteraction) {
    // init a variable that stores a number
    const box = new LunchBox(4, await Queries.item(4) as BentoPayload)
    const menu = new Lunch(interaction.user, interaction, box);
    console.log(interaction.DBUser)

    menu.start()
    
    


  }
}

export = Roll;
