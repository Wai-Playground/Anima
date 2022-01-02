import { Interaction } from "discord.js";
import CustomClient from "../../client/Amadeus_Client";
import Listeners from "../../client/Amadeus_listeners";
import { Commands } from "../../client/Amadeus_Commands"
import DBUsers from "../../tomoEngine/tomoClasses/users";
import Queries from "../../tomoEngine/queries";
import { AmadeusInteraction } from "../../tomoEngine/statics/types";

class interactionCreate extends Listeners {
  constructor() {
    super("interactionCreate", {
      once: false,
    });
  }

  async execute(bot: CustomClient, interaction: AmadeusInteraction & Interaction) {
    if (!interaction.isCommand()) return;
    console.log(interaction.user.username + " used " + interaction.commandName);

    if (!bot.commands.has(interaction.commandName)) return;
    

    try {
      let cmd: Commands = bot.commands.get(interaction.commandName);
      //interaction.DBUser = await 

      if (
        (await cmd.check(bot, interaction)) &&
        (await cmd.checkIfInteractionCanRun(interaction))
      ) {
        console.log(interaction.options.data[0]?.type)
        if (interaction.options.data[0]?.type == "SUB_COMMAND") {
          let sub = interaction.options.getSubcommand();
          
          if (typeof cmd[sub] === "function") {

            return cmd[sub](bot, interaction)
          };
        }

        return cmd.execute(bot, interaction);
      }
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
}
export = interactionCreate;
