import { Canvas, createCanvas, Image, loadImage, NodeCanvasRenderingContext2DSettings } from "canvas";
import { Message, MessageAttachment, User } from "discord.js";
import engineBase from "../base";
import Queries from "../queries";
import { AmadeusInteraction, Banner_Payload, Drops, Economy_Payments_String } from "../statics/types";
import Background from "../tomoClasses/backgrounds";
import Character from "../tomoClasses/characters";

class Strips {
    banner: Banner_Payload
    attachment: MessageAttachment


    constructor(payload: Banner_Payload) {
        this.banner = payload;
    }


}


export default class GachaEngine extends engineBase {
    active_banners: Array<Strips> = []
    width = 720;
    height = 250;
    selection: number;
    canvas = createCanvas(this.width, this.height)
    characters: Map<number|string, Character> = new Map<number|string, Character>()
    backgrounds: Map<number|string, Background> = new Map<number|string, Background>()
    loaded_ch: Map<number|string, Image> = new Map();
    loaded_bg: Map<number|string, Image> = new Map();
    banner_messages: Array<Message<boolean>> = []
    //interaction: AmadeusInteraction;
    constructor(user: User, interaction: AmadeusInteraction) {
        super(user, interaction)
        this.interaction = interaction
        this.prepareAssets();
      }
    
    async start(strips: Array<Strips> = this.active_banners) {
        
        for (const banners of strips) {
            this.banner_messages.push(await this.interaction.channel.send(
                {
                    content: banners.banner.body,
                    files: [banners.attachment]
                }))

        }

        
    }

    async build(index: number = 0) {
        let ret = MessageAttachment;
        const ctx = this.canvas.getContext("2d"), strips = this.active_banners[index]
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.quality = "fast";
        ctx.patternQuality = "fast";
        let bg: Image, ch: Image;

        const customID: string = `Strip_userID_${this.interaction.user.id}_node_${strips.banner._id}_.jpeg`,
        content = strips.banner.headers.content,
        ch_id = strips.banner.headers.ch, bg_id = strips.banner.headers.bg;

        if (this.loaded_bg.has(bg_id)) {
            bg = this.loaded_bg.get(bg_id)
      
          } else {
              bg = await loadImage('./assets/backgrounds/' + this.backgrounds.get(bg_id).link)
              this.loaded_bg.set(bg_id, bg)
          }
      
        if (this.loaded_ch.has(ch_id)) {
            ch = this.loaded_ch.get(ch_id);
            
          } else {
            ch = await loadImage('./assets/characters/' + this.characters.get(ch_id).link)
            this.loaded_ch.set(ch_id, ch)
        }

        ctx.drawImage(bg,0, 0, this.width, this.height)
        ctx.font = "120px sans-serif"
        ctx.fillText(content, this.width / 2, this.height / 2)
        ctx.drawImage(ch, 0, 0)

        this.active_banners[index].attachment = new MessageAttachment(
            this.canvas.toBuffer("image/jpeg", {quality: 0.5}),
            customID
        )
        
        
        
        return ret;
    }

    async prepareAssets() {
        // Definition block
        const payload = await Queries.getBanners();
        // Curate the banners so that only the active ones are pushed.
        for (const banner of payload) 
            banner.active ? this.active_banners.push(new Strips(banner)) : null;
        
        let i = 0;
        for (const strips of this.active_banners) {
            if (!this.characters.has(strips.banner.headers.ch)) 
                this.characters.set(strips.banner.headers.ch, await this.getCharacter(strips.banner.headers.ch))
                
            if (!this.backgrounds.has(strips.banner.headers.ch)) 
                this.backgrounds.set(strips.banner.headers.ch, await this.getBackground(strips.banner.headers.ch))
            
            this.build(i)
            i++;
        }

        process.nextTick(() => {
            this.emitReady()
        })






        
    }

    




}