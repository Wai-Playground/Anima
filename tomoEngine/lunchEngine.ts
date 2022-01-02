/**
 * @author Jupiternerd
 */

import { time } from "console";
import { User } from "discord.js";
import { runInThisContext } from "vm";
import engineBase from "./base";
import { AmadeusInteraction } from "./statics/types";
import Character from "./tomoClasses/characters";
import LunchBox from "./tomoClasses/lunchBox";
import universeBase from "./tomoClasses/universeBase";

export default class Lunch extends engineBase {
    box: LunchBox
    constructor(user: User, interaction: AmadeusInteraction, box: LunchBox) {
        super(user, interaction)
        this.interaction = interaction;
        this.box = box;

    }

    async rollBox(): Promise<universeBase> {
        const rolled = await this.box.roll()
        console.log(rolled.type)
        let ret: universeBase;
        switch (rolled.type) {
            case "items":
                ret = await this.getItemUniverse(rolled._id)
                break;
            case "characters":
                ret = await this.getCharacter(rolled._id)
                break;
            case "backgrounds":
                break;
            case "stories":
                break;
        }

        return ret;

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
                    ret += `${item.markUpFormattedNamewEmoji} x${amount.get(key)}\n`;
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
            
            
    
            await this.interaction.DBUser.update()
        }
        
    }

    

    async start(amount: number = 1) {
        let rolls = [];
        for (let i = 1; i <= amount; i++) rolls.push(await this.rollBox())

        this.storeRoll(rolls)
        this.mockRoll(rolls)
    }





    



    

    
}