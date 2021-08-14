import CustomClient from "../client/Amadeus_Client";
import { Listeners } from "../client/listeners";

class Message extends Listeners {
	constructor() {
		super("messageCreate", {
			once: false
		})
		
	}

	async execute(bot: CustomClient, msg) {
        console.log(msg.content)
        



	}



}


export = Message;

