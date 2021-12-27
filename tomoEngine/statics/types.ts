import { CommandInteraction, Interaction, MessageSelectOptionData } from "discord.js";
import DBUsers from "../tomoClasses/users";
/** Basic types (start) */
export type BasicUniverseType = "characters" | "backgrounds" | "users" | "items" | "stories";
export type EngineType = "tomo" | "rpg" | "novel" | "overlord";
export enum RPG_Classes {
  mathematics,
  literature,
  history,
  sciences,
  arts,
  home_ed,
  music,
  phys_ed
}

export type RPG_Classes_Strings = keyof typeof RPG_Classes | "any";

/** Basic types (end) */

/** Tomo Types (start) */
export enum Temp_MoodType {
  normal,
  happy,
  sad,
  annoyed,
  flustered,
}

export type Temp_MoodTypeStrings = keyof typeof Temp_MoodType;
export type Scripts = "$next" | "$flag_g" | "$flag_b" | "$beginEnd" | "$gift" | "$response" | keyof Gift_Responses
export type User_Scripts = "$nickname" | "$suffix" | "$greetings" | "$farewells";
export type BackgroundType = "day" | "evening" | "night";
export enum Mood_States {
  detest,
  hate,
  annoyed,
  classmates,
  friendly,
  passionate,
  close,
  flustered,
  love,
  goal
}

export enum Mood_Emojis {
  "💟",
  "😄",
  "⛈️",
  "💢",
  "💞"
}
export type Mood_States_Strings = keyof typeof Mood_States
export type Tomo_Action = "gift" | "interact" 
export type User_Flags = "memento" | "nick_name_self" | "nick_name_char" | Tomo_Action
export type Char_Flags = User_Flags 
export enum Char_Archetype {
  dere,
  dan,
  kuu,
  tsun
}
export type Char_Archetype_Strings = keyof typeof Char_Archetype;
export type Item_Type = "consumables" | "treasures" | "equipables"
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

export enum Rarity_Emoji {
  "🇩",
  "🇨",
  "🇧",
  "🇦",
  "🇸",
  "🇸🇸",
  "🇸🇸🇸",
  "🇽"
}

export enum Rarity_Color {
  "#d0f9ff",
  "#7fb9e7",
  "#40da90",
  "#ed5050",
  "#f4ac4a",
  "#ff4500",
  "#c13dff",
  "#000000"
}
export type Rarity_Grade_Strings= keyof typeof Rarity_Grade; 

export interface Ship_Branch {
  level: number,
  setFlag?: Array<Char_Flags>
  delFlag?: Array<Char_Flags>
  setVariant?: string
}
export interface Ship_Tree {
  "detest": Ship_Branch,
  "hate": Ship_Branch, 
  "annoyed": Ship_Branch,
  "main": Ship_Branch,
  "friendly": Ship_Branch,
  "passionate": Ship_Branch,
  "close": Ship_Branch,
  "flustered": Ship_Branch,
  "love": Ship_Branch,
  "goal": Ship_Branch
}
/** Tomo Types (end) */

/** Mongodb payload types (start) */
export interface BaseUniversePayload {
  _id: number | string;
  grade?: Rarity_Grade_Strings
  variant: {
    isVariant: boolean;
    variantUse?: string;
    originalID?: number;
  };
  description: string;
  emoji?: string;
  spoiler: boolean;
  name: string;
  class?: RPG_Classes_Strings
}

export interface ItemsPayload extends BaseUniversePayload {
  type: Item_Type
  
}

export interface BackgroundPayload extends BaseUniversePayload {
  link: string;
}

export interface CharacterPayload extends BaseUniversePayload {
  age?: number;
  bloodtype?: string;
  title: string;
  personality?: CharacterPersonality;
  link: string;
}

export interface ItemInUser {
  itemID: number,
  amount: number
}

export interface Being {
  health: Array<number>,
  mana: Array<number>
  hunger: number,
  stability: number,
  available: boolean,
  level: number,
  xp: number
}

export interface CharacterInUser {
  originalID: number,
  bg: number,
  _flags: Array<Char_Flags>
  moods: {
    pictureToUse: Temp_MoodTypeStrings,
    overall: number,
    current: number
  },
  being: Being;
  _last_interaction: {
    interaction: Tomo_Action
    interaction_date: Date
  }
  inventory: Array<ItemInUser>
  
  //TODO: Add more when RPG begins 

}

export interface UserUniversePayload {
  _id: number | string;
  discord_username: string;
  level: number;
  xp: number;
  characters: Array<CharacterInUser>;
  reserved: Array<CharacterInUser>;
  inventory: Array<ItemInUser>
  
}
export interface Gift_Responses {
  likes: Array<string>
  dislikes: Array<string>
  above: Array<string>
  average: Array<string>
  below: Array<string>
  duplicate: Array<string>
  none: Array<string>
}


export interface CharacterPersonality {
  archetype?: Char_Archetype_Strings;
  greetings: Array<string>;
  farewells: Array<string>;
  interaction_story_ids?: {
    interact: Array<number>
    gift?: Array<number>
  }
  interaction_gift_responses?: keyof Gift_Responses
  likes?: Array<number>,
  dislikes?: Array<number>
}




/** Mongodb payload types (end) */


/** Tomo types (start) */

export interface Argument extends MessageSelectOptionData {
  route: Scripts | number;

}
export interface StoryPayload extends BaseUniversePayload {
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
  script?: Scripts;
  mood?: Temp_MoodTypeStrings;
  route?: number | Scripts;
  placeholder?: string;
  args?: Array<Argument>;
  backable?: boolean;
}

/** Tomo types (end) */
/** Overlord types (start) */
export interface OverlordMenu {

}

/** Custom Interaction */
export interface AmadeusInteraction extends CommandInteraction {
  DBUser: DBUsers
}
