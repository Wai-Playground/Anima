
import CustomClient from "../../client/Amadeus_Client";
import Listeners from "../../client/Amadeus_listeners";
import { request } from "http";
const fetch = require("node-fetch")

class Message extends Listeners {
	constructor() {
		super("messageCreate", {
			once: false
		})
		
	}

	async execute(bot: CustomClient, msg) {
		if (msg.author.bot) return;
		this.checkBotTag(bot, msg)

	}
	checkBotTag(bot: CustomClient, msg) {
		
		if (msg.mentions.has(bot.user.id)) return;


	}



}


export = Message;

