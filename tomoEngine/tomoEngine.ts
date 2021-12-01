
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
import Tomo from "./tomo";
import Character from "./tomoClasses/characters";
import DBUsers from "./tomoClasses/users";
import { CharacterInUser } from "./statics/types";





class Cards {
  bg: string
  ch: Character
  chInU: CharacterInUser
  built: boolean
  built_img: MessageAttachment
  constructor(
    bg: string,
    ch: Character,
    chInU: CharacterInUser

  ) {
    this.bg = bg;
    this.ch = ch;
    this.chInU = chInU

  }

}
/**
 * @author Shokkunn
 * @description | final complete package for the engine.
 */
class TomoEngine extends engineBase {
  width: number = 800;
  height: number = 920;
  authorDB: DBUsers
  characters: Map<number, Character>
  cards: Array<Cards>



  buttonCollector: InteractionCollector<ButtonInteraction>;
  selectCollector: InteractionCollector<SelectMenuInteraction>;
  constructor(
    interaction: CommandInteraction
  ) {
    super(interaction.user, interaction);
    this.interaction = interaction
    this.prepareAsset();

  }
  async buildCharacterCard(card: Cards): Promise<Cards> {
    const canvas: Canvas = createCanvas(this.width, this.height);
    const ctx: NodeCanvasRenderingContext2D = canvas.getContext("2d");

    const bg: Image = await loadImage(
      card.bg
    );
    const ch: Image = await loadImage(
      card.ch.link
      
    );

    ctx.drawImage(bg, 0, 0, this.width, this.height);
    ctx.drawImage(ch, 0, 0, ch.naturalWidth, ch.naturalHeight);
    
    card.built = true;
    card.built_img = new MessageAttachment(
      canvas.toBuffer("image/jpeg"),
      `tomo_userID_${this.authorDB._id}_node_${card.ch._id}_${card.ch.getName}.jpg`
    );

    return card;
  }
  

  /**
   * Prepares asset to view.
   */
  async prepareAsset() {
    this.cards = [];
    this.authorDB = await this.getUserUniverse(this.discUserObj.id)
    let bgObj = await this.getBackground(0)

    let i = 0;
    for (const friend of this.authorDB.tomodachis) {
      this.cards.push(new Cards(bgObj.link, await this.getCharacter(friend.originalID), friend))
      this.cards[i] = await this.buildCharacterCard(this.cards[i])
      i++;
    }
    
    this.emitReady()
    
    
    

  }

  async gift() {

  }

  async hug() {

  }

  async kiss() {

  }

  async start() {
    this.cards[0].built_img
    this.interaction.editReply({ files: [this.cards[0].built_img]})
  }

  async action() {

  }




}

export = TomoEngine;
