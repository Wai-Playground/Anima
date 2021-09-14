

require("dotenv").config();
const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const mongoose = require("mongoose");
export default class CustomClient extends Client {
  /**
   * Description | Custom Client.
   * @param {*} name | Name of the bot.
   * @param {*} backup_prefix | Default = "-"
   */

  constructor(name: string = "Bot", token: string, uri: string) {
    super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_MEMBERS] });

    (this.name = name), (this.token = token), (this.uri = uri);

    this.commands = new Collection();
    this.slashCommands = []; // Make a new arr for commands to forward to discord.
  }

  /**
   * Description | Loading Commands.
   * @param this | CustomClient
   */
  async commandLoader(this: CustomClient, path: string = `./commands`) {
    /**
     * Read carefully. I am too tired to fix this now but here:
     * @error | look at path. It's "./commands" is wrong, since we are in
     * a folder, we should be using ../commands!
     *
     * - B U T -
     *
     * Down here, we actually have to use it because stupid fs uses ./ to get back to the
     * top dir and this stupid needs to have a ../ instead of ./ beacuse of stupid.
     *
     * Please fix when you are ready cause I sure aint.
     */

    const commandFiles = fs
      .readdirSync(path)
      .filter((file) => file.endsWith(".js")); // Read commands from ./commands.

    for (const file of commandFiles) {
      const command = require(`.${path}/${file}`);
      const cmd = new command()

      console.info( "[c] "+ this.name + " has loaded command: " + cmd.data.name + ".");
      console.log(cmd.data.toJSON())
      this.slashCommands.push(cmd.data.toJSON());
      this.commands.set(cmd.data.name, cmd);
    }

    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

    try {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID
        ),
        { body: this.slashCommands }
      );
      console.info("[c] Delivered Slash commands to Discord. GUILD_ID: " + process.env.GUILD_ID)
    } catch (e) {
      console.error(e);
      console.info(this.name + " could not send Discord / commands...");
    }
  }

  eventsLoader(this: CustomClient, path: string = "./listeners") {

    const eventFiles = fs
      .readdirSync(path)
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const event = require(`.${path}/${file}`);
      const ev = new event()

      console.log("[l]" + `${this.name} has loaded listener: ${ev.name}.` )

      if (ev.once) {
        
        super.once(ev.name, (...args) => ev.execute(this, ...args));
      } else {
        super.on(ev.name, (...args) => ev.execute(this, ...args));
      }
    }
  }

  /**
   * Description: Connect to mongodb.
   * @param this | This client.
   */

  async mangoLoader(this: CustomClient) {
    const settings = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    };

    let serverRetries = 0; //Variable to count the retries.

    try {
      //Run function of connect.
      console.time("Database_Connection_Time"); //Starts Timer.
      await mongoose.connect(this.uri, settings);
    } catch (e) {
      //If error, retry the function and add 1 to the retries.
      console.error("Mango login failed... retrying.");
      serverRetries++;

      await mongoose.connect(this.uri, settings);
    } finally {
      //Finally log the results.
      console.info(
        `Mango connection successful after ${
          serverRetries > 0 ? serverRetries : "no"
        } ${serverRetries == 1 ? "retry" : "retries"}, time elapsed:`
      ); //Logs the retries and the time elasped.
      console.timeEnd("Database_Connection_Time"); //Stops timer.
    }
  }

  /**
   *
   * @param this | Bot
   * @param token | token, should have been declared in the creation.
   */
  async run(this: CustomClient) {
    this.commandLoader();
    this.eventsLoader();
    this.mangoLoader();
    await super.login(this.token);
  }
}
