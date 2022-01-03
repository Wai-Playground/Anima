/**
 * @author Jupiternerd
 */

import { User } from "discord.js";
import engineBase from "./base";
import { AmadeusInteraction } from "./statics/types";
import Character from "./tomoClasses/characters";
import LunchBox from "./tomoClasses/lunchBox";
import universeBase from "./tomoClasses/universeBase";
import DBUsers from "./tomoClasses/users";

export default class Lunch extends engineBase {
    box: LunchBox
    constructor(user: User, interaction: AmadeusInteraction, box: LunchBox) {
        super(user, interaction)
        this.interaction = interaction;
        this.box = box;

    }

    async rollBox(): Promise<universeBase> {
        const pity = this.interaction.DBUser.checkIfUserHasPity(this.box);
        if (pity) {
            this.interaction.DBUser.resetPity(this.box.getId as number);
            return await this.box.roll(pity);
        } else return await this.box.roll();
        

    }


    async mockRoll(roll: Array<universeBase>) {
        const mock = ["uwu pwese spend moure monnies =w=", "i prey iz guditem", "sike fuck u its a grade D item"].reverse()
        let z: number = roll.length, ret: string = "", amount: Map<number, number> = new Map();
        
        async function callBack(randIntFromZero: Function, mock: string[], interaction: AmadeusInteraction) {

            if (z <= 0) {
                for (const item of roll) 
                    if (amount.has(item.getId as number)) amount.set(item.getId as number, amount.get(item.getId as number) + 1);
                    else (amount.set(item.getId as number, 1));

                for (const key of amount.keys()) {
                    let item = roll.find(items => items._id == key) 
                    ret += `${item.markUpFormattedNamewEmoji} x**${amount.get(key)}**\n`;
                }
                
                z--;
                interaction.editReply(ret);
                return clearInterval(intervalID)
                
                
            }

            const str = `Rolling \`\`x${z--}\`\` •` + " " + mock[randIntFromZero(mock.length - 1)]
            if (interaction.replied) await interaction.editReply(str); else await interaction.reply(str);

        }
        
        let intervalID = setInterval(async () => {await callBack(this.randIntFromZero, mock, this.interaction)}, 1200)
        
        
    }

    async storeRoll(rolls: Array<universeBase>) {
        for (const roll of rolls) {
            if (roll.getType == "items") this.interaction.DBUser.addToInventory(roll.getId as number, 1);
            if (roll.getType == "characters") 
                if (this.interaction.DBUser.getTomoFromDachis(roll.getId as number) == null) this.interaction.DBUser.addTomoToUserInventory(roll as Character);
                else {
                    this.interaction.DBUser.addToUserTickets(10)
                }
            
            
            
    
            this.interaction.DBUser.update()
        }
        
    }

    

    async start(amount: number = 1) {
        let rolls = [];
        for (let i = 1; i <= amount; i++) {
            this.interaction.DBUser.addToRoll(this.box.getId as number);
            rolls.push(await this.rollBox());
        }

        this.storeRoll(rolls)
        this.mockRoll(rolls)
    }





    



    

    
}