/**
 * @author Wai
 * I am going to actively try to comment instead of going with the flo
 */

import { ButtonInteraction, CommandInteraction, SelectMenuInteraction } from "discord.js";
import engineBase from "./base";
import { single } from "./statics/types";
import Background from "./tomoClasses/backgrounds";

class NodeSingle {
  characterID: number;
  backgroundID: number;
  displayText: string;

  constructor(single: single, index: number = null) {
    this.characterID = single.character;
    this.backgroundID = single.bg;
    this.displayText = single.text;
  }
}

export default class Novel extends engineBase {
  json: any;
  backgrounds: Array<any>;
  characters: Array<any>;
  multiples: Array<single>;
  nodes: Array<NodeSingle>;
  /**
   * Constructor for Novel.
   * @param json | JSON file to parse.
   * @param interaction | Interaction class to get information about user, channel, etc.
   */

  constructor(json: Object, interaction: CommandInteraction & ButtonInteraction | SelectMenuInteraction) {
    super(interaction.user, interaction);
    // Declaring Variables

    this.backgrounds = this.characters = this.nodes = []; // all are arrays of different types.
    this.json = json;
    this.multiples = (
      this.json.hasOwnProperty("multiples") ? this.json.multiples : null
    ) as Array<single>;

    this.interaction = interaction;

    /**
     * Purpose | For each single, we create a new Node and add it to our Node array.
     */
    this.multiples.forEach((singles: single) => {
      this.nodes.push(new NodeSingle(singles));
    });

    /**
     * Purpose | Load background and store it in the array.
     */

    process.nextTick(() => {
      // On next cycle we emit Ready since the listener activates later than the emitter.
      this.emitReady();
    });
  }
  /**
   * Name | start();
   * Purpose | Starts the engine.
   * Description | Gets called first when the Emitter from @see constructor .
   */

  async start() {
    const bg1: Background = await this.getBackground(0);
    console.log(bg1.name);

    if (this.interaction.deferred) {
        await this.interaction.editReply({ content: 'A button was clicked!', components: [] });
    } else {
        await this.interaction.reply({ content: 'A button was clicked!', components: [] });
        
    }

  }
}
