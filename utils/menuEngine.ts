/**
 * Wai Hlaing 2021
 * Menu-Handler Amadeus
 */

import {
  ButtonInteraction,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
  MessageSelectOptionData,
  SelectMenuInteraction,
  User,
} from "discord.js";
import { EventEmitter } from "events";

class menuSingles extends MessageEmbed {
  index: number; // keeps track of the sigle index.
  //rowCol: Array<MessageActionRow>; // messageActionRow
  constructor(single, count = null) {
    super();
    
    /**
     * This whole loop just goes through each key values and replaces the value of it with the one from the JSON file. There is probably a function that does this automatically...
     * but I don't know about it.
     */
    
    for (const pairs of Object.entries(single.embed)) // makes a key, value array. ["key", "value"], ["key", "value"]
      super.hasOwnProperty(pairs[0]) // remember, super is the messageEmbed Class so it got the same properties as our json embed. ex: color, title, description, fields, etc..
        ? (super[pairs[0]] = single.embed[pairs[0]]) // replacees it with the json field values.
        : null; // nothing.

    this.index = single.index || count;
    

  }
}

export default class Menu extends EventEmitter {
  test: number;
  slides: Array<menuSingles>;
  json: any;
  index: number;
  interaction: CommandInteraction;
  user: User;
  message: any;
  selectCollector: any;
  buttonCollector: any;
  filter: any;
  ephemeral: boolean;
  constructor(json, interaction: CommandInteraction) {
    super();

    if (!json) return;

    this.json = json;
    this.index = 0;
    this.interaction = interaction;
    this.user = interaction.user;

    this.filter = async (i) => {
      await i.deferUpdate();
      return i.user.id === interaction.user.id;
    };

    this.slides = [];
    this.ephemeral = (this.json.hasOwnProperty("ephemeral") ? this.json.ephemeral : false)
    let count = 0;

    /**
     * For each single cells in the array of multiples, we loop to get the class representation of it. The class's parent is a messegeEmbed so we can send it easily as well.
     */

    this.json.multiples.forEach((singles) => {
      this.slides.push(new menuSingles(singles, count));

      count++; // why is this red.

      if (count == this.json.multiples.length) {

        process.nextTick(() => {
          this.emit("ready", this.slides);
        });
      }
    });
  }
  /**
   * Starts the engine.
   */

  public async start() {
    this.interaction.reply({
      embeds: [this.slides[this.index]],
      components: await this.action(),
      ephemeral: this.ephemeral
    });

    this.message = await this.interaction.fetchReply();
    this.collectButton(this.filter);
    this.collectSelect(this.filter);
  }

  /**
   * Sets the index to the specified page and then edits the message.
   * @param page number | index number
   */

  public async setPage(page: any = 0) {
    if (page < 0 || page > this.slides.length - 1) return;

    this.index = page;
    this.emit("set", this.index)

    this.interaction.editReply({
      embeds: [this.slides[page]],
      components: await this.action(),
      
      
    });

  }

  private async action(): Promise<MessageActionRow[]> {

    let chapters = [];

    for (const pages of this.slides) {
      const chapter: MessageSelectOptionData = {
        label: pages.title,
        value: pages.index.toString(),
        description: pages.description,
      };

      chapters.push(chapter);
    }

    const selectRow = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(
          "MENU.select_" + this.index.toString() + "_user_" + this.user.id
        )
        .setPlaceholder("Select a page")
        .addOptions(chapters)
    );

    const buttons = [
      {
        disabled: this.index > 0 ? false : true,
        label: "<< First",
        style: 2,
      },
      {
        disabled: this.index > 0 ? false : true,
        label: "Back",
        style: 1,
      },
      {
        disabled: this.index >= this.slides.length - 1? true : false,
        label: "Next",
        style: 1,
      },
      {
        disabled: this.index >= this.slides.length - 1? true : false,
        label: "Last >>",
        style: 2,
      },
      {
        disabled: this.ephemeral,
        label: "Done",
        emj: "<:trash:886429816260280374>",
        style: 4,
      },
    ];

    let i = 0;
    const buttonRow = new MessageActionRow();

    for (const button of buttons) {
      buttonRow.addComponents(
        new MessageButton()
          .setDisabled(
            button.hasOwnProperty("disabled") ? button.disabled : false
          )
          .setCustomId("MENU.button_" + i.toString() + "_user_" + this.user.id)
          .setLabel(button.hasOwnProperty("label") ? button.label : null)
          .setEmoji(button.hasOwnProperty("emj") ? button.emj : null)
          .setStyle(button.style)
      );
      i++;
    }
    return [selectRow, buttonRow];
  }

  private async collectButton(filter) {
    this.buttonCollector = this.message.createMessageComponentCollector({
      filter,
      componentType: "BUTTON",
      time: 60000,
    });
    this.buttonCollector.on("collect", (interaction: ButtonInteraction) => {
      const button = interaction.customId.match(/(\d{1,1})/g)[0];
      this.emit("buttonCollected", button)

      switch (parseInt(button)) {
        case 0:
          this.setPage(0)

          break;
        case 1:
          this.setPage(this.index - 1)

          break;
        case 2:
          this.setPage(this.index + 1)
          break;
        case 3:
          this.setPage(this.slides.length - 1)
          break;
        case 4:
          this.end()
          break;

      }
    });

    this.buttonCollector.on('end', () => {
      this.emit("end");
    
    });
  }

  private async collectSelect(filter: Function) {
    this.selectCollector = this.message.createMessageComponentCollector({
      filter,
      componentType: "SELECT_MENU",
      time: 60000,
    });
    this.selectCollector.on("collect", (interaction: SelectMenuInteraction) => {
      let collectedIndex = parseInt(interaction.values[0])
      if (this.index == collectedIndex) return
      this.emit("selectCollected", collectedIndex)
      this.setPage(collectedIndex);
    });

    this.selectCollector.on('end', () => {
      this.emit("end");
      
    });

  }

  public async end() {
    this.emit("end")
    if (!this.selectCollector.ended || !this.buttonCollector.ended) {
      await this.selectCollector.stop()
      await this.buttonCollector.stop()
    
    }
 
   
    
  }
}
