import CustomClient from "../client/custom_client";
import { Listeners } from "../client/listeners";

class Ready extends Listeners {
	constructor() {
		super("ready", {
			once: true
		})
		
	}

	async execute(bot: CustomClient) {
		console.info(bot.name + ' is ready.');
		console.timeEnd("Bot_Load_Time")


	}



}


export = Ready;
/*
export = {
	name: 'ready',
	once: true,

	async changeActivity(bot: CustomClient) {
		bot.user.setPresence({ activity: { name: savedData.name,type: savedData.type}, status: savedData.status });

	},

	async execute(bot: CustomClient) {
		console.info(bot.name + ' is ready.');
		console.timeEnd("Bot_Load_Time")
		changeactivity

	},
};
*/