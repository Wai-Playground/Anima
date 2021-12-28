
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
import { AmadeusInteraction, BackgroundPayload, CharacterPayload, ItemsPayload, StoryPayload, UserUniversePayload, User_Scripts } from "./statics/types";
import Background from "./tomoClasses/backgrounds";
import Character from "./tomoClasses/characters";
import Items from "./tomoClasses/items";
import Story from "./tomoClasses/story";
import DBUsers from "./tomoClasses/users" 

/**
 * @name engineBase
 * @description | Base class for the game engines.
 * @author Jupiternerd
 */
class engineBase extends EventEmitter {
  discUserObj: User; // Discord User Object.
  interaction: AmadeusInteraction  // Discord Interactions Objects.
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

  async getCharacter(_id: number | string): Promise<Character> {
    try {
      //const payload: CharacterPayload = await Queries.character(_id);
      return new Character(_id, await Queries.character(_id) as CharacterPayload);

    } catch(e) {
      console.log(e);
      return null;
    }
  }

  async getBackground(_id: number | string): Promise<Background> {
    try {
      //const payload: BackgroundPayload = await Queries.backgroundUniverse(_id);
      return new Background(_id, await Queries.background(_id) as BackgroundPayload);

    } catch(e) {
      console.log(e);
      return null;
    }
  }
  async getUserUniverse(_id: number | string): Promise<DBUsers> {
    try {
      //const payload: BackgroundPayload = await Queries.backgroundUniverse(_id);
      return new DBUsers(_id, await Queries.userUniverse(_id) as UserUniversePayload);

    } catch(e) {
      console.log(e);
      return null;
    }
  }
  async getStoryUniverse(_id: number | string): Promise<Story> {
    try {
      //const payload: BackgroundPayload = await Queries.backgroundUniverse(_id);
      return new Story(_id, await Queries.story(_id) as StoryPayload);

    } catch(e) {
      console.log(e);
      return null;
    }
  }

  async getItemUniverse(_id: number | string): Promise<Items> {
    try {
      //const payload: BackgroundPayload = await Queries.backgroundUniverse(_id);
      return new Items(_id, await Queries.item(_id) as ItemsPayload);

    } catch(e) {
      console.log(e);
      return null;
    }

  }

  parseUserScript(str: string): string {

    return str;

  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  periodTheString(string: string) {
    return (string.endsWith('.') ? string : string + '.');

  }

    /**
     * randIntFromZero
     * @param max 
     * @returns a random int from 0 to max (exclusive of max)
     */
  randIntFromZero(max: number) {
      return (Math.floor(Math.random() * max))
  }  
  

  parseCharacterScript(str: string, character: Character): string {
    if (str.includes("$")) {
      let beg = str.indexOf("$"), end = str.indexOf(' ', beg) == -1 ? str.length : str.indexOf(' ', beg);
      let sub = str.substring(beg, end) as User_Scripts

      switch (sub) {
        case "$greetings":
          str = str.replace(sub, character.getRandGreetings())

        break;

        case "$farewells":
          str = str.replace(sub, character.getRandFarewells())
        break;
        
      } 

    }
    return str;

    //return str;
  }

  /*

  async getUserUni(_id: String | number = null): Promise<any> {
    return await Queries.userUniverse(_id == undefined ? this.discUserObj.id : _id); //If the _id is not passed, use interaction user id.
  } */


}

export = engineBase;
