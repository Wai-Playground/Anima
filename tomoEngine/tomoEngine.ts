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
import {
  canvasRGB,
  image,
  imageDataRGB
} from "stackblur-canvas"
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
  
  /**
   * Name | buildCharacterCard.
   * @param card | Card to build an image of.
   * @returns Card object. (will have built image but the original object will also have the built img)
   */
  async buildCharacterCard(card: Cards): Promise<Cards> {
    // Prepare canvas.

    const canvas: Canvas = createCanvas(this.width, this.height); // Create Canvas.
    const ctx: NodeCanvasRenderingContext2D = canvas.getContext("2d"); // Get context.

    // Prepare the image objects.

    const bg: Image = await loadImage(
      this.backgrounds.get(card.bg).link // Property "backgrounds" is an internal cache of the Backgrounds objects with their IDs as the key. -
      // card.bg is the ID of the background.
    );

    const ch: Image = await loadImage(
      this.characters.get(card.ch).link // Property "characters" is an internal cache of the Characters objects with their IDs as the key. -
      // card.ch is the ID of the character.
    );

    // This block draws the image.

    ctx.drawImage(bg, 0, 0); // Draw the background. (TODO: EDIT AESTHETICS)
    
    ctx.drawImage(ch, 0, 0, ch.naturalWidth, ch.naturalHeight); // Draw the character (TODO: EDIT AESTHETICS)
    
    // This block sets the card's "build_img" property with the message attachment of the rendered image.

    card.built_img = new MessageAttachment(
      canvas.toBuffer("image/jpeg"),
      `tomo_userID_${this.DBUser._id}_node_${this.index}_CH${card.ch}_BG${card.bg}.jpg`
    );

    return card; // return the card once it has done it's job.
  }
  
  /**
   * Name | get_tree.
   * @param archetype | The character archetype you want to get the tree of. eg. Tsundere, I am dying of cringe, etc.
   * @returns from the Tomo_Dictionaries where the tree is stored as a static object.
   */
  get_tree(archetype: Char_Archetype_Strings): Ship_Tree {
    return Tomo_Dictionaries.char_tree(archetype);
  }

  /**
   * Name | prepareAsset.
   * Prepares asset to view.
   */
  async prepareAsset() {
    // Declare assets.
    this.itemDbWheel = []; // itemDbWheel is an internal inventory db array of the User which we use in conjunction with the novel select to point what item was chosen during a-
    // gifting sequence.
    this.itemInWheel = []; // Item in wheel is the User's inventory filtered to have only amount > than 0.
    this.cards = []; // Each card contains a bg and chInUser. A bg to fill the background of the gui and a ch which is the user's tomos.

    this.backgrounds = new Map() // Internal cache of the backgrounds. (k, v) k = uniBaseID, v = Background object.
    this.characters = new Map() // Internal cache of the characters. (k, v) k = uniBaseID, v = Character object.

    this.DBUser = this.interaction.DBUser; // Shortened version of the DBUser.

    for (const characters of this.DBUser.tomodachis) {

      // For every character in the User's tomodachis, we create a new card and set the bgs and chs to their respective mappings.
      this.cards.push(new Cards(characters))

      // This block adds the characters/backgrounds to the mapping if it's not already mapped.
      if (!this.characters.has(characters.originalID)) this.characters.set(characters.originalID, await this.getCharacter(characters.originalID)) // Ch mappings.
      if (!this.backgrounds.has(characters.bg)) this.backgrounds.set(characters.bg, await this.getBackground(characters.bg)) // Bg mappings.
    }

    process.nextTick(() => {
      this.emitReady(); // Emit ready when everything is setup.
    });
  }

  /**
   * Name | convertNumberToTempMoodType.
   * @param mood | int of the mood you want to turn into a string.
   * @returns | string representation of the temp mood.
   */
  static convertNumberToTempMoodType(mood: number) {
    if (mood > Object.keys(Temp_MoodType).length / 2) return; // Since the enums have both int and string representations, we cut down the length of it by half.
    return Temp_MoodType[Math.floor(mood)] as Temp_MoodTypeStrings; // Then we use the mood int to convert it into a tempMoodType by subbing it. 
  }

  /**
   * Name | getStoryJSON.
   * @param card | Card to get the ch story of.
   * @param action | Action to perform. (Tomo_Action)
   * @returns Novel
   */
  async getStoryJSON(
    card: Cards = this.cards[this.index],
    action: Tomo_Action
  ): Promise<Story> {
    // Define variables.
    let idOfStory: number, story: Story, curMood: Temp_MoodTypeStrings;

    // If there is already a novel init and the action cannot be done, return.
    if (this.novel || !this.checkIfActionCanBeDone(card, action)) return;

    // We get the int representation of the temperature mood.
    curMood = TomoEngine.convertNumberToTempMoodType(
      card.chInUser.moods.current
    );

    try {
      
      idOfStory = this.characters.get(card.ch).getRandInterStoryId(action); // Get a random story from the character's object. 
      console.log(idOfStory);
      if (idOfStory == -1)
        throw new TomoError("No story found for this action." + `Ch: ${card.ch}, User: ${this.DBUser._id}`); 
    } catch (e) {
      console.log(e);
    }


    story = await this.getStoryUniverse(idOfStory); // Get the json of the story.
    if (curMood != "main" && action != "gift") { // If the current mood is main and the action is not gift then-
      try {
        let payload: Story = await story.getVariant(curMood); // Then get the variant of the story if needed.
        story = payload;
      } catch (e) {
        console.log(e);
      }
    }
    console.log(story);
    return story;
  }

  /**
   * Name | checkIfActionCanBeDone.
   * Check if a user can perform the action.
   * @param card 
   * @param action 
   * @returns boolean
   */
  checkIfActionCanBeDone(
    card: Cards,
    action: Tomo_Action = "interact"
  ): boolean {
    console.log(card.chInUser._flags.includes(action))
    if (card.chInUser._flags.includes(action)) return true; // if the ch in user has this flag.
    return false; 
  }

  /**
   * Name | checkIfItemIsGiftable.
   * If the item is giftable returns true.
   * @param dbItem | dbItem 
   * @returns 
   */
  static checkIfItemIsGiftable(dbItem: Items) {
    return true;
  }

  /**
   * Name | fillSelectWithInv.
   * Fills the select menu with giftable items.
   * @returns Array of Drop down menu Arguments. @see Argument types.
   */
  async fillSelectWithInv(): Promise<Array<Argument>> {

    // Definition block.
    let dbItem: Items, i: number = 1, // Start at "1" because we are pre-defining it in the default return Array<Argument> below.
      ret: Array<Argument> = [
        {
          // This is the very first option that the user will have. Which is to say that they have nothing.
          route: "$next",
          label: "I have nothing...",
          value: i.toString(),
        },
      ]
    
    
    this.itemDbWheel.push("broke"); // Push the "broke" item into the itemdbwheel which is a property of this class, to help manipulate it later in the future.

    this.itemInWheel = this.DBUser.inventory.filter((items) => items.amount > 0); // If the items in the inventory are more than "0". 

    if (this.itemInWheel.length <= 0) return ret; // If there is no items just return the default Array of Arguments. Which is just the "I am broke" selection.
    
    // When the user has an inventory.
    for (const items of this.itemInWheel) {
      dbItem = await this.getItemUniverse(items.itemID); // Get dbItem from the db. Since every iteration should be unique (should be), we don't have to check for duplicates.
      if (TomoEngine.checkIfItemIsGiftable(dbItem)) { // Currently every item is giftable.
        if (i <= 25) { // The limit for a selection menu arguments is 25. 
          this.itemDbWheel.push(dbItem); // We push it into our look up table of "itemDBWheel" property.
          ret.push({ // Push it into the return array.
            route: "$next", // Every single route has to be next because its going straight to the buffer then to the response.*
            label: `(x${items.amount}) `+ dbItem.formattedName,
            emoji: dbItem.emoji, // Emojis :)
            value: i.toString(), // The value of the argument is their index in the itemDBWheel which is going to come handy later when we get a selection.
          });

          i++;
        } else break;
      }
    }

    // After all the looping is done and the giftable items are accounted for we return the final inventory.
    return ret;

    //*
    // A Buffer is a space between the two gift nodes ($gift) and ($response).
    // It allows for the bot to build the node of $response right after a $gift selection is made.
    // Normally, it is disguised as the character's "turn" to speak as they receive the gift like: "What you give?" or if its the user's turn: "Here's your gift."
    // Then the $response node should have been built and ready to be shown which will contain the actual response of the character.
    //*
  }

  /**
   * Name | react.
   * @param receivedItem |the item that is being gifted.
   * @param card | card you want to base the reaction off.
   * @returns new NodeSingle Object
   */
  async react(
    receivedItem: Items | "broke",
    card: Cards = this.cards[this.index]
  ): Promise<NodeSingle> {
    // Define variables & defaults. + default response (broke).
    let res: keyof Gift_Responses, mood: Temp_MoodTypeStrings = "sad", variantMood: Character, ch = this.characters.get(card.ch),
    response: Single = {
      mood: mood,
      text: this.characters.get(card.ch).getRandomGiftResponse("none"),
      backable: false
    }
    
    // If the user is broke we return the default response of broke.
    if (receivedItem == "broke") {
      variantMood = await this.characters.get(card.ch).getVariant(mood) // We get the mood of the character.
      this.novel.deployChar(variantMood) // We inject the character into the this.novel object.
      response.character = variantMood.getId // The response of character's ID is now the variantMood. Since the mood is 
      
      return new NodeSingle(response);
    }

    let itemGrade: number = receivedItem.gradeInt // We get the item Grade of the item to compare against the character.
    
    // This block decides what the response will be. Will override the response.
    // Res = are Results, they are defined in the orig ch db and is an arr of text which the ch says after getting a gift.

    if (itemGrade > ch.gradeInt) mood = "happy", res = "above"; // If item grade > character grade. Mood becomes happy, Res becomes above.

    if (itemGrade == ch.gradeInt) mood = "happy", res = "average"; // If item grade == char grade. Mood becomes happy. Res becomes average.

    if (itemGrade < ch.gradeInt) res = "below"; // Mood does not change because default is "sad". Res becomes below.

    if (ch.likes.includes(receivedItem.getId as number)) mood = "happy", res = "likes"; // If the item is included in the character's like sheet.
    if (card.chInUser.inventory.find(invItem => invItem.itemID == receivedItem.getId)) mood = "sad", res = "duplicate"; // If the item is a duplicate in the character's inv.
    if (ch.dislikes.includes(receivedItem.getId as number)) mood = "annoyed", res = "dislikes" // If the item is in the dislike category.

    // They perform special functions:
    // This block is for when the item is a consumable.
    if (receivedItem.itemType == "consumables") {

    }

    // This block is for when the item is equipable.
    if (receivedItem.itemType == "equipables") {

    }
    
    variantMood = await ch.getVariant(mood) // We get the variant mood again, since there may have been a change in the mood.
    this.novel.deployChar(variantMood) // We inject the Character into the novel.

    response.text = ch.getRandomGiftResponse(res); // Random response.
    response.mood = mood; // Mood becomes the moode.
    response.character = variantMood.getId; // The character of the response becomes the mood.

    return new NodeSingle(response) // Return a new NodeSingle of response.
  }

  appendEndScreen() {

  }

  /**
   * Name | gift
   * The gift block where the user can gift items to their tomos.
   * @param card | The card we want to draw the ch and bg from (draw as in take not like render card)
   */
  async gift(card: Cards = this.cards[this.index]) {
    // Declare variables.
    let story: Story, find: number, responseIndex: number;

    story = await this.getStoryJSON(card, "gift"); // Get the story json of the action "gift".
    find = story.multiples.findIndex( // In the story, we find the "$gift" script which indicates a gift node.
      (single) => single.args?.toString() == "$gift"
    );
    responseIndex = story.multiples.findIndex(
      (single) => single.args?.toString() == "$response" // In the story, we find the "$response" script which indicates the response sacrificial lamb node to be written over.
    );

    if (find > -1) // If the find comes out positive (no error, we found "$gift")
      story.multiples[find].args = await this.fillSelectWithInv(); // Then we fill the selection with the user's inventory.

    this.novel = new Novel(story, this.interaction, true); // Initiate a new Novel (see story variable.).
    console.log(story);

    this.novel.once("ready", () => {
      this.novel.start(); // Start the novel when ready.
    });

    // This block is the main part of the gifting sequence, this:
    // 1. Sacrifices a node to become the response.
    // 2. Makes the inventory and tomodachi changes to reflect what was gifted.

    this.actionOnNovelIndex(
      find + 1, // Variable "find" is a number that has the index of "$gift" node. So we want to run the function AFTER an item is selected and the user has-
      // -pressed the "Confirm Selection" button.
      async () => {
        // Const var "item" contains the Items object of the selection. Since the item selection was built here and added into the novel object, we can map the-
        // -novel selection number to the itemDBWheel here.
        const item = this.itemDbWheel[this.novel.selection];
        console.log(item)
        this.novel.deployNode(await this.react(item, card), responseIndex, true); // Inject the node that has the reaction in it to the response index. True is for destructive.
        
        if (item != "broke") { // If the item is not "broke" as in nothing is being given.
          // Inventory management.
          this.DBUser.removeFromInventory(item.getId as number, 1);
          this.DBUser.addToTomoInventory(card.ch as number, item.getId as number, 1); // Add to chInUser inventory.

          //TODO: Tomo managements?? Or just leave it to the react function.
          
          // Updates.
          await this.DBUser.updateInventory()
          await this.DBUser.updateTomo()
        }
      },
      this.novel // Novel parameter for function.
    );
    
  }

  async interact(card: Cards = this.cards[this.index]) {
    // Declare block.
    let story: Story;

    story = await this.getStoryJSON(card, "interact");

    // If there is no story, we throw an error.
    if (!story) throw new TomoError("Story not found for interaction. " + `Ch: ${card.ch}, interact.`)

    // Set property to new instance of Novel. getStoryJson would have thrown an error if there was already a Novel already running.
    this.novel = new Novel(story, this.interaction, true);

    this.novel.once("ready", () => {
      this.novel.start() // When ready, start the novel.
    })


    



  }

  async start() {
    await this.buildCharacterCard(this.cards[0])
    this.interaction.editReply({ files: [this.cards[0].built_img], attachments: [], components: await this.action()})
    
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

  /**
   * actionOnNovelIndex
   * Performs an action when a novel hits a certain page.
   * @param index | Index you want the function to perform at.
   * @param action | The action (function) you want to perform.
   * @param novel | the novel that is being used, normally defaults to this.novel;
   */
  async actionOnNovelIndex(
    index: number,
    action: Function,
    novel: Novel = this.novel
  ) {
    novel.on("pageChange", (page: NodeSingle) => {
      if (page.index == index) { // If it matches the index.
        action(page); // Run a predefined function.
      }
    });
  }
}

export = TomoEngine;
