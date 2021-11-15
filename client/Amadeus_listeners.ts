import Amadeus_Base from "./Amadeus_Base";

export abstract class Listeners extends Amadeus_Base{
  name: string = null;
  once: boolean;


  constructor(name: string, settings: {once: boolean}) {
    super()
    this.name = name;
    this.once = settings.once;

  }

}
