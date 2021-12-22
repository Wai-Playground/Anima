import { AmadeusInteraction } from "../tomoEngine/statics/types";
import Amadeus_Base from "./Amadeus_Base";
import CustomClient from "./Amadeus_Client";

export default abstract class Listeners extends Amadeus_Base{
  name: string = null;
  once: boolean;


  constructor(name: string, settings: {once: boolean}) {
    super()
    this.name = name;
    this.once = settings.once;

  }

  async execute(bot: CustomClient, ...args) {

  }

}
