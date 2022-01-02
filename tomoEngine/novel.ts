/**
 * @author Wai
 * I am going to actively try to comment instead of going with the flo
 */

import {
  ButtonInteraction,
  MessageAttachment,
  MessageActionRow,
  SelectMenuInteraction,
  MessageButton,
  InteractionCollector,
  MessageSelectMenu,
  MessageSelectOptionData,
  MessageEmbed,
  ColorResolvable,
} from "discord.js";
import engineBase from "./base";
import { Single, Scripts, Temp_MoodTypeStrings, AmadeusInteraction} from "./statics/types";
import Background from "./tomoClasses/backgrounds";
import Character from "./tomoClasses/characters";

import {
  Canvas,
  createCanvas,
  Image,
  loadImage,
  NodeCanvasRenderingContext2D,
} from "canvas";

import { NovelError, TomoError } from "./statics/errors";
import TomoEngine from "./tomoEngine";

export class NodeSingle implements Single {
  index: number;
  character: number | string;
  background: number | string;
  text: string;
  mood?: Temp_MoodTypeStrings;
  isChoiced: boolean;
  route?: number | Scripts;
  built: boolean = false;
  built_img: MessageAttachment;
  choices?: Array<MessageSelectOptionData>;
  placeholder?: string;
  script: Scripts
  lookUpArr?: Array<Scripts | number>;
  backable: boolean;

