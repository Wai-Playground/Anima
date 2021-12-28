import { Being, CharacterInUser, Char_Archetype_Strings, Char_Flags, Ship_Tree, User_Flags } from "./types";
export class Equations {
    static calculate_ch_xp(ch_lvl: number) {
        return ((7 * (Math.pow(ch_lvl, 2))) + (70 * ch_lvl));
    }

    static calculate_ch_xp_until(ch_xp: number, ch_lvl: number) {
        return (Equations.calculate_ch_xp(ch_lvl) - ch_xp)
        
    }
    static calculate_user_xp(user_lvl: number) {
        return ((5 * (Math.pow(user_lvl, 2))) + (50 * user_lvl));
    }

    static calculate_user_xp_until(user_xp: number, user_lvl: number) {
        return (Equations.calculate_user_xp(user_lvl) - user_xp)
    }

}

export default class Tomo_Dictionaries {

    static default_BeingInUser(): Being {
        return {
            health: [100, 100],
            mana: [100, 100],
            hunger: 100,
            stability: 100,
            available: true,
            level: 1,
            xp: 0
        }
    }

    static default_CharInUser(): CharacterInUser {
        const today = new Date()
        const default_CharInUser: CharacterInUser = {
            originalID: 0,
            bg: 0,
            _flags: ["gift", "interact"] as Array<Char_Flags>,
            moods: {
                pictureToUse: "normal",
                overall: 30,
                current: 0,
            },
            being: Tomo_Dictionaries.default_BeingInUser(),
            _last_interaction: {
                interaction: null,
                interaction_date: today
            },
            _last_tick: {
                hunger_date: today,
                mood_date: today
            },
            inventory: []
    
        }
        return default_CharInUser;
        

    }

    static char_timings(i: Char_Archetype_Strings) {
        switch (i) {
            case "kuu": 
                break;
            case "dan":
                break;
            case "dere":
                break;
            case "tsun":
                break;

        }
    }

    static char_tree(i: Char_Archetype_Strings): Ship_Tree {
        const dict = {
            "dere": {
                Ship_Tree: {
                    "detest": {
                        level: 0,
                        delFlag: ["interact"] as Array<Char_Flags>
                        
            
                    },
                    "hate": {
                        level: 10,
                        delFlag: ["gift"] as Array<Char_Flags>
            
                    }, 
                    "annoyed": {
                        level: 20,
                        setVariant: "annoyed" 
            
                    },
                    "main": {
                        level: 30,
                        setVariant: "main"
            
                    },
                    "friendly": {
                        level: 40,
                        setFlag: ["memento"] as Array<User_Flags>
            
                        
                    },
                    "passionate": {
                        level: 50,
                        setFlag: ["nick_name_self"] as Array<User_Flags>
                        
                    },
                    "close": {
                        level: 60,
                        setFlag: ["hug"] 
                        
                    },
                    "flustered": {
                        level: 70,
                        setFlag: ["nick_name_char", "kiss"] as Array<User_Flags>,
                        setVariant: "flustered"
                        
                    },
                    "love": {
                        level: 90,
                        setFlag: ["ring"] 
                        
                    },
                    "goal": {
                        level: 100
                    }
            
                } 

            },
            "dan": {
                Ship_Tree: {
                    "detest": {
                        level: 0,
                        delFlag: ["interact"] as Array<Char_Flags>
                        
            
                    },
                    "hate": {
                        level: 10,
                        delFlag: ["gift"] as Array<Char_Flags>
            
                    }, 
                    "annoyed": {
                        level: 20,
                        setVariant: "annoyed" 
            
                    },
                    "main": {
                        level: 30,
                        setVariant: "main"
            
                    },
                    "friendly": {
                        level: 40,
                        setFlag: ["memento"] as Array<User_Flags>
            
                        
                    },
                    "passionate": {
                        level: 50,
                        setFlag: ["nick_name_self"] as Array<User_Flags>
                        
                    },
                    "close": {
                        level: 60,
                        setFlag: ["hug"] 
                        
                    },
                    "flustered": {
                        level: 70,
                        setFlag: ["nick_name_char", "kiss"] as Array<User_Flags>,
                        setVariant: "flustered"
                        
                    },
                    "love": {
                        level: 90,
                        setFlag: ["ring"]
                        
                    },
                    "goal": {
                        level: 100
                    }
            
                } 

            },
            "kuu": {
                Ship_Tree: {
                    "detest": {
                        level: 0,
                        delFlag: ["interact"] as Array<Char_Flags>
                        
            
                    },
                    "hate": {
                        level: 10,
                        delFlag: ["gift"] as Array<Char_Flags>
            
                    }, 
                    "annoyed": {
                        level: 20,
                        setVariant: "annoyed" 
            
                    },
                    "main": {
                        level: 30,
                        setVariant: "main"
            
                    },
                    "friendly": {
                        level: 40,
                        setFlag: ["memento"] as Array<User_Flags>
            
                        
                    },
                    "passionate": {
                        level: 50,
                        setFlag: ["nick_name_self"] as Array<User_Flags>
                        
                    },
                    "close": {
                        level: 60,
                        setFlag: ["hug"] 
                        
                    },
                    "flustered": {
                        level: 70,
                        setFlag: ["nick_name_char", "kiss"] as Array<User_Flags>,
                        setVariant: "flustered"
                        
                    },
                    "love": {
                        level: 90,
                        setFlag: ["ring"] 
                        
                    },
                    "goal": {
                        level: 100
                    }
            
                } 

            },
            "tsun": {
                Ship_Tree: {
                    "detest": {
                        level: 0,
                        delFlag: ["interact"] as Array<Char_Flags>
                        
            
                    },
                    "hate": {
                        level: 10,
                        delFlag: ["gift"] as Array<Char_Flags>
            
                    }, 
                    "annoyed": {
                        level: 20,
                        setVariant: "annoyed" 
            
                    },
                    "main": {
                        level: 30,
                        setVariant: "main"
            
                    },
                    "friendly": {
                        level: 40,
                        setFlag: ["memento"] as Array<User_Flags>
            
                        
                    },
                    "passionate": {
                        level: 50,
                        setFlag: ["nick_name_self"] as Array<User_Flags>
                        
                    },
                    "close": {
                        level: 60,
                        setFlag: ["hug"] 
                        
                    },
                    "flustered": {
                        level: 70,
                        setFlag: ["nick_name_char", "kiss"] as Array<User_Flags>,
                        setVariant: "flustered"
                        
                    },
                    "love": {
                        level: 90,
                        setFlag: ["ring"] 
                        
                    },
                    "goal": {
                        level: 100
                    }
            
                } 

            }
        }
        return dict[i].Ship_Tree as Ship_Tree;
    }

    


   
    

    
  }