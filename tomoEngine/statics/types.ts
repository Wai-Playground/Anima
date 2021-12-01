import { MessageSelectOptionData } from "discord.js";
/** Basic types (start) */
export type BasicUniverseType = "characters" | "backgrounds" | "users" | "items" | "stories";
export type EngineType = "tomo" | "rpg" | "novel" | "overlord";

/** Basic types (end) */

/** Tomo Types (start) */
export enum MoodType {
  happy,
  sad,
  annoyed,
  surprised,
  flustered,
  main,
  disgusted,
}
export type MoodTypeStrings = keyof typeof MoodType;
export type Scripts = "$next" | "$flag_g" | "$flag_b" | "$end";
export type User_Scripts = "$nickname" | "$suffix" | "$greetings" | "$farewells";
export type BackgroundType = "day" | "evening" | "night";

export type Mood_States = "detest" | "hate" | "annoyed" | "main" | "friendly" | "happy" | "passionate" | "close" | "flustered" | "love" | "goal";
export type Tomo_Action = "hug" | "kiss" | "interact" | "gift"
export type User_Flags = "memento" | "nick_names_self" | "nick_names_char" | "kiss" | "hug" | "ring" | "block_gift" | "block_all"
export enum Char_Archetype {
  dere,
  dan,
  kuu,
  tsun
}
export type Char_Archetype_Strings = keyof typeof Char_Archetype;
export type Item_Type = "consumables" | "treasures"
export enum Rarity_Grade {
  D,
  C,
  B,
  A,
  S,
  SS,
  SSS,
  X
}
export type Rarity_Grade_Strings= keyof typeof Rarity_Grade;


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
  grade?: Rarity_Grade
  variant: {
    isVariant: boolean;
    variantUse?: string;
    originalID?: number;
  };
  description?: string;
  name: string;
}

export interface ItemsPayload extends BaseUniversePayload {
  type: Item_Type
  
}

export interface BackgroundPayload extends BaseUniversePayload {
  link: string;
}

export interface ItemInUser {
  itemID: number,
  amount: number
}

export interface CharacterInUser {
  originalID: number,
  _flags: Array<User_Flags>
  bg: number,
  moods: {
    pictureToUse: MoodTypeStrings,
    overall: number,
    current: number
  }
  gift_received: Array<ItemInUser>
  //TODO: Add more when RPG begins 

}

export interface UserUniversePayload {
  _id: number | string;
  discord_username: string;
  characters: Array<CharacterInUser>;
  reserved: Array<CharacterInUser>;
  inventory: Array<ItemInUser>
  
}

export interface CharacterPersonality {
  _archetype?: Char_Archetype;
  greetings: Array<string>;
  farewells: Array<string>;
  interaction_story_ids?: {
    hug?: Array<number>,
    gift?: Array<number>,
    kiss?: Array<number>,
    interact: Array<number>
  }
  likes?: Array<number>,
  dislikes?: Array<number>,
}


export interface CharacterPayload extends BaseUniversePayload {
  age?: number;
  bloodtype?: string;
  description?: string;
  personality?: CharacterPersonality;
  link: string;
}

/** Mongodb payload types (end) */


/** Tomo types (start) */

export interface Argument extends MessageSelectOptionData {
  route: Scripts | number;

}
export interface Story extends BaseUniversePayload {
  character_specific?: {
    action: Tomo_Action
  };
  multiples: Single[];
}



export interface Single {
  index?: number;
  bg?: number | string;
  character?: number | string;
  text: string;
  mood?: MoodTypeStrings;
  route?: number | Scripts;
  placeholder?: string;
  args?: Array<Argument>;
  backable?: boolean;
}

/** Tomo types (end) */
/** Overlord types (start) */
export interface OverlordMenu {

}

