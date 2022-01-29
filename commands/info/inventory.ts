import { Client, CommandInteraction } from "discord.js";
import CustomClient from "../../client/Amadeus_Client";
import { Commands } from "../../client/Amadeus_Commands";
import engineBase from "../../tomoEngine/base";
import Base from "../../tomoEngine/base";
import Queries from "../../tomoEngine/queries";
import { AmadeusInteraction } from "../../tomoEngine/statics/types";
import Items from "../../tomoEngine/tomoClasses/items";
const { SlashCommandBuilder } = require("@discordjs/builders");

class Inventory extends Commands {
  constructor() {
    super("inventory", {
      description: "For pinging the bot.",
      data: new SlashCommandBuilder(),
      dbRequired: true,
      ownerOnly: false,
      coolDown: 1,
    });
  }
  

  async execute(bot: CustomClient, interaction: AmadeusInteraction) {
      let ret: string = `${interaction.user.username}\'s Inventory •\n\`\``, inv = interaction.DBUser.inventory, item: Items, i = 0;
      if (inv.length <= 0) return interaction.reply("You got no items.")

      for (const items of inv) {
          item = new Items(items.itemID, (await Queries.item(items.itemID)));
          ret += (i == 0 ? `` : `,`) + `${item.markUpFormattedNamewEmoji}\`\` ${(items.amount > 1 ? `x${items.amount}\n` : `\n`)}`;
          i++
      }

      ret;

      interaction.reply(ret)
  }
}

export = Inventory;