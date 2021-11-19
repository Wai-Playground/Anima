/**
 * @author Wai
 * I am going to actively try to comment instead of going with the flo
 */

import {
  ButtonInteraction,
  CommandInteraction,
  Message,
  MessageAttachment,
  MessageComponent,
  MessageActionRow,
  SelectMenuInteraction,
  MessageButton,
  MessagePayload,
  ButtonInteractionCollectorOptions,
  SelectMenuInteractionCollectorOptions,
  InteractionCollector,
} from "discord.js";
import engineBase from "./base";
import { NovelError, TomoError } from "./statics/errors";
import { single, moodType } from "./statics/types";
import Background from "./tomoClasses/backgrounds";
import Character from "./tomoClasses/characters";

import { Canvas, createCanvas, Image, loadImage, NodeCanvasRenderingContext2D} from "canvas";
import { APIMessage } from "discord-api-types";

class NodeSingle {
  index: number;
  character: number;
  background: number;
  text: string;
  mood?: string;
  isChoiced: boolean;
  route: number | string;
  built: boolean = false;
  built_img: MessageAttachment;

  constructor(single: single, index: number = null) {
    this.index = single.index || index;
    this.character = single.character;
    this.background = single.bg;
    this.text = single.text;
    this.mood = single.hasOwnProperty("mood") ? single.mood : null;
    this.route = single.hasOwnProperty("route") ? single.route : index + 1;
    

    this.isChoiced = single.hasOwnProperty("args") ? true : false;
    if (this.isChoiced) {
      // For each argument in args, we put them in an array.
      for (const argument of single.args) {
      }
    }

    if (this.mood) {
    }
  }
}

