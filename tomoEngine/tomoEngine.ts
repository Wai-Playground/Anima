import {
  ButtonInteraction,
  CommandInteraction,
  Interaction,
  User,
} from "discord.js";
import engineBase from "./base";

/**
 * @author Shokkunn
 * @description | final complete package for the engine.
 */
class TomoEngine extends engineBase {
  constructor(
    interaction: CommandInteraction
  ) {
    super(interaction.user, interaction);

  }


}

export = TomoEngine;
