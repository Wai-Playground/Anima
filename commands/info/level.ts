import { Client, CommandInteraction } from "discord.js";
import CustomClient from "../../client/Amadeus_Client";
import { Commands } from "../../client/Amadeus_Commands";
import Base from "../../tomoEngine/base";
import { Equations } from "../../tomoEngine/statics/tomo_dict";
import { AmadeusInteraction } from "../../tomoEngine/statics/types";
const { SlashCommandBuilder } = require("@discordjs/builders");

class Level extends Commands {
  constructor() {
    super("level", {
      description: "For pinging the bot.",
      data: new SlashCommandBuilder(),
      dbRequired: true,
      ownerOnly: false,
      coolDown: 1,
    });
  }
  

  async execute(bot: CustomClient, interaction: AmadeusInteraction) {
    const eq = Equations.calculate_user_xp(interaction.DBUser.level + 1)
    

    return interaction.reply({ content: "Lvl • \`\`" + interaction.DBUser.level + "\`\` | XP • " + await Base.levelGUI(Math.floor((interaction.DBUser.xp / eq) * 10), 10) + " • \`\`" + interaction.DBUser.xp + "\`\` / \`\`" + eq + "\`\`", ephemeral: false });
  }
}

export = Level;