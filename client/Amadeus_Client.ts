require("dotenv").config();
const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
import Momonga from "./Amadeus_Mongo"
//
export default class CustomClient extends Client {
  /**
   * Description | Custom Client.
   * @param {*} name | Name of the bot.
   * @param {*} backup_prefix | Default = "-"
   */

  constructor(name: string = "Bot", token: string, uri: string) {

    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_MEMBERS,
      ],
    });

    (this.name = name), (this.token = token), (this.uri = uri);

    this.commands = new Collection();
    this.coolDown = new Set();
    this.slashCommands = []; // Make a new arr for commands to forward to discord.

  }

  async loadCog(this: CustomClient, cPath: string = `./commands`) {
    let files = fs.readdirSync(cPath);
    let newPath: string;

    files.forEach((file) => {
      newPath = cPath + "/" + file;
      if (fs.statSync(newPath).isDirectory()) {
        this.loadCog(newPath);
      } else {
        if (file.endsWith(".js")) {
          
          const command = require(`.${newPath}`);
          const cmd = new command();

          console.info(
            "[c] " + this.name + " has loaded command: " + cmd.data.name + "."
          );
          //console.log(cmd.data.toJSON());
          this.slashCommands.push(cmd.data.toJSON());
          this.commands.set(cmd.data.name, cmd);
        }
      }
    });
  }

  /**
   * Description | Loading Commands.
   * @param this | CustomClient
   */
  async commandLoader(this: CustomClient, cPath: string = `./commands`) {
    /**
     * I just gave myself a brain tumor writing loadCog. I tried to copy my py code and translate it to js but it didnt work because I am ass at js and py is alot better please discord.py come back.
     */

    await this.loadCog(cPath);

    /*

    const commandFiles = fs
      .readdirSync(path).filter(file => {
        file.endsWith(".js")
      })
      

    for (const file of commandFiles) {
      
      const command = require(`.${path}/${file}`);
  
      const cmd = new command()

      console.info( "[c] "+ this.name + " has loaded command: " + cmd.data.name + ".");
      console.log(cmd.data.toJSON())
      this.slashCommands.push(cmd.data.toJSON());
      this.commands.set(cmd.data.name, cmd);
    }
    */

    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

    try {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID
        ),
        { body: this.slashCommands }
      );
      //console.log(this.slashCommands)
      console.info(
        "[c] Delivered Slash commands to Discord. GUILD_ID: " +
          process.env.GUILD_ID
      );
    } catch (e) {
      console.error(e);
      console.info(this.name + " could not send Discord / commands...");
    }
  }

  async eventsLoader(this: CustomClient, path: string = "./listeners") {
    const eventFiles = fs
      .readdirSync(path)
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const event = require(`.${path}/${file}`);
      const ev = new event();

      console.log("[l]" + `${this.name} has loaded listener: ${ev.name}.`);

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
    await Momonga.connect()
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
