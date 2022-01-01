/**
 * @author Jupiternerd
 */

import { time } from "console";
import { User } from "discord.js";
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


    async mockRoll(roll: universeBase) {
        const mock = ["Sike bitch its a dog shit item", "Maybe A book?", "A new Ch?", "Hope it's something good..."]
        let i = mock.length - 1;
        
        async function callBack(mock: string[], interaction: AmadeusInteraction) {

            if (i < 0) {
                await interaction.editReply("You got • " + roll.markUpFormattedNamewEmoji)
                return clearInterval(intervalID)
            }

            const str = "Rolling... •" + " " + mock[i]
            if (interaction.replied) await interaction.editReply(str); else await interaction.reply(str);
            i--;

        }
        
        let intervalID = setInterval(async () => {await callBack(mock, this.interaction)}, 1700)
        
        
    }

    async storeRoll(roll: universeBase) {
        if (roll.getType == "items") this.interaction.DBUser.addToInventory(roll.getId as number, 1);
        if (roll.getType == "characters") 
            if (this.interaction.DBUser.getTomoFromDachis(roll.getId as number) == null) this.interaction.DBUser.addTomoToUserInventory(roll as Character)
            else return this.interaction.DBUser.addToUserTickets(1)
        

        this.interaction.DBUser.update()
    }

    

    async start() {
        const roll = await this.rollBox()
        console.log(roll)
        this.storeRoll(roll)
        this.mockRoll(roll)
    }




    



    

    
}