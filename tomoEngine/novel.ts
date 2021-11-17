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
import { NovelError, TomoError } from "./statics/errors";
import { single, moodType} from "./statics/types";
import Background from "./tomoClasses/backgrounds";
import Character from "./tomoClasses/characters";

class NodeSingle {
  index: number;
  character: number;
  background: number;
  text: string;
  mood?: string;
  isChoiced: boolean;

  constructor(single: single, index: number = null) {
    this.index = single.index || index;
    this.character = single.character;
    this.background = single.bg;
    this.text = single.text;
    this.mood = single.hasOwnProperty("mood") ? single.mood : null;

    this.isChoiced = single.hasOwnProperty("args") ? true : false;
    if (this.isChoiced) {
      // For each argument in args, we put them in an array.
      for (const argument of single.args) {
      }
    }

    if (this.mood) {
    }
  }
}

export default class Novel extends engineBase {
  name: string;
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
    this.name = this.json.hasOwnProperty("name") ? this.json.name : null;
    this.interaction = interaction;
    this.backgrounds = new Map();
    this.characters = new Map();
    this.nodes = [];
    this.prepareAssets();
  }

  /**
   * Name | prepareAssets();
   * Purpose | prepares the assets.
   * Description | gets called from the constructor.
   */

  async prepareAssets() {
    // Purpose | process t he multiples.

    this.multiples = this.json.hasOwnProperty("multiples")
      ? this.json.multiples
      : null;
    
    let i:number = 0;
    let payload: Character | Background;

    /**
     * Purpose | Loop through multiples and grab and store unique id of backgrounds and characters.
     */

    for (const single of this.multiples) {
      if(single.bg == undefined) single.bg = this.nodes[i - 1].background; // If there is no bg in this single then we take one from behind us.
      if(single.character == undefined) single.character = this.nodes[i - 1].character; // If there is no char in this single then we take one from behind us.

      if (!this.backgrounds.has(single.bg)) { // If the background map has this specific background ID already we skip. If not...
        payload = await this.getBackground(single.bg); // we store the payload of the db request 
        this.backgrounds.set(single.bg, payload); // we set it in this map
      }

      console.log(i + `_${single.mood}`);
      if (!this.characters.has(single.character)) {// If the character map has this specific char ID |AND| We have a single.mood variable undefined, we skip.
        payload = await this.getCharacter(single.character) 
        if (single.mood) {
          payload = await payload.getVariant(single.mood); // If the character is a variant, we can substitute 
          single.character = payload.getId();
        }

        this.characters.set(single.character, payload);
      }

      this.nodes.push(new NodeSingle(single, i)); // Push it into our arra of nodes.

      i++;
    }

    console.log(this.nodes.length == this.multiples.length);
    if (this.nodes.length == this.multiples.length) {
      process.nextTick(() => {
        this.emit("ready");
      });
    }
  }

  /**
   * Name | start();
   * Purpose | Starts the engine.
   * Description | Gets called first when the Emitter from @see constructor .
   */

  async start() {
    console.log(this.characters);
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
