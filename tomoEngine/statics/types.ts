import { MessageSelectOptionData } from "discord.js";

export type basicUniverseType = "character" | "background" | "user";
export type moodType = "happy" | "sad" | "annoyed" | "surprised" | "flustered";
export type backgroundType = "day" | "evening" | "night";
export type engineType = "tomo" | "rpg" | "novel";
export interface baseUniversePayload {
  _id: number;
  variant: {
    isVariant: boolean;
    variantIds?: Array<number>;
    variantUse?: string;
    originalId?: number;
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
  universe?: {
    greetings: Array<string>;
    farewells: Array<string>;
  };
  link: string;
}

export type scripts = "$next" | "$flag_g" | "$flag_b" | "$end";

export interface argument extends MessageSelectOptionData{
  route: scripts | number

}

export interface single {
  index?: number;
  bg?: number;
  character?: number;
  text: string;
  mood?: moodType;
  route?: number | scripts;
  placeholder?: string;
  args?: Array<argument>;
}
