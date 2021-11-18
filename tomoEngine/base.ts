
import {
  ButtonInteraction,
  Channel,
  CommandInteraction,
  SelectMenuInteraction,
  TextBasedChannels,
  User,
} from "discord.js";
import { EventEmitter } from "events";
import Queries from "./queries";
import { backgroundPayload, characterPayload } from "./statics/types";
import Background from "./tomoClasses/backgrounds";
import Character from "./tomoClasses/characters";

/**
 * @name engineBase
 * @description | Base class for the game engines.
 * @author Jupiternerd
 */
class engineBase extends EventEmitter {
  discUserObj: User; // Discord User Object.
  interaction: CommandInteraction & ButtonInteraction | SelectMenuInteraction // Discord Interactions Objects.
  channel: Channel & TextBasedChannels; // Discord Channel Object.

  constructor(
    user: User,
    interaction: any
  ) {
    super();
    this.discUserObj = user;
    this.channel = interaction.channel;

    //nextTick(() => this.emitReady()); // Notify that we are ready to begin.
  }

  /**
   * @name emitReady()
   * @description | Emits an 'ready' event.
   */
  emitReady() {
    
    this.emit("ready");
  }

  /**
   * @name emitEnd()
   * @description | Emits an 'end' event.
   */
  emitEnd() {
    this.emit("end");
  }

  async getCharacter(_id: number): Promise<Character> {
    try {
      //const payload: characterPayload = await Queries.character(_id);
      return new Character(_id, await Queries.character(_id) as characterPayload);

    } catch(e) {
      console.log(e);
      return null;
    }
  }

  async getBackground(_id: number): Promise<Background> {
    try {
      //const payload: backgroundPayload = await Queries.backgroundUniverse(_id);
      return new Background(_id, await Queries.backgroundUniverse(_id) as backgroundPayload);

    } catch(e) {
      console.log(e);
      return null;
    }
  }

  async getUserUni(_id: String | number = null): Promise<any> {
    return await Queries.userUniverse(_id == undefined ? this.discUserObj.id : _id); //If the _id is not passed, use interaction user id.
  }


}

export = engineBase;
