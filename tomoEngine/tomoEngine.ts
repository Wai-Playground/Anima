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
class tomoEngine extends engineBase {
  constructor(
    user: User,
    interaction: CommandInteraction
  ) {
    super(user, interaction);
  }




}

export = tomoEngine;
