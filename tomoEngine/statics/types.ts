import { MessageSelectOptionData } from "discord.js";
/** Basic types (start) */
export type basicUniverseType = "character" | "background" | "user";
export type engineType = "tomo" | "rpg" | "novel";

/** Basic types (end) */

/** Mongodb payload types (start) */
export interface baseUniversePayload {
  _id: number | string;
  variant: {
    isVariant: boolean;
    variantUse?: string;
    originalID?: number;
  };
  name: string;
}
export interface backgroundPayload extends baseUniversePayload {
  description?: string;
  link: string;
}


export interface characterPayload extends baseUniversePayload {
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
export type moodType = "happy" | "sad" | "annoyed" | "surprised" | "flustered";
export type scripts = "$next" | "$flag_g" | "$flag_b" | "$end";
export type user_scripts = "$nickname" | "$suffix" | "$greetings" | "$farewells";
export type backgroundType = "day" | "evening" | "night";
export type mood_states = "detest" | "hate" | "annoyed" | "main" | "friendly" | "happy" | "passionate" | "close" | "flustered" | "love" | "goal"

export interface argument extends MessageSelectOptionData {
  route: scripts | number;

}

export interface single {
  index?: number;
  bg?: number | string;
  character?: number | string;
  text: string;
  mood?: moodType;
  route?: number | scripts;
  placeholder?: string;
  args?: Array<argument>;
  backable?: boolean;
}

/** Tomo types (end) */