  constructor(single: Single, index: number = null) {
    this.index = single.index || index;
    this.character = single.character;
    this.background = single.bg;
    this.text = single.text;
    this.script = single.script;
    this.mood = single.hasOwnProperty("mood") ? single.mood : null;
    this.backable = single.hasOwnProperty("backable") ? single.backable : true;
    this.route = single.hasOwnProperty("route") ? single.route : "$next";

    this.isChoiced = single.hasOwnProperty("args") ? true : false;
    if (this.isChoiced) {
      this.placeholder = single.hasOwnProperty("placeholder")
      ? single.placeholder
      : "Select an option...";
      if (typeof single.args == "string") return;
      this.choices = [];
      this.lookUpArr = [];
      let i = 0;
      for (const arg of single.args) {
        this.choices.push({
          label: arg.label,
          emoji: arg.emoji || "💬",
          value: i.toString(),
        });
        this.lookUpArr.push(arg.route);
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
  loaded_ch: Map<number | string, Image>;
  canvas: Canvas;
  loaded_bg: Map<number | string, Image>;
  multiples: Array<Single>;
  nodes: Array<NodeSingle>;
  index: number;
  height: number = 480;
  width: number = 724;
  selection: number;
  ephemeral: boolean;
  filter: Function = async (i: any) => {
    await i.deferUpdate();
    return i.user.id === this.interaction.user.id;
  };
  message: any;
  buttonCollector: InteractionCollector<ButtonInteraction>;
  selectCollector: InteractionCollector<SelectMenuInteraction>;
  /**
   * Constructor for Novel.
   * @param json | JSON file to parse.
   * @param interaction | Interaction class to get information about user, channel, etc.
   */

  constructor(
    json: object,
    interaction: AmadeusInteraction,
    ephemeral: boolean
  ) {
    super(interaction.user, interaction);

    // Declare variables.
    this.json = json;
    this.name = this.json.hasOwnProperty("name") ? this.json.name : null;
    this.interaction = interaction;
    this.backgrounds = new Map();
    this.canvas = createCanvas(this.width, this.height);
    this.characters = new Map();
    this.loaded_ch = new Map();
    this.loaded_bg = new Map();
    this.index = 0;
    this.ephemeral = ephemeral;
    this.nodes = [];
    this.prepareAssets();
  }



  async buildNode(index: number = this.index): Promise<MessageAttachment> {
    console.log("RENDERING_NODE_" + index)
    console.time("build_"+index)
    
    const ctx: NodeCanvasRenderingContext2D = this.canvas.getContext("2d")
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.quality = "fast";
    ctx.patternQuality = "fast";
    const customID: string = `novel_userID_${this.interaction.user.id}_node_${index}_${this.name}.jpeg`,
    find_similar_node: NodeSingle = this.nodes.find(node => node.character == this.nodes[index].character && node.background == this.nodes[index].background && node.built == true)
    let bg: Image, ch: Image;
    //console.log(find_similar_node.text)

    // Check if there is already a built image like this in our class.
    if (find_similar_node) {
      this.nodes[index].built = true;
      this.nodes[index].built_img = find_similar_node.built_img;
      console.log("FOUND SAME CH AND BG")
      console.timeEnd("build_"+index)
      
      
      return this.nodes[index].built_img;
    }
    if (this.loaded_bg.has(this.nodes[index].background)) {
      bg = this.loaded_bg.get(this.nodes[index].background)

    }

    if (this.loaded_ch.has(this.nodes[index].character)) {
      ch = this.loaded_ch.get(this.nodes[index].character)
      
    }

    ctx.drawImage(bg, 0, 0, this.width, this.height);
    //ctx.clearRect(0, 0, this.width, this.height)
    ctx.drawImage(ch, 0, 0);

    /** Draw pfp */
    /*

    ctx.beginPath();

    ctx.arc(80, 405, 60, 0, Math.PI * 2, true);

    ctx.closePath();

    ctx.clip();

    const avatar = await loadImage(this.interaction.user.displayAvatarURL({ format: 'jpg' }));
		ctx.drawImage(avatar, 20, 345, 120, 120);
    */

    this.nodes[index].built = true;
    this.nodes[index].built_img = new MessageAttachment(
      this.canvas.toBuffer("image/jpeg", {quality: 0.5}),
      customID
    );
    console.timeEnd("build_"+index)
    
    
    return this.nodes[index].built_img;
  }

  parseScript(str: Scripts): void {
    console.log(str + " STR")
    console.log(this.index + " INDX")
    console.log(this.index + 1)
    switch (str) {
      case "$flag_b" || "$flag_g":
        this.end()
        break;
      case "$beginEnd":
        this.setPage(this.nodes.findIndex(node => node.script == "$beginEnd") || this.nodes.length - 1);
        break;
      case "$next":
        this.setPage(this.index + 1);
        break;
    }
  }

  deployNode(node: NodeSingle, index: number, destroy: boolean = false) {
    console.log("WORKKKKKKKKKKKKKKKKKKKKKKKKK")
    node.index = index;
    if (!node.character) node.character = this.nodes[index - 1].character;
    if (!node.background) node.background = this.nodes[index - 1].background;
    //if (!node.route)node.route = this.nodes[index - 1].route
    if (this.nodes.length < index) this.nodes.push(node);

    if (destroy == false) this.nodes.map((tenant) => {
      if (tenant.index >= index) {
        if (typeof tenant.route == "number") tenant.route++;
        console.log(tenant)
        tenant.index++;
      }
    })

    this.nodes.splice(index, (destroy ? 1 : 0), node)
    console.log(this.nodes)
    this.buildNode(index)

  }

  async deployChar(char: Character, id: number | string = char.getId) {
    //if (this.characters.has(char.getId)) throw new TomoError("Found duplicate char in memory bank.")
    console.log("DEPLOYING CHAR")
    this.characters.set(id, char)
    this.loaded_ch.set(id, await loadImage(`./assets/characters/${char.link}`))
    return;

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
        this.loaded_bg.set(single.bg, await loadImage(`./assets/backgrounds/${payload.link}`))
        this.backgrounds.set(single.bg, payload);
      }

      if (!this.characters.has(single.character) || single.mood != undefined) {
        // If cache dont have character or the mood is defined:

        if (!this.characters.has(single.character))
          console.log(
            "[ch] Char not logged, getting the payload. Payload ID:" +
            single.character
          );

        // If the character mpa has the char id already we skip.
        payload = await this.getCharacter(single.character);
        
        if (single.mood) {
          if (payload.narrator) throw new TomoError("Narrator found within a character only clause. (mood)")
          payload = await payload.getVariant(single.mood); // If the character is a variant, we can substitute the main payload with this.

          single.character = payload.getId;
        }
        if (payload.link == null) { // If the link is null:
          if (i > 0) payload.link = this.characters.get(this.nodes[i - 1].character).link; //get from past character if we are index > 0;
          if (i <= 0) payload.link = "loser.png"// just transparnt png if we we are at index 0;
        } 

        await this.deployChar(payload, single.character)


      }
      if (single.text.includes("$")) {
        console.log(single.text + "_TEXT_TO_PARSE")
        single.text = this.parseCharacterScript(single.text, payload as Character)
      }; // If this single has a $ in it we run it through this funcion and replace it with this.

      this.nodes.push(new NodeSingle(single, i)); // Push it into our arra of nodes.

      i++;
    }
    // Build the node length if the legnth is less than or equal to 10.
    if (this.nodes.length <= 10) {
      for (const node of this.nodes) {
        // for every node in here
        if (node.index != 0) this.buildNode(node.index); // call the build function
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
    /*
    const payload = {
      content:  `「**${
        this.characters.get(this.nodes[0].character).name
      }**」•  ${this.nodes[0].text}`,
      attachments: [],
      embeds:[],
      files: [
        this.nodes[0].built
          ? this.nodes[0].built_img
          : await this.buildNode(0),
      ],
      //attachments: [build],
      components: await this.action(),
    };*/
    await this.setPage(0);
    /*
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
    */

    this.message = await this.interaction.fetchReply();

    if (this.buttonCollector == undefined) this.collectButton(this.filter);
    if (this.selectCollector == undefined) this.collectSelect(this.filter);
  }

  async setPage(index: number = this.index) {
    if (index < 0 || index > this.nodes.length - 1) return;
    this.emit("pageChange", this.nodes[index]);
    this.index = index;
    this.selection = undefined;
    const character = this.characters.get(this.nodes[index].character), text = this.nodes[index].text,
    final_text = `${text}`
    /*
    embed = new MessageEmbed()
    .addField(character.name, final_text)
    .setColor(await TomoEngine.rarityColor(character.gradeInt) as ColorResolvable)*/
    //.setFooter("Test")
    //.setTimestamp()
    //.set(`ㅤ`.repeat(31))
    const payload = {
      //embeds: [embed],
      files: [
        this.nodes[index].built
          ? this.nodes[index].built_img
          : await this.buildNode(index),
      ],
      content: `${character.emoji}「**${
        this.characters.get(this.nodes[index].character).name
      }**」${this.nodes[index].text}`,
      attachments: [],
      components: await this.action(),
    };
    await this.interaction.editReply(payload);
    if (index == this.nodes.length - 1) return this.end();
    this.refreshCoolDown();
    

    //await this.interaction.editReply(payload);
  }

  private refreshCoolDown() {
    if (this.buttonCollector) this.buttonCollector.resetTimer();
    if (this.selectCollector) this.selectCollector.resetTimer();
  }

  private async collectButton(filter: Function) {
    this.buttonCollector = this.message.createMessageComponentCollector({
      filter,
      componentType: "BUTTON",
      time: 60000,
    });
    this.buttonCollector.on("collect", (interaction: ButtonInteraction) => {
      const button = interaction.customId.match(/(\d{1,1})/g)[0];
      let skript: Scripts | number;
      skript = this.nodes[this.index].route as Scripts | number;
      if (typeof skript == "string") return this.parseScript(skript);

      this.emit("buttonCollected", button);

      switch (parseInt(button)) {
        case 0:
          this.setPage(this.index - 1);
          break;
        case 1:
          skript = this.nodes[this.index].route;
          console.log(skript + "ROUTEEE");
          if (typeof skript == "number") return this.setPage(skript);
          this.setPage(this.index + 1);

          break;
        case 2:
          if (this.selection != undefined) {
            console.log("confirmed");
            skript = this.nodes[this.index].lookUpArr[
              this.selection
            ] as Scripts & number;
            if (typeof skript != "number") return this.parseScript(skript);
            console.log(skript);
            this.setPage(skript);
            
          }

          break;
      }
    });

    this.buttonCollector.on("end", () => {
      this.emit("end", "timed_out");
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
          this.nodes[this.index - 1].isChoiced ||
          !this.nodes[this.index].backable,

        label: "Back",
        style: 1,
      },
      {
        disabled:
          (this.index >= this.nodes.length - 1 ? true : false) ||
          this.nodes[this.index].isChoiced,
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
    if (this.nodes[this.index].isChoiced) {
      if (typeof(this.nodes[this.index].choices) == "string") throw new NovelError("Choices supposed to be set by TomoEngine but is not");
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
              : this.nodes[this.index].choices[this.selection].emoji +
                  " " + this.nodes[this.index].choices[this.selection].label
          )
          .addOptions(this.nodes[this.index].choices)
          
      );

      ret.push(selectRow);
    }

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

        this.selection = parseInt(value);

        this.emit("selectCollected", value);

        this.interaction.editReply({ components: await this.action() });
      }
    );

    this.selectCollector.on("end", () => {
      console.log("select ended!");
      this.emit("end", "timed_out");
    });
  }

  public async end(reason: string = "none") {
    this.emit("end", reason);
    if (/*!this.selectCollector.ended ||*/ !this.buttonCollector.ended) {
      /*(await this.selectCollector.stop()*/
      this.buttonCollector.stop();
    }
  }
}
