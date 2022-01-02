import CustomClient from "../../client/Amadeus_Client";
import { Commands } from "../../client/Amadeus_Commands";
import Queries from "../../tomoEngine/queries";
import { AmadeusInteraction } from "../../tomoEngine/statics/types";
import Items from "../../tomoEngine/tomoClasses/items";
const { SlashCommandBuilder } = require("@discordjs/builders");

class Balance extends Commands {
  constructor() {
    super("balance", {
      description: "For pinging the bot.",
      data: new SlashCommandBuilder(),
      dbRequired: true,
      ownerOnly: false,
      coolDown: 1,
    });
  }
  

  async execute(bot: CustomClient, interaction: AmadeusInteraction) {
      console.log(interaction.DBUser.tickets)
      let ret:string = `${interaction.user.username}\'s Balance •\n` + `\`\`${interaction.DBUser.currency}\`\` 💴 Yen,\n` + `\`\`${interaction.DBUser.tickets}\`\` 🍱 Lunch Tickets`
      interaction.reply(ret)
  }
}

export = Balance;