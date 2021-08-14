import CustomClient from "../client/Amadeus_Client";
import { Listeners } from "../client/listeners";

class Ready extends Listeners {
	constructor() {
		super("ready", {
			once: true
		})
		
	}

	async execute(bot: CustomClient) {
		console.info(bot.name + ' is ready.');
		


	}



}


export = Ready;
