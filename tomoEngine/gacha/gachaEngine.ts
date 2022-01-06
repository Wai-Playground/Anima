import {
  Canvas,
  createCanvas,
  Image,
  loadImage,
  NodeCanvasRenderingContext2DSettings,
} from "canvas";
import {
  ButtonInteraction,
  CollectorFilter,
  InteractionCollector,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageButton,
  User,
} from "discord.js";
import engineBase from "../base";
import Queries from "../queries";
import {
  AmadeusInteraction,
  Banner_Payload,
  Drops,
  Economy_Payments_String,
} from "../statics/types";
import Background from "../tomoClasses/backgrounds";
import Character from "../tomoClasses/characters";
import DBUsers from "../tomoClasses/users";

class Strips {
  banner: Banner_Payload;
  attachment: MessageAttachment;
  cost: {
    amount: number;
    type: Economy_Payments_String;
    _id?: number | string;
  };
  roll_amount: number = 1;

  constructor(payload: Banner_Payload) {
    this.banner = payload;
    this.cost = payload.cost;
  }

  async canUserRoll(user: DBUsers, amount: number = this.roll_amount) {
    switch (this.cost.type) {
      case "tickets":
          console.log(`${user.tickets} - ${amount}`);
        if (user.tickets < this.cost.amount * amount) return false;
        break;
      case "currency":
          console.log(`${user.currency} - ${amount}`);
        if (user.currency < this.cost.amount * amount) return false;
        break;
      case "items":
          console.log(`${user.inventory} - ${amount}`);
        const items = user.getItemFromInv(this.cost._id as number);
        if (items == null || items.amount < amount) return false;
        break;
    }
    return true
  }
}

export default class GachaEngine extends engineBase {
  active_banners: Array<Strips> = [];
  width = 720;
  height = 220;
  selection: number = 0;
  canvas = createCanvas(this.width, this.height);
  characters: Map<number | string, Character> = new Map<
    number | string,
    Character
  >();
  backgrounds: Map<number | string, Background> = new Map<
    number | string,
    Background
  >();
  loaded_ch: Map<number | string, Image> = new Map();
  loaded_bg: Map<number | string, Image> = new Map();
  banner_messages: Array<Message<boolean>> = [];
  filter: Function = async (i: any) => {
    await i.deferUpdate();
    return i.user.id === this.interaction.user.id;
  };
  buttonCollector: InteractionCollector<ButtonInteraction>;
  //interaction: AmadeusInteraction;
  constructor(user: User, interaction: AmadeusInteraction) {
    super(user, interaction);
    this.interaction = interaction;
    this.prepareAssets();
  }

  async start(strips: Array<Strips> = this.active_banners) {
    let msg: Message<boolean>;
    this.interaction.reply("Here are the currently running banners.\n\n");
    for (const banners of strips) {
      msg = await this.interaction.channel.send({
        components: await this.action(),
        content: banners.banner.body,
        files: [banners.attachment],
      });
      this.banner_messages.push(msg);
      this.collectButton(msg);
    }
  }

  async updateButton(message: Message<boolean>) {
    const buttons = await this.action();
    message.edit({
      components: buttons,
    });
  }

  async roll(strip: Strips) {
      for (const msgs of this.banner_messages) msgs.deletable ? msgs.delete : null;
      //this.interaction.followUp()

  }

  // return a promise of message components that are the buttons for the banenr messages.
  // one button is to increase the roll number and another is to
  async action(stage: number = 0) {

  }

  async collectButton(message: Message<boolean>, filter: any = this.filter) {
    this.buttonCollector = message.createMessageComponentCollector({
      filter: filter,
      componentType: "BUTTON",
      time: 60000,
    });
    this.buttonCollector.on("collect", (interaction: ButtonInteraction) => {
      const button = interaction.customId.match(/(\d{1,1})/g)[0];
      this.emit("buttonCollected", button);

      switch (parseInt(button)) {
        case 0:
            this.active_banners[this.selection].roll_amount--;
          this.updateButton(message);
          break;
        case 2:
            this.active_banners[this.selection].roll_amount++;
          this.updateButton(message);
          break;
        case 1:
          break;
      }
    });

    this.buttonCollector.on("end", () => {
      this.emit("end", "timed_out");
    });
  }

  async build(strips: Strips) {
    let ret: MessageAttachment;
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.quality = "fast";
    ctx.patternQuality = "fast";
    let bg: Image, ch: Image;

    const customID: string = `Strip_userID_${this.interaction.user.id}_node_${strips.banner._id}_.jpeg`,
      content = strips.banner.headers.content,
      ch_id = strips.banner.headers.ch,
      bg_id = strips.banner.headers.bg;

    if (this.loaded_bg.has(bg_id)) {
      bg = this.loaded_bg.get(bg_id);
    } else {
      bg = await loadImage(
        "./assets/backgrounds/" + this.backgrounds.get(bg_id).link
      );
      this.loaded_bg.set(bg_id, bg);
    }

    if (this.loaded_ch.has(ch_id)) {
      ch = this.loaded_ch.get(ch_id);
    } else {
      ch = await loadImage(
        "./assets/characters/" + this.characters.get(ch_id).link
      );
      this.loaded_ch.set(ch_id, ch);
    }

    ctx.drawImage(bg, 0, 0, this.width, this.height);
    ctx.font = "120px sans-serif";
    ctx.fillText(content, this.width / 2, this.height / 2);
    ctx.drawImage(ch, 0, 0);
    ret = new MessageAttachment(
        this.canvas.toBuffer("image/jpeg", { quality: 0.5 }),
        customID
      );

    return ret;
  }

  async prepareAssets() {
    // Definition block
    const payload = await Queries.getBanners();
    // Curate the banners so that only the active ones are pushed.
    for (const banner of payload)
      banner.active ? this.active_banners.push(new Strips(banner)) : null;

    for (const strips of this.active_banners) {
      if (!this.characters.has(strips.banner.headers.ch))
        this.characters.set(
          strips.banner.headers.ch,
          await this.getCharacter(strips.banner.headers.ch)
        );

      if (!this.backgrounds.has(strips.banner.headers.ch))
        this.backgrounds.set(
          strips.banner.headers.ch,
          await this.getBackground(strips.banner.headers.ch)
        );

      strips.attachment = await this.build(strips);

    }

    process.nextTick(() => {
      this.emitReady();
    });
  }
}
