import { InteractionResponseType } from "@discordjs/builders/node_modules/discord-api-types";
import {
  ButtonInteraction,
  Channel,
  CommandInteraction,
  Interaction,
  InteractionType,
  MessageComponentType,
  SelectMenuInteraction,
  TextBasedChannels,
  User,
} from "discord.js";
import { InteractionResponseTypes, InteractionTypes } from "discord.js/typings/enums";
import { RawInteractionData } from "discord.js/typings/rawDataTypes";
import { EventEmitter } from "events";
import { nextTick } from "process";
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

  async getCharacter(_id: number) {
    try {
      const payload: characterPayload = await Queries.character(_id);
      return new Character(_id, payload);

    } catch(e) {
      console.log(e);
      return null;
    }
  }

  async getBackground(_id: number) {
    try {
      const payload: backgroundPayload = await Queries.backgroundUniverse(_id);
      return new Background(_id, payload);

    } catch(e) {
      console.log(e);
      return null;
    }
  }

  async getUserUni(_id: String | number = null) {
    return await Queries.userUniverse(_id == undefined ? this.discUserObj.id : _id); //If the _id is not passed, use interaction user id.
  }


}

export = engineBase;
