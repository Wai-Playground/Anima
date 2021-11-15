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

	}
	checkBotTag(bot: CustomClient, msg) {
		
		if (msg.mentions.has(bot.user.id)) return;


	}

	async distExp(bot: CustomClient, msg, userType: Model<typeof user>) {
		const db_user = await userType.findOne({_id: msg.author.id}) 
		if (!db_user) return;

		db_user.xp += 1
		
		db_user.save()
		console.log(db_user.xp)


	}



}


export = Message;

