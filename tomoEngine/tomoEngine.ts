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
  User,
} from "discord.js";
import {
  Canvas,
  createCanvas,
  Image,
  loadImage,
  NodeCanvasRenderingContext2D,
} from "canvas";
import engineBase from "./base";
import Character from "./tomoClasses/characters";
import DBUsers from "./tomoClasses/users";
import {
  CharacterInUser,
  Temp_MoodTypeStrings,
  Mood_States_Strings,
  Ship_Tree,
  Temp_MoodType,
} from "./statics/types";
import Tomo_Dictionaries from "./statics/tomo_dict";
import Novel from "./novel";
import { TomoError } from "./statics/errors";
import Queries from "./queries";

class Cards {
  ch: Character;
  chInUser: CharacterInUser;
  user: DBUsers;

  constructor(chInUserArrID: number, ch: Character, user: DBUsers) {
    this.ch = ch;
    this.user = user;
    this.chInUser = user.getTomoFromDachis(chInUserArrID);
  }
}
/**
 * @author Shokkunn
 * @description | final complete package for the engine.
 */
class TomoEngine extends engineBase {
  width: number = 800;
  height: number = 920;
  authorDB: DBUsers;
  cards: Array<Cards>;
  curChar: number = 0;

  buttonCollector: InteractionCollector<ButtonInteraction>;
  selectCollector: InteractionCollector<SelectMenuInteraction>;
  constructor(interaction: CommandInteraction) {
    super(interaction.user, interaction);
    this.interaction = interaction;
    this.prepareAsset();
  }
  /*
  async buildCharacterCard(card: Cards): Promise<Cards> {
    const canvas: Canvas = createCanvas(this.width, this.height);
    const ctx: NodeCanvasRenderingContext2D = canvas.getContext("2d");

    const bg: Image = await loadImage(
      card.bg
    );
    const ch: Image = await loadImage(
      card.ch.link
    );

    ctx.drawImage(bg, 0, 0);
    ctx.drawImage(ch, 0, 0, ch.naturalWidth, ch.naturalHeight);
    
    card.built = true;
    card.built_img = new MessageAttachment(
      canvas.toBuffer("image/jpeg"),
      `tomo_userID_${this.authorDB._id}_node_${card.ch._id}_${card.ch.getName}.jpg`
    );

    return card;
  }
  */

  get_tree(ch: Character): Ship_Tree {
    return Tomo_Dictionaries.char_tree(ch.archetype);
  }

  /**
   * Prepares asset to view.
   */
  async prepareAsset() {
    
    process.nextTick(() => {
      this.emitReady();
    });
  }
  static async buildCard(curTomoID: number, user_id: number | string) {
    let user = new DBUsers(user_id, await Queries.userUniverse(user_id))
    if (!user.getTomoFromDachis(curTomoID)) throw new TomoError("Tomo not found in user's collection.");
    return new Cards(curTomoID, new Character(curTomoID, await Queries.character(curTomoID)), user)
  }

  async gift(card: Cards) {}

  static convertNumberToTempMoodType(mood: number) {
    if (mood > 6) return;
    return Temp_MoodType[Math.floor(mood)] as Temp_MoodTypeStrings;
  }

  /**
   *
   * @param card
   */
   /**
   *  JUST PROOF OF CONCEPT< REWRITE >
   * @param bot 
   * @param interaction 
   */
  async hug(card: Cards) {
    let curMood = TomoEngine.convertNumberToTempMoodType(
      card.chInUser.moods.current
    );

    let json = await this.getStoryUniverse(card.ch.getRandInterStoryId("hug"));
    if (curMood != "main") json = await json.getVariant(curMood);
    console.log(json);

    let x = new Novel(json, this.interaction, true);
    x.once("ready", () => {
      x.start();
    });

    x.once("end", () => {
      //do some stuff like + or - points.
    })
  }

  async kiss(card: Cards) {}

  async interact(card: Cards) {}

  async start() {
    /*
    this.cards[0].built_img
    this.interaction.editReply({ files: [this.cards[0].built_img]})*/
  }

  async action() {}
}

export = TomoEngine;
