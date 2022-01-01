require("dotenv").config();
const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
import Momonga from "./Amadeus_Mongo"
import Red from "./Amadeus_Redis"
import Listeners from "./Amadeus_listeners"
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
    this.slashCommands = []; // Make a new arr for commands to forward to discord.

  }

  /**
   * 
   * Name | loadCog
   * Description | Loads a cog.
   * @param this | Bot
   * @param cPath 
   */
  async loadCog(this: CustomClient, cPath: string = `./commands`) {

    const files = fs.readdirSync(cPath);
    let newPath: string

    files.forEach((file: string) => {
      newPath = cPath + "/" + file;
      if (fs.statSync(newPath).isDirectory()) {
        this.loadCog(newPath);
      } else {
        if (file.endsWith(".js")) {
          console.log(newPath)
          
          const command = require(`.${newPath}`);
          const cmd = new command();
          
          let payload: {
            name: string,
            description?: string,
            options: [],
            default_permissions?: any
          }

          console.info(
            "[c] " + this.name + " has loaded command: " + cmd.data.name + "."
          );
          payload = cmd.data.toJSON()
          this.slashCommands.push(payload);
          this.commands.set(payload.name, cmd);
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

  async loadEvents(this: CustomClient, ePath: string = "./listeners") {
    const files = fs.readdirSync(ePath)
    let newPath: string

    files.forEach((file: string) => {
      newPath = ePath + "/" + file;
      if (fs.statSync(newPath).isDirectory()) {
        this.loadEvents(newPath);
      } else {
        if (file.endsWith(".js")) {
          
          const event = require(`.${newPath}`);
          const ev: Listeners = new event();

          if (ev.once) {
            super.once(ev.name, (...args) => ev.execute(this, ...args));
          } else {
            super.on(ev.name, (...args) => ev.execute(this, ...args));
          }

          console.info(
            "[e] " + this.name + " has loaded event: " + ev.name + "."
          );
        }
      }
    });

  }



  /**
   * Description: Connect to mongodb.
   * @param this | This client.
   */

  async mangoLoader(this: CustomClient) {
    await Momonga.connect()
  }

  async redLoader(this: CustomClient) {
    await Red.connect()
  }

  /**
   *
   * @param this | Bot
   * @param token | token, should have been declared in the creation.
   */
  async run(this: CustomClient) {
    await this.redLoader();
    this.commandLoader();
    this.loadEvents();
    this.mangoLoader();
    
    await super.login(this.token);
  }
}
