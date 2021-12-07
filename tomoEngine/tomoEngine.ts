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
  Tomo_Action,
  Single,
  Argument,
  Mood_States,
  Char_Archetype_Strings,
  User_Flags,
  Char_Flags,
  Ship_Branch,
  ItemInUser,
  Gift_Responses,
} from "./statics/types";
import Tomo_Dictionaries from "./statics/tomo_dict";
import Novel from "./novel";
import { TomoError } from "./statics/errors";
import Queries from "./queries";
import Story from "./tomoClasses/story";
import { NodeSingle } from "./novel";
import Items from "./tomoClasses/items";

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
  novel: Novel;
  DBUser: DBUsers;
  itemInWheel: Array<ItemInUser>;
  itemDbWheel: Array<Items | "broke">;

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

  get_tree(archetype: Char_Archetype_Strings): Ship_Tree {
    return Tomo_Dictionaries.char_tree(archetype);
  }

  /**
   * Prepares asset to view.
   */
  async prepareAsset() {
    this.itemDbWheel = [];
    this.itemInWheel = [];
    process.nextTick(() => {
      this.emitReady();
    });
  }

  /**
   * buildCard()
   * @param curTomoID | ID of the current tomo
   * @param user_id | user id of the author
   * @returns Card
   */
  static async buildCard(curTomoID: number, user_id: number | string) {
    let user = new DBUsers(user_id, await Queries.userUniverse(user_id));
    if (!user.getTomoFromDachis(curTomoID))
      throw new TomoError("Tomo not found in user's collection.");
    return new Cards(
      curTomoID,
      new Character(curTomoID, await Queries.character(curTomoID)),
      user
    );
  }

  static convertNumberToTempMoodType(mood: number) {
    if (mood > Object.keys(Temp_MoodType).length / 2) return; // sad
    return Temp_MoodType[Math.floor(mood)] as Temp_MoodTypeStrings;
  }

  static convertNumberToMoodType(mood: number) {
    let sanitized = Math.floor(mood / 10);
    if (sanitized > Object.keys(Mood_States).length / 2) return;

    return Mood_States[sanitized] as Mood_States_Strings;
  }

  static convertNumberToMoodTypeNumber(mood: number) {
    if (Math.floor(mood / 10) > Object.keys(Mood_States).length / 2) return;
    return Math.floor(mood) as number;
  }

  /**
   *
   * @param card | card to
   * @param action | action to perform
   * @returns Novel
   */
  async getStoryJSON(
    card: Cards = this.cards[this.curChar],
    action: Tomo_Action
  ): Promise<Story> {
    let idOfStory: number, story: Story;

    if (this.novel || !this.checkIfActionCanBeDone(card, action)) return;
    let curMood = TomoEngine.convertNumberToTempMoodType(
      card.chInUser.moods.current
    );

    try {
      idOfStory = card.ch.getRandInterStoryId(action);
      console.log(idOfStory);
      if (idOfStory == -1)
        throw new TomoError("No story found for this action.");
    } catch (e) {
      console.log(e);
    }

    console.log(curMood);
    story = await this.getStoryUniverse(idOfStory); // get the json of the story
    if (curMood != "main" && action != "gift") {
      try {
        let payload: Story = await story.getVariant(curMood); // then get the variant of the story if needed
        story = payload;
      } catch (e) {
        console.log(e);
      }
    }
    console.log(story);
    return story;
  }

  checkIfActionCanBeDone(
    card: Cards,
    action: Tomo_Action = "interact"
  ): boolean {
    if (card.chInUser._flags.find((flag) => flag == action)) return true;
    return false;
  }

  static checkIfItemIsGiftable(dbItem: Items) {
    return true;
  }

  /**
   *
   * @param card
   */

  async fillSelectWithInv(
    card: Cards = this.cards[this.curChar]
    
  ): Promise<Array<Argument>> {
    let dbItem: Items, i: number = 1,
      ret: Array<Argument> = [
        {
          route: "$next",
          label: "I have nothing...",
          value: i.toString(),
        },
      ]
      
    this.itemDbWheel.push("broke");
    this.itemInWheel = card.user.inventory.filter((items) => items.amount > 0);

    if (this.itemInWheel.length <= 0) return ret;
    

    // when the user has an inventory
    for (const items of this.itemInWheel) {
      dbItem = await this.getItemUniverse(items.itemID);
      if (TomoEngine.checkIfItemIsGiftable(dbItem)) {
        if (i <= 25) {
          this.itemDbWheel.push(dbItem);
          ret.push({
            route: "$next",
            label: `(x${items.amount}) `+ dbItem.formattedName,
            emoji: dbItem.emoji,
            value: i.toString(),
          });

          i++;
        } else break;
      }
    }
    return ret;
  }

  async react(
    receivedItem: Items | "broke",
    card: Cards = this.cards[this.curChar]
  ): Promise<NodeSingle> {
    let res: keyof Gift_Responses, mood: Temp_MoodTypeStrings = "sad", variantMood: Character,
    response: Single = {
      mood: mood,
      text: card.ch.getRandomGiftResponse("none"),
      backable: false
    }
    

    if (receivedItem == "broke") {
      variantMood = await card.ch.getVariant(mood)
      this.novel.deployChar(variantMood)
      response.character = variantMood.getId;
      return new NodeSingle(response);
    }
    let itemGrade: number = receivedItem.gradeInt
    
    if (itemGrade > card.ch.gradeInt) mood = "happy", res = "above";

    if (itemGrade == card.ch.gradeInt) res = "average";

    if (itemGrade < card.ch.gradeInt) mood = "sad", res = "below";


    if (card.ch.likes.includes(receivedItem.getId as number)) mood = "happy", res = "likes";
    if (card.ch.dislikes.includes(receivedItem.getId as number)) mood = "annoyed", res = "dislikes"
    
    
    variantMood = await card.ch.getVariant(mood)
    this.novel.deployChar(variantMood)


    response.text = card.ch.getRandomGiftResponse(res);
    response.mood = mood;
    response.character = variantMood.getId;

    

    return new NodeSingle(response)
  }

  appendEndScreen() {

  }

  async gift(card: Cards = this.cards[this.curChar]) {
    let story = await this.getStoryJSON(card, "gift");
    let find = story.multiples.findIndex(
      (single) => single.args?.toString() == "$gift"
    );
    let responseIndex = story.multiples.findIndex(
      (single) => single.args?.toString() == "$response"
    );

    if (find > -1)
      story.multiples[find].args = await this.fillSelectWithInv(card);

    this.novel = new Novel(story, this.interaction, true);
    console.log(story);
    this.novel.once("ready", () => {
      this.novel.start();
    });

    this.actionOnNovelIndex(
      find + 1,
      async () => {
        const item = this.itemDbWheel[this.novel.selection];
        console.log(item)
        this.novel.deployNode(await this.react(item, card), responseIndex, true);
        if (item != "broke") {
          card.user.removeFromInventory(item.getId as number, 1)
          await card.user.updateInventory()
        }
      },
      this.novel
    );
  }

  async interact(card: Cards = this.cards[this.curChar]) {}

  async start() {
    /*
    this.cards[0].built_img
    this.interaction.editReply({ files: [this.cards[0].built_img]})*/
  }

  async actionOnNovelIndex(
    index: number,
    action: Function,
    novel: Novel = this.novel
  ) {
    novel.on("pageChange", (page: NodeSingle) => {
      if (page.index == index) {
        action(page);
      }
    });
  }
}

export = TomoEngine;
