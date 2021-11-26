import { Interaction } from "discord.js";
import CustomClient from "../client/Amadeus_Client";
import { Listeners } from "../client/Amadeus_listeners";

class interactionCreate extends Listeners {
  constructor() {
    super("interactionCreate", {
      once: false,
    });
  }

  async execute(bot: CustomClient, interaction: Interaction) {
    
    if (!interaction.isCommand()) return;
    console.log(interaction.user.username + " used " + interaction.commandName)

    if (!bot.commands.has(interaction.commandName)) return;

    try {

      let cmd = bot.commands.get(interaction.commandName);
      
      if (await cmd.check(bot, interaction) && await cmd.default_checks(bot, interaction)) {
        console.log(interaction.options)
        if (interaction.options.data.length != 0) { // if we have options
          if (interaction.options.data[0].type == "SUB_COMMAND") { 
            let sub = interaction.options.getSubcommand()
            if (typeof cmd[sub] === "function") return cmd[sub](bot, interaction)
          }

        }

        
        return cmd.execute(bot, interaction)

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
