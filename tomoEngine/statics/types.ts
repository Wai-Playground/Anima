export type basicUniverseType = "character" | "backgrounds";
export interface backgroundPayload {
    _id: number,
    variant: {
        isVariant: boolean,
        variantUse?: string,
        originalID?: number
    },
    name: string,
    description?: string,
    link: string
  }

export interface characterPayload {
    _id: number,
    variant: {
        isVariant: boolean,
        variantUse?: string,
        originalID?: number
    },
    name: string,
    age?: number,
    bloodtype?: string,
    description?: string,
    link: string
  }
export interface single {
    bg?: number,
    character?: number,
    text: string,
    script?: string,
    route?: number | string
}