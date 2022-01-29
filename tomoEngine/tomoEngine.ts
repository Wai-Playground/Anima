import {
  ButtonInteraction,
  MessageAttachment,
  MessageActionRow,
  SelectMenuInteraction,
  MessageButton,
  InteractionCollector,
  MessageSelectMenu,
  MessageSelectOptionData,
  Message,
  MessageEmbed,
  ColorResolvable,
} from "discord.js";
import {
  Canvas,
  createCanvas,
  Image,
  loadImage,
  CanvasRenderingContext2D,
} from "canvas";
import engineBase from "./base";
import Character from "./tomoClasses/characters";
import DBUsers from "./tomoClasses/users";
import {
  CharacterInUser,
  Temp_MoodTypeStrings,
  Ship_Tree,
  Temp_MoodType,
  Tomo_Action,
  Single,
  Argument,
  Char_Archetype_Strings,
  ItemInUser,
  Gift_Responses,
  AmadeusInteraction,
  Rarity_Color,
  Mood_Emojis,
  Rarity_Grade,
  Rarity_Emoji,
  Mood_States,
  Mood_States_Strings,
  Scripts,
} from "./statics/types";
import Tomo_Dictionaries from "./statics/tomo_dict";
import Novel from "./novel";
import { TomoError } from "./statics/errors";
import Story from "./tomoClasses/story";
import { NodeSingle } from "./novel";
import Items from "./tomoClasses/items";
import Background from "./tomoClasses/backgrounds";
import { timingSafeEqual } from "crypto";

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
  item: Items | "broke" = "broke";
  response: keyof Gift_Responses;
  _mood: Temp_MoodTypeStrings;
  width: number = 564;
  height: number = 670;
  cards: Array<Cards>;
  novel: Novel;
  DBUser: DBUsers;
  itemInWheel: Array<ItemInUser>;
  itemDbWheel: Array<Items | "broke">;
  index: number = 0;
  message: any;

  result_multiplier: number = 1;

  filter: Function = async (i: any) => {
    await i.deferUpdate();
    return i.user.id === this.interaction.user.id;
  };
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
    const asset = './assets/'
    console.time("build")
    // Prepare canvas.

    const canvas: Canvas = createCanvas(this.width, this.height); // Create Canvas.
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d"); // Get context.

    let chObj: Character = this.characters.get(card.chInUser.originalID), cur_mood = TomoEngine.convertNumberToTempMoodType(card.chInUser.moods.current);

    if (cur_mood != "normal") chObj = await chObj.getVariant(cur_mood);

    // Prepare the image objects.

    const bg: Image = await loadImage(
      asset + `backgrounds/${this.backgrounds.get(card.bg).link}` // Property "backgrounds" is an internal cache of the Backgrounds objects with their IDs as the key. -
      // card.bg is the ID of the background.
    );

    const ch: Image = await loadImage(
      asset + `characters/${chObj.link}`
    );

    // This block draws the image.

    ctx.drawImage(bg, 0, 0); // Draw the background. (TODO: EDIT AESTHETICS)

    ctx.drawImage(ch, 0, 0, ch.naturalWidth, ch.naturalHeight); // Draw the character (TODO: EDIT AESTHETICS)

    // This block sets the card's "build_img" property with the message attachment of the rendered image.

    card.built_img = new MessageAttachment(
      canvas.toBuffer("image/jpeg"),
      `tomo_userID_${this.DBUser._id}_node_${this.index}_CH${card.ch}_BG${card.bg}.jpg`
    );
    console.timeEnd("build")
    console.log(card.built_img)
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

    this.backgrounds = new Map(); // Internal cache of the backgrounds. (k, v) k = uniBaseID, v = Background object.
    this.characters = new Map(); // Internal cache of the characters. (k, v) k = uniBaseID, v = Character object.
    

    this.DBUser = this.interaction.DBUser; // Shortened version of the DBUser.

    for (const characters of this.DBUser.tomodachis) {
      // Change their mood if it has been an hour or so.
      this.moodChanger9000(characters)

      // For every character in the User's tomodachis, we create a new card and set the bgs and chs to their respective mappings.
      this.cards.push(new Cards(characters));

      // This block adds the characters/backgrounds to the mapping if it's not already mapped.
      if (!this.characters.has(characters.originalID))
        this.characters.set(
          characters.originalID,
          await this.getCharacter(characters.originalID)
        ); // Ch mappings.
      if (!this.backgrounds.has(characters.bg))
        this.backgrounds.set(
          characters.bg,
          await this.getBackground(characters.bg)
        ); // Bg mappings.
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
    console.log(Temp_MoodType[mood] + "MOOD")
    return Temp_MoodType[mood] as Temp_MoodTypeStrings; // Then we use the mood int to convert it into a tempMoodType by subbing it.
  }

  static convertTempMoodTypeToNumber(mood: Temp_MoodTypeStrings) {
    return Temp_MoodType[mood] as number || -1;
  }

  static convertNumberToMainType(points: number) {
    points = Math.floor(points / 10);
    if (points > Object.keys(Mood_States).length / 2) return Mood_States[Object.keys(Mood_States).length - 1] as Mood_States_Strings;
    return Mood_States[points] as Mood_States_Strings;

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
      if (idOfStory == -1)
        throw new TomoError(
          "No story found for this action." +
            `Ch: ${card.ch}, User: ${this.DBUser._id}`
        );
    } catch (e) {
      console.log(e);
    }

    story = await this.getStoryUniverse(idOfStory); // Get the json of the story.
    if (curMood != "normal" && action != "gift") {
      // If the current mood is main and the action is not gift then-
      try {
        story = await story.getVariant(curMood); // Then get the variant of the story if needed.
        
      } catch (e) {
        console.log(e);
      }
    }

    if (curMood == "hungry" && action == "gift") {
      try {
        story = await story.getVariant("hungry");
      } catch(e) {
        console.log(e)
      }
    }
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
    if (dbItem.itemType == "boxes") return false;
    return true;
  }

  /**
   * Name | fillSelectWithInv.
   * Fills the select menu with giftable items.
   * @returns Array of Drop down menu Arguments. @see Argument types.
   */
  async fillSelectWithInv(): Promise<Array<Argument>> {
    // Definition block.
    let dbItem: Items,
      i: number = 1, // Start at "1" because we are pre-defining it in the default return Array<Argument> below.
      ret: Array<Argument> = [
        {
          // This is the very first option that the user will have. Which is to say that they have nothing.
          route: "$next",
          label: "I have nothing...",
          value: i.toString(),
        },
      ];

    this.itemDbWheel.push("broke"); // Push the "broke" item into the itemdbwheel which is a property of this class, to help manipulate it later in the future.

    this.itemInWheel = this.DBUser.inventory.filter(
      (items) => items.amount > 0
    ); // If the items in the inventory are more than "0".

    if (this.itemInWheel.length <= 0) return ret; // If there is no items just return the default Array of Arguments. Which is just the "I am broke" selection.

    // When the user has an inventory.
    for (const items of this.itemInWheel) {
      dbItem = await this.getItemUniverse(items.itemID); // Get dbItem from the db. Since every iteration should be unique (should be), we don't have to check for duplicates.
      if (TomoEngine.checkIfItemIsGiftable(dbItem)) {
        // Currently every item is giftable.
        if (i <= 25) {
          // The limit for a selection menu arguments is 25.
          this.itemDbWheel.push(dbItem); // We push it into our look up table of "itemDBWheel" property.
          ret.push({
            // Push it into the return array.
            route: "$next", // Every single route has to be next because its going straight to the buffer then to the response.*
            label: `(x${items.amount}) ` + dbItem.formattedName,
            emoji: dbItem.emoji, // Emojis :)
            value: i.toString(), // The value of the argument is their index in the itemDBWheel which is going to come handy later when we get a selection.
          });

          i++; // Increment.
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
    let res: keyof Gift_Responses = "none",
      cur_mood = TomoEngine.convertNumberToTempMoodType(card.chInUser.moods.current),
      mood: Temp_MoodTypeStrings = (this.characters.get(card.ch).archetype == "tsun" ? "annoyed" : "sad"),
      variantMood: Character,
      ch = this.characters.get(card.ch),
      response: Single = {
        mood: mood,
        text: this.characters.get(card.ch).getRandomGiftResponse("none"),
        backable: false,
      };

    // If the user is broke we return the default response of broke.
    if (receivedItem == "broke") {
      variantMood = await this.characters.get(card.ch).getVariant(mood); // We get the mood of the character.
      this.novel.deployChar(variantMood); // We inject the character into the this.novel object.
      response.character = variantMood.getId; // The response of character's ID is now the variantMood. Since the mood is
      response.script = res;
      this.response = res; // For when we use it in the calc gift rewards section later.
      this._mood = mood;

      return new NodeSingle(response);
    }
    const itemInChInv = card.chInUser.inventory.find(invItem => invItem.itemID == receivedItem.getId),
    itemGrade: number = receivedItem.gradeInt,// We get the item Grade of the item to compare against the character.
    HOUR = 1000 * 60 * 60, DAY = 1000 * HOUR * 24

    // This block decides what the response will be. Will override the response.
    // Res = are Results, they are defined in the orig ch db and is an arr of text which the ch says after getting a gift.

    if (itemGrade > ch.gradeInt) (mood = "happy"), (res = "above"); // If item grade > character grade. Mood becomes happy, Res becomes above.

    if (itemGrade == ch.gradeInt) (mood = "happy"), (res = "average"); // If item grade == char grade. Mood becomes happy. Res becomes average.

    if (itemGrade < ch.gradeInt) res = "below"; // Mood does not change because default is "sad". Res becomes below.

    if (ch.likes.includes(receivedItem.getId as number)) {
      (mood = "happy"), (res = "likes"); // If the item is included in the character's like sheet.
      this.interaction.DBUser.removeFromTomoInventory(ch.getId as number, receivedItem.getId as number, 1);
    }
    

    if (!itemInChInv == undefined) {
      // Duplicate Interaction.
      if (itemInChInv.date.getTime() <= DAY * 5) (mood = "sad"), (res = "duplicate"); // If it has been 5 days since the date they gave the item, the char will become sad and res will become duplicate.
    
    }
    if (ch.dislikes.includes(receivedItem.getId as number))
      (mood = "annoyed"), (res = "dislikes"); // If the item is in the dislike category.

    // They perform special functions:
    // This block is for when the item is a consumable.
    if (receivedItem.itemType == "consumables") {
    }

    // This block is for when the item is equipable.
    if (receivedItem.itemType == "equipables") {
    }

    // This block is for when the user gives her food.
    if (cur_mood == "hungry") {
      console.log(receivedItem.itemType + "_RECEIVED_ITEM")
      if (receivedItem.itemType == "edibles") {
        (mood = "happy"), (res = "food");
        this.result_multiplier = 2;
      } else {
        (mood = (this.characters.get(card.ch).archetype == "tsun" ? "annoyed" : "sad")), (res = "not_food");
      }
    }

    variantMood = await ch.getVariant(mood); // We get the variant mood again, since there may have been a change in the mood.
    this.novel.deployChar(variantMood); // We inject the Character into the novel.

    response.text = ch.getRandomGiftResponse(res); // Random response.
    response.script = res;
    this.response = res;
    this._mood = mood;
    response.mood = mood; // Mood becomes the moode.
    response.character = variantMood.getId; // The character of the response becomes the mood.
    
    card.chInUser.moods.current = TomoEngine.convertTempMoodTypeToNumber(mood)
    return new NodeSingle(response); // Return a new NodeSingle of response.
  }

  private async disableComponents() {
    if (this.buttonCollector) this.buttonCollector.stop()
    if (this.selectCollector) this.selectCollector.stop()
  }

  private async appendEndScreen(Arr: Array<number>) {
    let embed = new MessageEmbed()
    .addField("Gained XP", Arr[0].toString())
    .addField("Gained LP", Arr[2].toString())
    .addField("Character Gained", Arr[1].toString())
    //Update User
    await this.interaction.editReply({
      embeds: [embed],
      components: [],

    });

    
  }

  /**
   * ":)"
   */
  private async moodChanger9000(chInUser: CharacterInUser) {
    const HOUR = 1000 * 60 * 60, DAY = 1000 * HOUR * 24, TICK_DATE = chInUser._last_tick, NOW = Date.now(), NOW_DATE = new Date(),
    RAND_MIN = Math.floor(this.randIntFromZero(60000)), RAND_MOOD = this.randIntFromZero(Math.floor(Object.keys(Temp_MoodType).length / 2))

    if (!(TICK_DATE.mood_date.getTime() > (NOW - (HOUR + RAND_MIN)))) {
      chInUser.moods.current = RAND_MOOD;
      chInUser._last_tick.mood_date = NOW_DATE;
    }

    if (!(TICK_DATE.mood_date.getTime() > (NOW - (DAY * 10)))) {
      chInUser.moods.overall -= -1;
      chInUser.moods.current = TomoEngine.convertTempMoodTypeToNumber("sad")
    }

    this.DBUser.updateTomoState(chInUser)
    this.DBUser.update()




  }

  async deployEndingOfGift(card: Cards = this.cards[this.index]) {
    console.log(this._mood + "_MOOD")
    const ch = this.characters.get(card.ch), variant_mood = await ch.getVariant(this._mood)
    console.log(variant_mood)
    let response: Single = {
      mood: this._mood,
      text: variant_mood.getRandFarewells(),
      backable: false,
    };

    return new NodeSingle(response)


  }

  /**
   * Name | gift
   * The gift block where the user can gift items to their tomos.
   * @param card | The card we want to draw the ch and bg from (draw as in take not like render card)
   */
  async gift(interaction: AmadeusInteraction = this.interaction, card: Cards = this.cards[this.index]) {
    // Declare variables.
    let story: Story, find: number, responseIndex: number;

    story = await this.getStoryJSON(card, "gift"); // Get the story json of the action "gift".
    find = story.multiples.findIndex(
      (single) => single.args?.toString() == "$gift" // In the story, we find the "$gift" script which indicates a gift node.
    );
    responseIndex = story.multiples.findIndex(
      (single) => single.args?.toString() == "$response" // In the story, we find the "$response" script which indicates the response sacrificial lamb node to be written over.
    );

    if (find > -1)
      // If the find comes out positive (no error, we found "$gift")
      story.multiples[find].args = await this.fillSelectWithInv(); // Then we fill the selection with the user's inventory.

    this.novel = new Novel(story, interaction, true); // Initiate a new Novel (see story variable.).

    this.novel.once("ready", () => {
      this.novel.start(); // Start the novel when ready.
    });

    this.OnNovelEnd("gift")


    // This block is the main part of the gifting sequence, this:
    // 1. Sacrifices a node to become the response.
    // 2. Makes the inventory and tomodachi changes to reflect what was gifted.

    this.actionOnNovelIndex(
      find + 1, // Variable "find" is a number that has the index of "$gift" node. So we want to run the function AFTER an item is selected and the user has-
      // -pressed the "Confirm Selection" button.
      async () => {
        // Const var "item" contains the Items object of the selection. Since the item selection was built here and added into the novel object, we can map the-
        // -novel selection number to the itemDBWheel here.
        this.item = this.itemDbWheel[this.novel.selection];
        this.novel.deployNode(
          await this.react(this.item, card),
          responseIndex,
          true
        ); // Inject the node that has the reaction in it to the response index. True is for destructive.
        this.novel.deployNode(
          await this.deployEndingOfGift(card),
          responseIndex + 1,
          false
        ); // Inject the node that has the ending in it to the response index +1. If the char was happy it will be happy, sad if it is sad. 


        if (this.item != "broke") {
          // If the item is not "broke" as in nothing is being given.
          // Inventory management.
          this.DBUser.removeFromInventory(this.item.getId as number, 1);
          this.DBUser.addToTomoInventory(
            card.ch as number,
            this.item.getId as number,
            1
          ); // Add to chInUser inventory.

          //TODO: Tomo managements?? Or just leave it to the react function.

          // Updates.
          await this.DBUser.updateInventory();
          await this.DBUser.updateTomo();
        }
      },
      this.novel // Novel parameter for function.
    );
  }

  async interact(interaction: AmadeusInteraction = this.interaction, card: Cards = this.cards[this.index]) {
    // Declare block.
    let story: Story;

    story = await this.getStoryJSON(card, "interact");

    // If there is no story, we throw an error.
    if (!story)
      throw new TomoError(
        "Story not found for interaction. " + `Ch: ${card.ch}, interact.`
      );

    // Set property to new instance of Novel. getStoryJson would have thrown an error if there was already a Novel already running.
    this.novel = new Novel(story, interaction, true);

    this.novel.once("ready", () => {
      this.novel.start(); // When ready, start the novel.
    });

    this.OnNovelEnd("interact")
  }

  async start(index: number = 0) {
    await this.setPage(index);
    if (!this.message) this.message = (await this.interaction.fetchReply()) as Message;
    
    if (this.buttonCollector == undefined) this.collectButton(this.filter);
    if (this.selectCollector == undefined) this.collectSelect(this.filter);
  }

  async setPage(index: number = 0) {
    if (index < 0 || index > this.cards.length - 1) return;
    if (!this.cards[index].built_img) await this.buildCharacterCard(this.cards[index]);
    const payload = {
      files: [this.cards[index].built_img],
      attachments: [],
      components: await this.action(),
    }
    this.index = index;
    await this.interaction.editReply(payload);
    
  }

  static async rarityColor(grade: number) {
    if (grade > 8) throw new TomoError("Rarity color grade bigger than total rarity level (8).");
    console.log(grade)
    return Rarity_Color[grade];
  }

  static async convertIntMoodToEmj(mood: number) {
    return Mood_Emojis[mood];
  }

  static async convertIntGradeToEmj(rarity: Rarity_Grade) {
    return Rarity_Emoji[rarity]
  }

  static async converIntHealthToEmj(healthArr: Array<number> = [0, 100]) {
    const converted_health_ratio = (healthArr[0] / healthArr[1]) * 100;

    if (converted_health_ratio > 50) return "🟢"
    else if (converted_health_ratio < 30) return "🔴"
    else if (converted_health_ratio <= 50) return "🟡"
  }

  // Interaction Block.
  async stats(interaction: AmadeusInteraction = this.interaction, card: Cards = this.cards[this.index]) {
    const characterObject: Character = this.characters.get(card.ch), content: string = `${characterObject.emoji} ${this.interaction.user.username}\'s Character •`, 
    user_hearts = Math.floor(card.chInUser.moods.overall / 10),
    ch_xp_needed = DBUsers.calculate_ch_xp(card.chInUser.being.level + 1),
    ch_xp_needed_until = (ch_xp_needed - card.chInUser.being.xp)
    console.log(card.chInUser.being.level + "CH_LVL")
  
    // create a rich embed with the character's stats.
    const embed = new MessageEmbed()
      .setTitle(characterObject.formattedName)
      .setDescription(`${await TomoEngine.convertIntGradeToEmj(characterObject.gradeInt)} **${characterObject.title}** • ${this.periodTheString(characterObject.description)}\n` +
      `\n📚 **Subject Specialty** •` + "「" + this.capitalizeFirstLetter(characterObject.class) + "」\nㅤ")// invis char at last string
      .addField("Relationship", 
      `💕 「**${this.capitalizeFirstLetter(TomoEngine.convertNumberToMainType(card.chInUser.moods.overall))}**」 • \n` + await TomoEngine.levelGUI(user_hearts, 10) + `「**${Math.floor(card.chInUser.moods.overall / 10)}** ♡」\n`,
      true)
      //.addField("Combat Stats", 
      //`${await TomoEngine.converIntHealthToEmj(card.chInUser.being.health)} **HP** • ` + await TomoEngine.levelGUI((Math.floor(card.chInUser.being.health[0] / card.chInUser.being.health[1]) * 100), 10) +`\n[**${card.chInUser.being.health[0]}**/**${card.chInUser.being.health[1]}** hp]`,
      //true)
      .addField("Advancements", 
      `🆙 **XP** •「${card.chInUser.being.xp}」\n` + await TomoEngine.levelGUI(Math.floor((card.chInUser.being.xp <= 0 ? 0 : (card.chInUser.being.xp / ch_xp_needed)* 10)), 10) + `\n**${ch_xp_needed_until}** XP needed to level up.\n「Current Level • **__${card.chInUser.being.level}__**」`,
      true)
      .addField("Mood", 
      `${await TomoEngine.convertIntMoodToEmj(card.chInUser.moods.current)} **Current Mood** •「${this.capitalizeFirstLetter(TomoEngine.convertNumberToTempMoodType(card.chInUser.moods.current))}」\n`
      )
      .setColor(await TomoEngine.rarityColor(characterObject.gradeInt) as ColorResolvable)
      .setThumbnail("attachment://" + characterObject.link)
      .setTimestamp()
      .setFooter({text: `${this.interaction.user.username}\'s ${characterObject.formattedName}`, iconURL: this.interaction.user.avatarURL()})

    return interaction.editReply({
      content: content,
      files: [{attachment: `assets/characters/` + characterObject.link}],
      attachments: [],
      embeds: [embed],
      components: []
    })
  }

  private async collectButton(filter: Function) {
    this.buttonCollector = this.message.createMessageComponentCollector({
      filter,
      componentType: "BUTTON",
      time: 60000,
      max: 1,
    });
    this.buttonCollector.on("collect", async (interaction: ButtonInteraction) => {
      const button = parseInt(interaction.customId.match(/(\d{1,1})/g)[0]);
      console.log(button)
      await this.disableComponents();

      switch (button) {
        case 0:
          this.stats()
          break;

        case 1:
          this.interact()
          break;

        case 2:
          this.gift()
          break;
      }

    });

    this.buttonCollector.on("end", () => {
      this.emit("end");
    });
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
        let value = parseInt(interaction.values[0]); // value[1] = selection
        if (value == this.index) return;

        //this.selection = parseInt(value);

        this.emit("selectCollected", value);
        this.setPage(value)
      }
    );
  }



  public async end(reason: string = "timed_out") {
    this.emit("end", reason);
    if (/*!this.selectCollector.ended ||*/ !this.buttonCollector.ended) {
      /*(await this.selectCollector.stop()*/
      this.buttonCollector.stop();
    } 
  }

  async fillSelectWithUserTomos() {
    let choices: Array<MessageSelectOptionData> = [], i: number = 0;

    for (const card of this.cards) {
      choices.push({
        label: this.characters.get(card.chInUser.originalID).getName,
        emoji: this.characters.get(card.chInUser.originalID).emoji,
        value: i.toString()
      });
      i++;
    }

    return choices;
  }

  async action() {
    let ret: Array<MessageActionRow> = [],
      buttonRow = new MessageActionRow(),
      i = 0;

    const buttons = [
      {
        disabled: false,
        label: "Info",
        emj: "📚",
        style: 3,
      },
      {
        disabled: false,
        label: "Talk",
        emj: "💬",
        style: 1,
      },
      {
        disabled: false,
        label: "Gift",
        emj: "🎁",
        style: 1,
      },
    ];

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
    ret.push(buttonRow);

    // Select Menu block.

    // Define variables.
    const selectRow = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(
          "TOMO.select_" +
            this.index.toString() +
            "_user_" +
            this.interaction.user.id
        )
        .setPlaceholder(
          "SELECT YO B"
        )
        .addOptions(await this.fillSelectWithUserTomos())
        
    );

    ret.push(selectRow);

    return ret;
  }

  async calculateRewards(action: Tomo_Action, card: Cards = this.cards[this.index]) {
    /**@TODO Finish this. USE THIS IN CONJECTURE WITH THE TOMO TYPE (TSUN ETC..)*/
    let user_reward_xp: number = 20, ch_reward_xp: number = 0, ch_reward_lp: number = 0//, characterObj = this.characters.get(card.chInUser.originalID);

    async function gift_rewards(item: Items | "broke", response: keyof Gift_Responses) {
      if (response == "none") return;
      switch(response) {
        case "likes":
          ch_reward_lp = 3;
          ch_reward_xp = 400;
          user_reward_xp = 500;
          break;
        case "above":
          ch_reward_lp = 1;
          ch_reward_xp = 200;
          user_reward_xp = 300;
          break;
        case "average":
          ch_reward_xp = 100;
          user_reward_xp = 200;
          
          break;
        case "below": 
          ch_reward_lp = -1;
          ch_reward_xp = 50;
          user_reward_xp = 50;
          break;
        case "dislikes":
          ch_reward_lp = -5;
          ch_reward_xp = 15;
          user_reward_xp = 2;
          break;
        case "food":
          ch_reward_lp = 10;
          ch_reward_xp = 200;
          user_reward_xp = 200;
          
      }
    }

    async function interact_rewards(end_type: Scripts) {
      console.log(end_type + " END TYPE")
      if (end_type == "$flag_b") {
        user_reward_xp = 20;
        ch_reward_lp = -1;

      }
      else if (end_type == "$flag_g") {
        ch_reward_lp = 0.5;
        user_reward_xp = 100;
      }

    }


    switch(action) {
      case "gift":
        if (this.item == undefined) throw new TomoError("Even though we are in $gift section of calculateRewards, we cannot access this.item property.");
        if (this.response == undefined) throw new TomoError("Even though we are in $gift section of calculateRewards, we cannot access this.response property.");
        await gift_rewards(this.item, this.response);

        break;

      case "interact":

        await interact_rewards(this.novel.nodes[this.novel.index].script);
        break;
    }
    if (user_reward_xp > 0) this.DBUser.addToXP(user_reward_xp * this.result_multiplier) // User's XP
    if (ch_reward_lp != 0) this.DBUser.addToTomoLP(card.chInUser.originalID, ch_reward_lp); // Tomodachi's LP
    if (ch_reward_xp > 0) this.DBUser.addToTomoXP(card.chInUser.originalID, ch_reward_xp * this.result_multiplier); // Tomodachi's XP

    this.DBUser.update()
    this.DBUser.updateTomo()    

    return [user_reward_xp, ch_reward_xp, ch_reward_lp]
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
      if (page.index == index) {
        // If it matches the index.
        action(page); // Run a predefined function.
      }
    });
  }

  async OnNovelEnd(action: Tomo_Action, novel: Novel = this.novel, card: Cards = this.cards[this.index]) {
    novel.once("end", async (reason) => {
      if (reason == "timed_out") return;
      this.DBUser.setUserLastInteraction(card.chInUser.originalID, action)
      let rewards: Array<number> = await this.calculateRewards(action)
      this.appendEndScreen(rewards);
    })

  }

}

export = TomoEngine;
