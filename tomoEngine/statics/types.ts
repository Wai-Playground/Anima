import { MessageSelectOptionData } from "discord.js";
/** Basic types (start) */
export type BasicUniverseType = "characters" | "backgrounds" | "users" | "items";
export type EngineType = "tomo" | "rpg" | "novel";

/** Basic types (end) */

/** Tomo Types (start) */
export type MoodType = "happy" | "sad" | "annoyed" | "surprised" | "flustered" | "main" | "disgusted";
export type Scripts = "$next" | "$flag_g" | "$flag_b" | "$end";
export type User_Scripts = "$nickname" | "$suffix" | "$greetings" | "$farewells";
export type BackgroundType = "day" | "evening" | "night";

export type Mood_States = "detest" | "hate" | "annoyed" | "main" | "friendly" | "happy" | "passionate" | "close" | "flustered" | "love" | "goal";
export type User_Flags = "memento" | "nick_names_self" | "nick_names_char" | "kiss" | "hug" | "ring" | "block_gift" | "block_all"
export type Char_Archetype = "Dan" | "Tsun" | "Kuu" | "Dere"

export interface Ship_Tree {
  "detest": {
      level: number,
      setFlag?:  Array<string>
      setVariant?: string
      

  },
  "hate": {
      level: number,
      setFlag?:  Array<string>
      setVariant?: string

  }, 
  "annoyed": {
      level: number,
      setFlag?:  Array<string>
      setVariant?: string

  },
  "main": {
      level: number,
      setFlag?:  Array<string>
      setVariant?: string

  },
  "friendly": {
      level: number,
      setFlag?:  Array<string>
      setVariant?: string

      
  },
  "happy": {
      level: number,
      setFlag?:  Array<string>
      setVariant?: string
      
  },
  "passionate": {
      level: number,
      setFlag?:  Array<string>
      setVariant?: string
      
  },
  "close": {
      level: number,
      setFlag?:  Array<string>
      setVariant?: string
      
  },
  "flustered": {
      level: number,
      setFlag?:  Array<string>
      setVariant?: string
      
  },
  "love": {
      level: number,
      setFlag?:  Array<string>
      setVariant?: string
      
  }

}
/** Tomo Types (end) */

/** Mongodb payload types (start) */
export interface BaseUniversePayload {
  _id: number | string;
  variant: {
    isVariant: boolean;
    variantUse?: string;
    originalID?: number;
  };
  name: string;
}

export interface ItemsPayload extends BaseUniversePayload{
  description?: string;
  
}

export interface BackgroundPayload extends BaseUniversePayload {
  description?: string;
  link: string;
}

export interface CharacterInUser {
  originalID: number,
  _flags: Array<User_Flags>
  moods: {
    pictureToUse: string,
    overall: number,
    current: number
  }
  gift_received: Array<{
    itemID: number,
    amount: number
  }>
  //TODO: Add more when RPG begins 

}

export interface UserUniversePayload {
  _id: number | string;
  discord_username: string;
  characters: Array<CharacterInUser>;
  reserved: Array<CharacterInUser>;
  inventory: Array<{
    itemID: number,
    amount: number
  }>
  
}


export interface CharacterPayload extends BaseUniversePayload {
  age?: number;
  bloodtype?: string;
  description?: string;
  personality?: {
    _tree: Ship_Tree
    archetype: Char_Archetype;
    greetings: Array<string>;
    farewells: Array<string>;
    likes: Array<number>,
    dislikes: Array<number>,
  };
  link: string;
}

/** Mongodb payload types (end) */


/** Tomo types (start) */

export interface Argument extends MessageSelectOptionData {
  route: Scripts | number;

}
export interface Story {
  name: string;
  multiples: Single[];
}



export interface Single {
  index?: number;
  bg?: number | string;
  character?: number | string;
  text: string;
  mood?: MoodType;
  route?: number | Scripts;
  placeholder?: string;
  args?: Array<Argument>;
  backable?: boolean;
}

/** Tomo types (end) */
/** Overlord types (start) */
export interface OverlordMenu {

}

