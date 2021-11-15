/**
 * @author Wai 
 * I am going to actively try to comment
 */

import engineBase from "./base";
import { single } from "./statics/types";
import Background from "./tomoClasses/backgrounds";

class NodeSingle {
    characterId: number;
    backgroundId: number;
    displayText: string;

    constructor(single: single, index: number= null) {


    }

}

export default class Novel extends engineBase {
    json: any;
    backgrounds: Array<any> 
    characters: Array<any> 
    multiples: Array<single>
    /**
     * Constructor for Novel.
     * @param json | JSON file to parse.
     * @param interaction | Interaction class to get information about user, channel, etc. 
     */

    constructor(json: Object, interaction) {
        super(interaction.user, interaction)
        // Declaring Variables

        this.backgrounds = []; 
        this.characters = [];
        this.json = json;
        this.multiples = (this.json.hasOwnProperty("multiples") ? this.json.multiples : null) as Array<single>;

        
        this.interaction = interaction;

        

        /**
         * Load background and store it in the array. 
         */
        
        

        process.nextTick(() => { // On next cycle we emit Ready since the listener activates later than the emitter.
            this.emitReady();
          });


        

    }
    /**
     * Name | start();
     * Purpose | Starts the engine.
     * Description | Gets called first when the Emitter from @see constructor .
     */

    async start() {
        const bg1: Background = await this.getBackground(2) 
        console.log(bg1.name)
        
    
        
        this.interaction.editReply("ok!")

    }



    
}