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
  Message,
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
  AmadeusInteraction,
} from "./statics/types";
import Tomo_Dictionaries from "./statics/tomo_dict";
import Novel from "./novel";
import { TomoError } from "./statics/errors";
import Queries from "./queries";
import Story from "./tomoClasses/story";
import { NodeSingle } from "./novel";
import Items from "./tomoClasses/items";
import Background from "./tomoClasses/backgrounds";
import { APIMessage } from "discord-api-types";

class Cards {
  ch: number;
  bg: number;
  chInUser: CharacterInUser;
  built_img: MessageAttachment;

  constructor(chInUser: CharacterInUser) {
    this.chInUser = chInUser;
    this.ch = chInUser.originalID;
    this.bg = chInUser.bg;
  }
}
/**
 * @author Shokkunn
 * @description | final complete package for the engine.
 */
class TomoEngine extends engineBase {
  width: number = 800;
  height: number = 920;
  cards: Array<Cards>;
  novel: Novel;
  DBUser: DBUsers;
  itemInWheel: Array<ItemInUser>;
  itemDbWheel: Array<Items | "broke">;
  index: number = 0;
  message: Message | APIMessage

  characters: Map<number, Character>
  backgrounds: Map<number, Background>

  buttonCollector: InteractionCollector<ButtonInteraction>;
  selectCollector: InteractionCollector<SelectMenuInteraction>;
  constructor(interaction: AmadeusInteraction) {
    super(interaction.user, interaction);
    this.interaction = interaction as AmadeusInteraction;
    this.prepareAsset();
  }
  
  async buildCharacterCard(card: Cards): Promise<Cards> {
    const canvas: Canvas = createCanvas(this.width, this.height);
    const ctx: NodeCanvasRenderingContext2D = canvas.getContext("2d");

    const bg: Image = await loadImage(
      this.backgrounds.get(card.bg).link
    );
    const ch: Image = await loadImage(
      this.characters.get(card.ch).link
    );

    ctx.drawImage(bg, 0, 0);
    ctx.drawImage(ch, 0, 0, ch.naturalWidth, ch.naturalHeight);
    

    card.built_img = new MessageAttachment(
      canvas.toBuffer("image/jpeg"),
      `tomo_userID_${this.DBUser._id}_node_${this.index}_CH${card.ch}+BG${card.bg}.jpg`
    );

    return card;
  }
  

  get_tree(archetype: Char_Archetype_Strings): Ship_Tree {
    return Tomo_Dictionaries.char_tree(archetype);
  }

  /**
   * Prepares asset to view.
   */
  async prepareAsset() {
    this.itemDbWheel = [];
    this.itemInWheel = [];
    this.cards = [];

    this.backgrounds = new Map()
    this.characters = new Map()

    this.DBUser = this.interaction.DBUser

    for (const characters of this.DBUser.tomodachis) {
      this.cards.push(new Cards(characters))
      if (!this.characters.has(characters.originalID)) this.characters.set(characters.originalID, await this.getCharacter(characters.originalID))
      if (!this.backgrounds.has(characters.bg)) this.backgrounds.set(characters.bg, await this.getBackground(characters.bg))
    }

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

  static convertNumberToTempMoodType(mood: number) {
    if (mood > Object.keys(Temp_MoodType).length / 2) return; // sad
    return Temp_MoodType[Math.floor(mood)] as Temp_MoodTypeStrings;
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
    card: Cards = this.cards[this.index],
    action: Tomo_Action
  ): Promise<Story> {
    let idOfStory: number, story: Story;

    if (this.novel || !this.checkIfActionCanBeDone(card, action)) return;
    let curMood = TomoEngine.convertNumberToTempMoodType(
      card.chInUser.moods.current
    );

    try {
      idOfStory = this.characters.get(card.ch).getRandInterStoryId(action);
      console.log(idOfStory);
      if (idOfStory == -1)
        throw new TomoError("No story found for this action.");
    } catch (e) {
      console.log(e);
    }


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
    console.log(card.chInUser._flags.includes(action))
    if (card.chInUser._flags.includes(action)) return true;
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
    card: Cards = this.cards[this.index]
    
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
    this.itemInWheel = this.DBUser.inventory.filter((items) => items.amount > 0);

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
    card: Cards = this.cards[this.index]
  ): Promise<NodeSingle> {
    let res: keyof Gift_Responses, mood: Temp_MoodTypeStrings = "sad", variantMood: Character, ch = this.characters.get(card.ch),
    response: Single = {
      mood: mood,
      text: this.characters.get(card.ch).getRandomGiftResponse("none"),
      backable: false
    }
    

    if (receivedItem == "broke") {
      variantMood = await this.characters.get(card.ch).getVariant(mood)
      this.novel.deployChar(variantMood)
      response.character = variantMood.getId;
      return new NodeSingle(response);
    }

    
    let itemGrade: number = receivedItem.gradeInt
    
    if (itemGrade > ch.gradeInt) mood = "happy", res = "above";

    if (itemGrade == ch.gradeInt) res = "average";

    if (itemGrade < ch.gradeInt) mood = "sad", res = "below";


    if (ch.likes.includes(receivedItem.getId as number)) mood = "happy", res = "likes";
    if (card.chInUser.inventory.find(invItem => invItem.itemID == receivedItem.getId)) mood = "sad", res = "duplicate";
    if (ch.dislikes.includes(receivedItem.getId as number)) mood = "annoyed", res = "dislikes"
    
    
    
    variantMood = await ch.getVariant(mood)
    this.novel.deployChar(variantMood)


    response.text = ch.getRandomGiftResponse(res);
    response.mood = mood;
    response.character = variantMood.getId;

    

    return new NodeSingle(response)
  }

  appendEndScreen() {

  }

  async gift(card: Cards = this.cards[this.index]) {
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
          // Inventory management
          this.DBUser.removeFromInventory(item.getId as number, 1);
          this.DBUser.addToTomoInventory(card.ch as number, item.getId as number, 1);
          
          await this.DBUser.updateInventory()
          await this.DBUser.updateTomo()
        }
      },
      this.novel
    );
    
  }

  async interact(card: Cards = this.cards[this.index]) {}

  async start() {
    this.interaction.editReply({content: "Hi",components: await this.action()})
    this.message = await this.interaction.fetchReply() as Message
    
  }

  async action() {
    let ret: Array<MessageActionRow> = [], buttonRow = new MessageActionRow(), i = 0;

    const buttons = [
      {
        disabled: true,
        label: "Info",
        style: 3
      },
      {
        disabled: !this.checkIfActionCanBeDone(this.cards[this.index], "interact"),
        label: "Interact",
        style: 1,
      },
      {
        disabled: true,
        label: "Delete",
        emj: "<:trash:886429816260280374>",
        style: 4
      }
    ]

    for (const button of buttons) {
      buttonRow.addComponents(
        new MessageButton()
          .setDisabled(
            button.hasOwnProperty("disabled") ? button.disabled : false
          )
          .setCustomId(
            "TOMO.button_" + i.toString() + "_user_" + this.interaction.user.id
          )
          .setLabel(button.hasOwnProperty("label") ? button.label : null)
          .setEmoji(button.hasOwnProperty("emj") ? button.emj : null)
          .setStyle(button.style)
      );
      i++;
    }
    ret.push(buttonRow)

    return ret;
    

    
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
