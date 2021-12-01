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
class Overlord extends engineBase {
  constructor(user: User, interaction: CommandInteraction) {
    super(user, interaction);
  }

  async runNovel() {

  }

  async runMenu() {

  }

  async runTomo() {
      
  }

  async runRPG() {
    
  }


}

export = Overlord;
