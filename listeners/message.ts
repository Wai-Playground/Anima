import { Model, Schema } from "mongoose";
import CustomClient from "../client/Amadeus_Client";
import { Listeners } from "../client/listeners";
import user from "../db_schemas/user_type";

class Message extends Listeners {
	constructor() {
		super("messageCreate", {
			once: false
		})
		
	}

	async execute(bot: CustomClient, msg) {
		this.checkBotTag(bot, msg)
		this.distExp(bot, msg, user)
        
        



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

