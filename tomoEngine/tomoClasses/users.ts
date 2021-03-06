/**
 * @author Shokkunn
 */

import Queries from "../queries";
import Tomo_Dictionaries from "../statics/tomo_dict";
import { Banner_Payload, CharacterInUser, ItemInUser, pities, Tomo_Action, UserUniversePayload } from "../statics/types";
import Character from "./characters";
import Items from "./items";
import universeBase from "./universeBase";
 
export default class DBUsers extends universeBase {
    _tomodachis: Array<CharacterInUser>
    _reservedTomo: Array<CharacterInUser>
    _inventory: Array<ItemInUser>
    _level: number;
    _xp: number;
    _cur: number;
    _tik: number;
    _pities: Array<pities>
    username: string;
    constructor(_id: number | string, payload: UserUniversePayload) {
        super(_id, 'users', payload.discord_username, "🧍");
        this.username = payload.discord_username;
        this._tomodachis = payload.characters;
        this._reservedTomo = payload.reserved;
        this._inventory = payload.inventory;
        this._xp = payload.xp;
        this._pities = payload.pities;
        this._level = payload.level;
        this._cur = payload.money;
        this._tik = payload.tickets;
         
 
    }

    get level() {
      return this._level;
    }

    get xp() {
      return this._xp;
    }

    get pities() {
      return this._pities;
    }

    get inventory() {
      return this._inventory;
      
    }

    get tomodachis() {
      return this._tomodachis;
    }

    get currency() {
      return this._cur
    }

    get tickets() {
      return this._tik
    }

    async getUserInventoryButWithDBItems() {
      let inventory: Array<
      {
        amount: number,
        item: Items
      }>
      for (const items of this.inventory) {
        if (items.amount <= 0) return;
        inventory.push({
          amount: items.amount,
          item: new Items(items.itemID, await Queries.item(items.itemID))
        })
      }

      return inventory;
    }

    getMainTomoDachi() {
      return this.tomodachis[0]

    }
    getTomoFromDachis(originalID: number) {
      let find = this.tomodachis.find(tomo => tomo.originalID == originalID) || null;
      return find;
    }
    /**
     * Don't forget to update()
     * @param tomoState 
     * @returns 
     */
    updateTomoState(tomoState: CharacterInUser) {
      /**@TODO THERE IS A WAY BETTER WAY TO DO THIS I SWEAR */
      let find = this.getTomoFromDachis(tomoState.originalID), index: number;
      if (find == null) return;
      index = this.tomodachis.indexOf(find);
      this._tomodachis[index] == tomoState;
    }

    tomoInvGetItem(tomoID: number, itemID: number) {
      let tomo = this.getTomoFromDachis(tomoID);
      if (!tomo) return;
      return tomo.inventory.find(item => item.itemID == itemID);
      
    }
    static calculate_ch_xp(ch_lvl: number) {
      return ((7 * (Math.pow(ch_lvl, 2))) + (70 * ch_lvl));
    }

    static calculate_ch_xp_until(ch_xp: number, ch_lvl: number) {
      return (this.calculate_ch_xp(ch_lvl) - ch_xp)
      
    }
    /**
     * @see REMEMBER TO TOMOUPDATE
     * @param tomoID 
     * @returns 
     */
    tomoToLevelUp(tomo: number | CharacterInUser) {
      /**@TODO Better way to do this. Like actually. */
      let xp_needed: number//, xp_before: number

      if (typeof tomo == "number") tomo = this.getTomoFromDachis(tomo)
      
      xp_needed = DBUsers.calculate_ch_xp(tomo.being.level + 1)
      
      if (xp_needed <= tomo.being.xp) {
        tomo.being.level += 1;
        this.clearTomoXP(tomo)
      }
      //if ((xp_needed - tomo.being.xp) < 0) this.tomoToLevelUp(tomo);
    }
    
    addToXP(amount: number) {
      this._xp += amount;
      console.log("USR IS GETTING XP: " + this._xp);
      this.userToLevelUp();
    }

    clearTomoXP(tomo: number | CharacterInUser) {
      if (typeof tomo == "number") tomo = this.getTomoFromDachis(tomo)
      tomo.being.xp = 0;
    }

    clearUserXP() {
      this._xp = 0;
    }

    addToUserTickets(amount: number) {
      this._tik += amount;
      console.log(amount + "_AMOUNT_ADDED")
    }
    removeFromUserTickets(amount: number) {
      let ret = this.tickets - amount;
      this._tik = (ret < 0) ? 0 : ret;
    }
    addToUserCurrency(amount: number) {
      this._cur += amount;
    }
    removeFromUserCurrency(amount: number) {
      let ret = this.currency - amount;
      this._cur = (ret < 0) ? 0 : ret;
    }

    addToTomoXP(tomoID: number, amount: number) {
      let tomo = this.getTomoFromDachis(tomoID)
      if (!tomo) return;
      console.log("TOMO IS GETTING XP: " + amount)

      tomo.being.xp += amount;
      this.tomoToLevelUp(tomo);
    }