export default class Novel extends engineBase {
  name: string;
  json: any;
  backgrounds: Map<number, Background>;
  characters: Map<number, Character>;
  multiples: Array<single>;
  nodes: Array<NodeSingle>;
  index: number;
  height: number = 1080;
  width: number = 720;
  selection: number;
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
    interaction: CommandInteraction | ButtonInteraction | SelectMenuInteraction
  ) { 
    super(interaction.user, interaction);

    // Declare variables.
    this.json = json;
    this.name = this.json.hasOwnProperty("name") ? this.json.name : null;
    this.interaction = interaction;
    this.backgrounds = new Map();
    this.characters = new Map();
    this.index = 0;
    this.nodes = [];
    this.prepareAssets();
  }


  async sanitizeScripts() {

  }

  async buildNode(index: number = this.index): Promise<MessageAttachment> {
    const canvas: Canvas = createCanvas(1080, 720);
    const ctx: NodeCanvasRenderingContext2D = canvas.getContext("2d");

    const bg: Image = await loadImage(this.backgrounds.get(this.nodes[index].background).link);
    const ch: Image = await loadImage(this.characters.get(this.nodes[index].character).link);

    ctx.drawImage(bg, 0, 0, bg.naturalWidth, bg.naturalHeight);
    ctx.drawImage(ch, 0, 0, ch.naturalWidth, ch.naturalHeight);

    this.nodes[index].built = true;
    this.nodes[index].built_img = new MessageAttachment(canvas.toBuffer(), `novel_userID_${this.interaction.user.id}_node_${index}_${this.name}.png`);

    return this.nodes[index].built_img;

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

      
      if (single.bg == undefined) {
        console.error("[e] Does not have bg! grabbing one from behind us which is: " + this.nodes[i - 1].background)
        
        single.bg = this.nodes[i - 1].background; // If there is no bg in this single then we take one from behind us.
      }
      if (single.character == undefined) {
        console.error("[e] Does not have ch! grabbing one from behind us which is: " + this.nodes[i - 1].character)
        single.character = this.nodes[i - 1].character; // If there is no char in this single then we take one from behind us.

      }

      if (!this.backgrounds.has(single.bg)) {
        
        // If the background map has this specific background ID already we skip. If not...
        payload = await this.getBackground(single.bg); // we store the payload of the db request
        
        this.backgrounds.set(single.bg, payload); // we set it in this map
      }

      //console.log(i + `_${single.mood}`);
      if (!this.characters.has(single.character) || single.mood != undefined) {
        if (!this.characters.has(single.character)) console.log("[ch] Char not logged, getting the payload. Payload ID:" + single.character);
        
        
        // If the character mpa has the char id already we skip.
        payload = await this.getCharacter(single.character);
        
        if (single.mood) {
          
          payload = await payload.getVariant(single.mood); // If the character is a variant, we can substitute
         
          single.character = payload.getId();
        }

        this.characters.set(single.character, payload);
      }

      this.nodes.push(new NodeSingle(single, i)); // Push it into our arra of nodes.

      i++;
    }


    // Build the node length if the legnth is less than or equal to 10.
    
    if (this.nodes.length <= 10) {
      for (const node of this.nodes) { // for every node in here
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
      content: `>>> ${this.characters.get(this.nodes[0].character).name} >> ${this.nodes[0].text}`,
      files: [(this.nodes[0].built ? this.nodes[0].built_img : await this.buildNode(0))],
      //attachments: [build],
      components: await this.action()
    }
    if (this.interaction.isCommand()) {
      if (this.interaction.deferred) {
        console.log("deferred")
        await this.interaction.editReply(payload);
      } else {
        await this.interaction.reply(payload);
      }
    }
    if (this.interaction.isButton()) {
      if ("update" in this.interaction) await this.interaction.update(payload);
    }
  
    this.message = await this.interaction.fetchReply();

    this.collectButton(this.filter);
  }

  async setPage(index: number = this.index) {
    if (index < 0 || index > this.nodes.length - 1) return;
    this.index = index;
    const payload = {
      content: `>>> ${this.characters.get(this.nodes[index].character).name} >> ${this.nodes[index].text}`,
      files: [(this.nodes[index].built ? this.nodes[index].built_img : await this.buildNode(index))],
      attachments: [],
      components: await this.action()
    }
    await this.interaction.editReply(payload)
    //await this.interaction.editReply(payload);

  }

  private async collectButton(filter: Function) {
    this.buttonCollector = this.message.createMessageComponentCollector({
      filter,
      componentType: "BUTTON",
      time: 10000,
    });
    this.buttonCollector.on("collect", (interaction: ButtonInteraction) => {
      const button = interaction.customId.match(/(\d{1,1})/g)[0];
      this.emit("buttonCollected", button)
      this.buttonCollector.on('end', () => {
        this.emit("end");
      
      });

      switch (parseInt(button)) {
        case 0:
          this.setPage(this.index - 1)
          break;
        case 1:
          this.setPage(this.index + 1);
          break;
        case 2:
          
          break;


      }
    });
  }

  async action(): Promise<MessageActionRow[]> {
    const buttons = [
      {
        disabled: this.index > 0 ? false : true,
        label: "Back",
        style: 1,
      },
      {
        disabled: (this.index >= this.nodes.length - 1? true : false) || (this.nodes[this.index].isChoiced),
        label: "Next",
        style: 1,
      },
      {
        disabled: !(this.nodes[this.index].isChoiced),
        label: "Confirm Selection",
        style: 1,
      }
    ];

    let i = 0;
    const buttonRow = new MessageActionRow();

    for (const button of buttons) {
      buttonRow.addComponents(
        new MessageButton()
          .setDisabled(
            button.hasOwnProperty("disabled") ? button.disabled : false
          )
          .setCustomId("NOVEL.button_" + i.toString() + "_user_" + this.interaction.user.id)
          .setLabel(button.hasOwnProperty("label") ? button.label : null)
          //.setEmoji(button.hasOwnProperty("emj") ? button.emj : null)
          .setStyle(button.style)
      );
      i++;
    }
    //console.log(buttonRow)

    return [buttonRow];

  }

  public async end() {
    this.emit("end")
    if (/*!this.selectCollector.ended ||*/ !this.buttonCollector.ended) {
      /*(await this.selectCollector.stop()*/
      this.buttonCollector.stop()
    
    }
 
   
    
  }
}
