import { ClientUser } from "discord.js";
import CustomClient from "../client/Amadeus_Client";
import { Listeners } from "../client/Amadeus_listeners";
import bot_model from "../db_schemas/bot_type";

class Ready extends Listeners {
  constructor() {
    super("ready", {
      once: true,
    });
  }

  async getRandomActivity(botUser: ClientUser) {
    const bot = await bot_model.findOne({ _id: botUser.id });
    if (!bot) {
      const data = new bot_model({
        _id: botUser.id,
        name: botUser.username,

        activities: [
          {
            type: "COMPETING",
            name: "for that bread.",
            status: "idle",
          },
          {
            type: "WATCHING",
            name: "over pen10.",
          },
        ],
      });

      return data.save();
    }
    var activity: any = bot.activities;
    activity = activity[Math.floor(Math.random() * activity.length)];

    console.log(activity);

    let type: string = activity.type || "COMPETING";
    let name: string = activity.name || "ERR_NO_ACTIVITY";
    let url: URL = activity.url || null;
    let status: string = activity.status || "online";


    return { activities: [{ name: name, type: type, url: url }], status: status.toLowerCase(),};
  }

  async execute(this: Ready, bot: CustomClient) {
    console.info(bot.name + " is ready.");

    if (bot.isReady())
      bot.user.setPresence(await this.getRandomActivity(bot.user));

    setInterval(
      async function (bot, func) {
        if (bot.isReady()) bot.user.setPresence(await func(bot.user));
      },
      Math.floor((Math.random() * (4 + 1) + 1) * 60000),
      bot,
      this.getRandomActivity
    );
  }
}

export = Ready;
