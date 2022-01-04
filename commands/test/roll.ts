
import { goAsync } from "fuzzysort";
import CustomClient from "../../client/Amadeus_Client";
import { Commands } from "../../client/Amadeus_Commands";
import Lunch from "../../tomoEngine/lunchEngine";
import Queries from "../../tomoEngine/queries";
import { AmadeusInteraction, BentoPayload } from "../../tomoEngine/statics/types";
import Items from "../../tomoEngine/tomoClasses/items";
import LunchBox from "../../tomoEngine/tomoClasses/lunchBox";
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
    // init a variable that stores a number
    let fuzzy: string[], fuzzySearch: Fuzzysort.Results, banner: string;
    const lunch_box_inventory = (await interaction.DBUser.getUserInventoryButWithDBItems()).filter( box => box.item.itemType == "boxes");
    if (lunch_box_inventory.length <= 0) return interaction.reply("You got no boxes!");
    for (const boxes of lunch_box_inventory) fuzzy.push(boxes.item.name);

    fuzzySearch = await goAsync(interaction.options.getString("banner"), fuzzy, { allowTypo: true });
    banner = fuzzySearch[0]?.target || undefined;
    if (!banner) return interaction.reply("Not found. Retry?")
    lunch_box_inventory.find(box => box.item.name == banner);


    
    
    //const menu = new Lunch(interaction.user, interaction, );

    //menu.start(5)

  }
}

export = Roll;
