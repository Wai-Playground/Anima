/**
 * @author Wai
 * I am going to actively try to comment instead of going with the flo
 */

import {
  ButtonInteraction,
  CommandInteraction,
  SelectMenuInteraction,
} from "discord.js";
import engineBase from "./base";
import { single } from "./statics/types";
import Background from "./tomoClasses/backgrounds";
import Character from "./tomoClasses/characters";

class NodeSingle implements single {
  index: number;
  characterID: number;
  backgroundID: number;
  text: string;
  isChoiced: boolean;

  constructor(single: single, index: number = null) {
    this.index = single.index || index;
    this.characterID = single.character;
    this.backgroundID = single.bg;
    this.text = single.text;

    this.isChoiced = single.hasOwnProperty("args") ? true : false;
    if (this.isChoiced) {
      // For each argument in args, we put them in an array.
      for (const argument of single.args) {
        console.log(argument)



      }
    }
  }
}

export default class Novel extends engineBase {
  json: any;
  backgrounds: Map<number, Background>;
  characters: Map<number, Character>;
  multiples: Array<single>;
  nodes: Array<NodeSingle>;
  /**
   * Constructor for Novel.
   * @param json | JSON file to parse.
   * @param interaction | Interaction class to get information about user, channel, etc.
   */

  constructor(
    json: object,
    interaction:
      | (CommandInteraction & ButtonInteraction)
      | SelectMenuInteraction
  ) {
    super(interaction.user, interaction);

    // Declare variables.
    this.json = json;
    this.interaction = interaction;
    this.backgrounds = this.characters = new Map();
    this.nodes = [];
    this.prepareAssets();
  }

  /**
   * Name | prepareAssets();
   * Purpose | prepares the assets.
   * Description | gets called from the constructor.
   */

  async prepareAssets() {
    // Purpose | process the multiples.

    this.multiples = this.json.hasOwnProperty("multiples")
      ? this.json.multiples
      : null;

    // Purpose | process the characters.

    if (this.json.hasOwnProperty("characters")) {
      for (const id of this.json.characters) {
        this.characters.set(id, await this.getCharacter(id));
      }
    }

    // Purpose | process the backgrounds.

    if (this.json.hasOwnProperty("backgrounds")) {
      for (const id of this.json.backgrounds) {
        this.backgrounds.set(id, await this.getBackground(id));
      }
    }

    //Purpose | For each single, we create a new Node and add it to our Node array.

    this.multiples.forEach((singles: single, index: number) => {
      this.nodes.push(new NodeSingle(singles, index));
    });
    console.log(this.nodes.length == this.multiples.length);
    if (this.nodes.length == this.multiples.length) {
      process.nextTick(() => {
        this.emit("ready");
      });
    }

    // Purpose | Load background and store it in the array.
  }

  /**
   * Name | start();
   * Purpose | Starts the engine.
   * Description | Gets called first when the Emitter from @see constructor .
   */

  async start() {
    console.log(this.nodes[2]);

    if (this.interaction.deferred) {
      await this.interaction.editReply({
        content: "A button was clicked!",
        components: [],
      });
    } else {
      await this.interaction.reply({
        content: "A button was clicked!",
        components: [],
      });
    }
  }

  async setPage(index: number = 0) {}
}
