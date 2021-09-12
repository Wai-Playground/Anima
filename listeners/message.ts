import { Model, Schema } from "mongoose";
import CustomClient from "../client/Amadeus_Client";
import { Listeners } from "../client/Amadeus_listeners";
import user from "../db_schemas/user_type";
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
		this.distExp(bot, msg, user)

		//his.kurisu(bot, msg)
        
        



	}

	async kurisu(bot: CustomClient, msg) {

		const payload = {
			inputs: {
				text: msg.content
			}
		}

		const headers = {
			'Authorization': 'Bearer ' +
			process.env.HUGGINGFACE_TOKEN
		}

		//msg.channel.startTyping();
		const response = await fetch(process.env.API_URL, {
			method: 'post',
			body: JSON.stringify(payload),
			headers: headers
		})

		const data = await response.json();
		console.log(data.generated_text)
		let botRes = (data.hasOwnProperty('generated_text') ? data.generated_text : data.error);

		
		msg.reply(botRes)


		
		

	}

	checkBotTag(bot: CustomClient, msg) {
		
		if (msg.mentions.has(bot.user.id)) {
			msg.reply("Yo")

		}


	}

	distExp(bot: CustomClient, msg, userType: Model<typeof user>) {
		const db_user = userType.findOne({_id: msg.author.id}) 
		if (!db_user) return;


	}



}


export = Message;

