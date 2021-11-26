import { MessageSelectOptionData } from "discord.js";
/** Basic types (start) */
export type BasicUniverseType = "characters" | "backgrounds" | "users";
export type EngineType = "tomo" | "rpg" | "novel";

/** Basic types (end) */

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
export interface BackgroundPayload extends BaseUniversePayload {
  description?: string;
  link: string;
}


export interface CharacterPayload extends BaseUniversePayload {
  age?: number;
  bloodtype?: string;
  description?: string;
  personality?: {
    greetings: Array<string>;
    farewells: Array<string>;
  };
  link: string;
}

/** Mongodb payload types (end) */


/** Tomo types (start) */
export type MoodType = "happy" | "sad" | "annoyed" | "surprised" | "flustered";
export type Scripts = "$next" | "$flag_g" | "$flag_b" | "$end";
export type User_Scripts = "$nickname" | "$suffix" | "$greetings" | "$farewells";
export type BackgroundType = "day" | "evening" | "night";
export type Mood_States = "detest" | "hate" | "annoyed" | "main" | "friendly" | "happy" | "passionate" | "close" | "flustered" | "love" | "goal"

export interface Argument extends MessageSelectOptionData {
  route: Scripts | number;

}
export interface Story {
  name:      string;
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