    addToTomoLP(tomoID: number, amount: number) {
      let tomo = this.getTomoFromDachis(tomoID), ret: number;
      if (!tomo) return;
      ret = tomo.moods.overall += amount;
      // if the final mood is less than 0, set it to 0. If not then set the mood as the final mood.
      tomo.moods.overall = (ret <= 0) ?  0 : ret;

    }

    setUserLastInteraction(tomoID: number, action: Tomo_Action) {
      let tomo = this.getTomoFromDachis(tomoID)
      tomo._last_interaction.interaction = action;
      tomo._last_interaction.interaction_date = new Date()
      
    }

    addToTomoInventory(tomoOrigID: number, itemID: number, amount: number) {
      let tomo = this.getTomoFromDachis(tomoOrigID), itemInInv: ItemInUser, index: number;
      itemInInv = this.tomoInvGetItem(tomoOrigID, itemID);
      if (!itemInInv) {
        tomo.inventory.push({
          itemID: itemID,
          amount: amount,
          date: new Date()
        })
        //console.log(tomo.inventory + " TOMOINV")
        return tomo.inventory;
      }
      index = tomo.inventory.indexOf(itemInInv);
      tomo.inventory[index].amount += amount;
      //console.log(tomo.inventory + " TOMOINV")
      return tomo.inventory; 
      
    }

    static calculate_user_xp(user_lvl: number) {
      return ((5 * (Math.pow(user_lvl, 2))) + (50 * user_lvl));
    }

    static calculate_user_xp_until(user_xp: number, user_lvl: number) {
      return (this.calculate_user_xp(user_lvl) - user_xp)
    }

    removeFromTomoInventory(tomoOrigID: number, itemID: number, amount: number) {
      let find = this.tomoInvGetItem(tomoOrigID, itemID), tomo = this.getTomoFromDachis(tomoOrigID), index: number, res: number;
      if (find == null || amount > 100000000) return;

      index = tomo.inventory.indexOf(find as ItemInUser);
      res = tomo.inventory[index].amount - amount;
      if (res <= 0) {
        tomo.inventory.splice(index)
        return tomo.inventory;
      }
      
      
      tomo.inventory[index].amount = res;
      return tomo.inventory;
    }

    userToLevelUp() {
      /**@TODO Better way to do this. Like actually. */
      let xp_needed = DBUsers.calculate_user_xp(this.level + 1)//, go_into = (xp_needed / tomo.being.xp);
      if (xp_needed <= this.xp) {
        this._level += 1;
        this.clearUserXP()
      }

      //if ((xp_needed - this.xp) < 0) this.userToLevelUp();
      console.log("USR IS LEVELING UP: " + this._level);

      
    }


    /**
     * @returns the item index. null if not in index, and the whole thing if it is.
     */
    getItemFromInv(itemID: number) {
      let find = this.inventory.find(item => item.itemID == itemID) || null;
      return find;
    }

    /**
     * Remember to call update!
     * @param itemID 
     * @param amount 
     * @returns 
     */
    addToInventory(itemID: number, amount: number) {
      let find = this.getItemFromInv(itemID), index: number;
      if (find == null) {
        this._inventory.push(
          {
            itemID: itemID,
            amount: amount,
            date: new Date()
          }
        )
        return this._inventory;
      };

      index = this._inventory.indexOf(find as ItemInUser);
      this._inventory[index].amount += amount;

      return this._inventory;

    }

    async addTomoToUserInventory(tomo: Character) {
      const payload: CharacterInUser = Tomo_Dictionaries.default_CharInUser(tomo.getId as number, 0);
      if (this.tomodachis.length >= 5) {
        if (this._reservedTomo.findIndex(index => index.originalID == tomo.getId) != -1) return;
        return this._reservedTomo.push(payload)
      }
      if (this._tomodachis.findIndex(index => index.originalID == tomo.getId) != -1) return;
      
      
      this._tomodachis.push(payload)


    }




    /**
     * Remember to call update!
     * @param itemID 
     * @param amount 
     * @returns 
     */
    removeFromInventory(itemID: number, amount: number) {

      let find = this.getItemFromInv(itemID), index: number, res: number;
      if (find == null || amount > 100000000) return;

      index = this._inventory.indexOf(find as ItemInUser);
      res = this._inventory[index].amount - amount;
      if (res <= 0) {
        this._inventory.splice(index)
        return this._inventory;
      }
      
      
      this._inventory[index].amount = res;
      return this._inventory;

    }
    async updateTomo() {
      await Queries.updateUserTomo(this._id, this.tomodachis)
    }
    async updateInventory() {
      await Queries.updateUserInventory(this._id, this.inventory)
    }

    async validateTomoInventory() {
     /**TODO */
    }
    async update() {
      /**TODO: Theres a more elegant solution to this. */
      await Queries.updateUserUniverse(this._id, {
        _id: this._id,
        level: this._level,
        xp: this._xp,
        tickets: this._tik,
        money: this._cur,
        pities: this._pities,
        discord_username: this.username,
        characters: this._tomodachis,
        reserved: this._reservedTomo,
        inventory: this._inventory
      })
    }



    set inventory(arr: Array<ItemInUser>) {
      this._inventory = arr;

    }


    

    
    
 

 
 }