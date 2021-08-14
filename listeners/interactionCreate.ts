import CustomClient from "../client/Amadeus_Client";
import { Listeners } from "../client/listeners";

class interactionCreate extends Listeners {
  constructor() {
    super("interactionCreate", {
      once: false,
    });
  }

  async execute(bot: CustomClient, interaction) {
    console.log("interaction")
    if (!interaction.isCommand()) return;

    if (!bot.commands.has(interaction.commandName)) return;

    try {

      let cmd = bot.commands.get(interaction.commandName);
      if (await cmd.check()) return cmd.execute(bot, interaction)

      
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
