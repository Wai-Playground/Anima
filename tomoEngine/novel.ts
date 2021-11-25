/**
 * @author Wai
 * I am going to actively try to comment instead of going with the flo
 */

import {
  ButtonInteraction,
  CommandInteraction,
  MessageAttachment,
  MessageActionRow,
  SelectMenuInteraction,
  MessageButton,
  InteractionCollector,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";
import engineBase from "./base";
import { single, scripts, moodType } from "./statics/types";
import Background from "./tomoClasses/backgrounds";
import Character from "./tomoClasses/characters";

import {
  Canvas,
  createCanvas,
  Image,
  loadImage,
  NodeCanvasRenderingContext2D,
} from "canvas";

class NodeSingle implements single{
  index: number;
  character: number | string;
  background: number | string;
  text: string;
  mood?: moodType;
  isChoiced: boolean;
  route?: number | scripts;
  built: boolean = false;
  built_img: MessageAttachment;
  choices?: Array<MessageSelectOptionData>;
  placeholder?: string;
  lookUpArr?: Array<scripts | number>;
  backable: boolean;

  constructor(single: single, index: number = null) {
    this.index = single.index || index;
    this.character = single.character;
    this.background = single.bg;
    this.text = single.text;
    this.mood = single.hasOwnProperty("mood") ? single.mood : null;
    this.backable = single.hasOwnProperty("backable") ? single.backable : true;
    this.route = single.hasOwnProperty("route") ? single.route : index + 1;

    this.isChoiced = single.hasOwnProperty("args") ? true : false;
    if (this.isChoiced) {
      this.choices = [];
      this.lookUpArr = [];
      let i = 0;
      this.placeholder = single.hasOwnProperty("placeholder")
        ? single.placeholder
        : "Select an option...";
      for (const arg of single.args) {
        this.choices.push({
          label: arg.label,
          emoji: arg.emoji || "💬",
          value: i.toString(),
        });
        this.lookUpArr.push(arg.route);
        console.log(this.choices);
        i++;
      }
    }
  }
}

export default class Novel extends engineBase {
  name: string;
  json: any;
  backgrounds: Map<number | string, Background>;
  characters: Map<number | string, Character>;
  multiples: Array<single>;
  nodes: Array<NodeSingle>;
  index: number;
  height: number = 480;
  width: number = 720;
  selection: number;
  ephemeral: boolean;
  filter: Function = async (i: any) => {
    await i.deferUpdate();
    return i.user.id === this.interaction.user.id;
  };
  message: any;
  portMessage: any;
  buttonCollector: InteractionCollector<ButtonInteraction>;
  selectCollector: InteractionCollector<SelectMenuInteraction>;
  /**
   * Constructor for Novel.
   * @param json | JSON file to parse.
   * @param interaction | Interaction class to get information about user, channel, etc.
   */

  constructor(
    json: object,
    interaction: CommandInteraction | ButtonInteraction | SelectMenuInteraction,
    ephemeral: boolean
  ) {
    super(interaction.user, interaction);

    // Declare variables.
    this.json = json;
    this.name = this.json.hasOwnProperty("name") ? this.json.name : null;
    this.interaction = interaction;
    this.backgrounds = new Map();
    this.characters = new Map();
    this.index = 0;
    this.ephemeral = ephemeral;
    this.nodes = [];
    this.prepareAssets();
  }

  async buildNode(index: number = this.index): Promise<MessageAttachment> {
    const canvas: Canvas = createCanvas(this.width, this.height);
    const ctx: NodeCanvasRenderingContext2D = canvas.getContext("2d");

    const bg: Image = await loadImage(
      this.backgrounds.get(this.nodes[index].background).link
    );
    const ch: Image = await loadImage(
      this.characters.get(this.nodes[index].character).link
    );

    ctx.drawImage(bg, 0, 0, this.width, this.height);
    ctx.drawImage(ch, 0, 0, ch.naturalWidth, ch.naturalHeight);

    this.nodes[index].built = true;
    this.nodes[index].built_img = new MessageAttachment(
      canvas.toBuffer("image/jpeg"),
      `novel_userID_${this.interaction.user.id}_node_${index}_${this.name}.jpg`
    );

    return this.nodes[index].built_img;
  }

  parseScript(str: scripts): void {
    console.log(str);

    switch (str) {
      case "$end":
        this.end();
        break;
      case "$flag_b":
        break;
      case "$next":
        this.setPage(this.index + 1);
        break;
      case "$flag_g":
        break;
    }
  }

  /**
   * Name | prepareAssets();
   * Purpose | prepares the assets.
   * Description | gets called from the constructor.
   */

  async prepareAssets() {
    // Purpose | process the multiples.
    this.multiples = this.json.hasOwnProperty("multiples")
      ? this.json.multiples
      : null;

    let i: number = 0;
    let payload: Character | Background;

    /**
     * Purpose | Loop through multiples and grab and store unique id of backgrounds and characters.
     */
    for (const single of this.multiples) {
      if (single.bg == undefined) single.bg = this.nodes[i - 1].background; // If there is no bg in this single then we take one from behind us.
      if (single.character == undefined)
        single.character = this.nodes[i - 1].character; // If there is no char in this single then we take one from behind us.

      if (!this.backgrounds.has(single.bg)) {
        // If the background map has this specific background ID already we skip. If not...
        payload = await this.getBackground(single.bg); // we store the payload of the db request

        this.backgrounds.set(single.bg, payload); // we set it in this map
      }

      // console.log(i + `_${single.mood}`);
      if (!this.characters.has(single.character) || single.mood != undefined) {
        if (!this.characters.has(single.character))
          console.log(
            "[ch] Char not logged, getting the payload. Payload ID:" +
              single.character
          );

        // If the character mpa has the char id already we skip.
        payload = await this.getCharacter(single.character);

        if (single.mood) {
          payload = await payload.getVariant(single.mood); // If the character is a variant, we can substitute

          single.character = payload.getId;
        }

        this.characters.set(single.character, payload);
      }

      this.nodes.push(new NodeSingle(single, i)); // Push it into our arra of nodes.

      i++;
    }

    // Build the node length if the legnth is less than or equal to 10.

    if (this.nodes.length <= 10) {
      for (const node of this.nodes) {
        // for every node in here
        this.buildNode(node.index); // call the build function
      }
    }

    process.nextTick(() => {
      this.emit("ready");
    });
  }

  /**
   * Name | start();
   * Purpose | Starts the engine.
   * Description | Gets called first when the Emitter from @see constructor .
   */

  async start() {
    const payload = {
      content: `>>> ${this.characters.get(this.nodes[this.index].character).name} >> ${
        this.nodes[this.index].text
      }`,
      files: [
        this.nodes[this.index].built ? this.nodes[this.index].built_img : await this.buildNode(this.index),
      ],
      //attachments: [build],
      components: await this.action(),
    };
    if (this.interaction.isCommand()) {
      if (this.interaction.deferred) {
        console.log("deferred");
        await this.interaction.editReply(payload);
      } else {
        await this.interaction.reply(payload);
      }
    }
    if (this.interaction.isButton()) {
      if ("update" in this.interaction) await this.interaction.update(payload);
    }

    this.message = await this.interaction.fetchReply();

    if (this.buttonCollector == undefined) this.collectButton(this.filter);
    if (this.selectCollector == undefined) this.collectSelect(this.filter);
    
  }

  async setPage(index: number = this.index) {
    if (index < 0 || index > this.nodes.length - 1) return;
    this.index = index;
    const payload = {
      content: `>>> ${
        this.characters.get(this.nodes[index].character).name
      } >> ${this.nodes[index].text}`,
      files: [
        this.nodes[index].built
          ? this.nodes[index].built_img
          : await this.buildNode(index),
      ],
      attachments: [],
      components: await this.action(),
    };
    await this.interaction.editReply(payload);
    
    this.refreshCoolDown()


    

    //await this.interaction.editReply(payload);
  }

  private refreshCoolDown() {
    if (this.buttonCollector) this.buttonCollector.resetTimer()
    if (this.selectCollector) this.selectCollector.resetTimer()
  }

  private async collectButton(filter: Function) {
    this.buttonCollector = this.message.createMessageComponentCollector({
      filter,
      componentType: "BUTTON",
      time: 60000,
    });
    this.buttonCollector.on("collect", (interaction: ButtonInteraction) => {
      const button = interaction.customId.match(/(\d{1,1})/g)[0];
      let skript: scripts | number;
      skript = this.nodes[this.index].route as scripts | number;
      if (typeof skript == "string") return this.parseScript(skript);

      this.emit("buttonCollected", button);

      switch (parseInt(button)) {
        case 0:
          this.setPage(this.index - 1);
          break;
        case 1:
          skript = this.nodes[this.index].route;
          console.log(skript + "ROUTEEE")
          if (typeof(skript) == "number") return this.setPage(skript)
          this.setPage(this.index + 1);

          break;
        case 2:
          if (this.selection != undefined) {
            console.log("confirmed");
            skript = this.nodes[this.index].lookUpArr[
              this.selection
            ] as scripts & number;
            if (typeof(skript) != "number") return this.parseScript(skript);
            console.log(skript)
            this.setPage(skript);
          }

          break;
      }
    });

    this.buttonCollector.on("end", () => {
      this.emit("end");
    });
  }

  /**
   *
   * @returns Message Action Row
   */
  async action(): Promise<MessageActionRow[]> {
    let ret: Array<MessageActionRow> = [];
    const buttons = [
      {
        disabled:
          (this.index > 0 ? false : true) ||
          (this.nodes[this.index - 1].isChoiced) ||
          (!this.nodes[this.index].backable),
          
        label: "Back",
        style: 1,
      },
      {
        disabled:
          (this.index >= this.nodes.length - 1 ? true : false) ||
          (this.nodes[this.index].isChoiced),
        label: "Next",
        style: 1,
      },
      {
        disabled: !(
          this.nodes[this.index].isChoiced && this.selection != undefined
        ),
        label: "Confirm Selection",
        style: 1,
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
          .setCustomId(
            "NOVEL.button_" + i.toString() + "_user_" + this.interaction.user.id
          )
          .setLabel(button.hasOwnProperty("label") ? button.label : null)
          //.setEmoji(button.hasOwnProperty("emj") ? button.emj : null)
          .setStyle(button.style)
      );
      i++;
    }
    ret.push(buttonRow);
    if (this.nodes[this.index].isChoiced) {
      const selectRow = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId(
            "NOVEL.select_" +
              this.index.toString() +
              "_user_" +
              this.interaction.user.id
          )
          .setPlaceholder(
            this.selection == undefined
              ? this.nodes[this.index].placeholder
              : this.nodes[this.index].choices[this.selection].emoji + this.nodes[this.index].choices[this.selection].label
          )
          .addOptions(this.nodes[this.index].choices)
      );

      ret.push(selectRow);
    }
    //console.log(buttonRow)

    return ret;
  }

  private async collectSelect(filter: Function) {
    this.selectCollector = this.message.createMessageComponentCollector({
      filter,
      componentType: "SELECT_MENU",
      time: 60000,
    });
    this.selectCollector.on(
      "collect",
      async (interaction: SelectMenuInteraction) => {
        let value = interaction.values[0]; // value[1] = selection
        console.log(value);

        this.selection = parseInt(value);

        this.emit("selectCollected", value);

        this.interaction.editReply({ components: await this.action() });
      }
    );

    this.selectCollector.on("end", () => {
      console.log("select ended!")
      this.emit("end");
    });
  }

  public async end() {
    this.emit("end");
    if (/*!this.selectCollector.ended ||*/ !this.buttonCollector.ended) {
      /*(await this.selectCollector.stop()*/
      this.buttonCollector.stop();
    }
  }
}
