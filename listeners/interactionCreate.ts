import CustomClient from "../client/custom_client";
import { Listeners } from "../client/listeners";

class interactionCreate extends Listeners {
  constructor() {
    super("interactionCreate", {
      once: true,
    });
  }

  async execute(bot: CustomClient, interaction) {
    if (!interaction.isCommand()) return;

    if (!bot.commands.has(interaction.commandName)) return;

    try {
      await bot.commands.get(interaction.commandName).execute(bot, interaction);
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
