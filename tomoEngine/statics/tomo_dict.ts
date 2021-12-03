import { CharacterInUser, Char_Archetype, Ship_Tree } from "./types";


export default class Tomo_Dictionaries {

    static default_CharInUser(): CharacterInUser {
        const default_CharInUser: CharacterInUser = {
            originalID: 0,
            _flags: [],
            bg: 0,
            moods: {
                pictureToUse: "main",
                overall: 40,
                current: 2,
            },
            gift_received: []
    
        }
        return default_CharInUser;
        

    }

    static char_tree(i: Char_Archetype): Ship_Tree {
        const dict = {
            0: {
                Ship_Tree: {
                    "detest": {
                        level: 10,
                        setFlag: ["block_all"]
                        
            
                    },
                    "hate": {
                        level: 20,
                        setFlag: ["block_gift"]
            
                    }, 
                    "annoyed": {
                        level: 30,
                        setVariant: "annoyed" 
            
                    },
                    "main": {
                        level: 40,
                        setVariant: "main"
            
                    },
                    "friendly": {
                        level: 50,
                        setFlag: ["memento"],
            
                        
                    },
                    "happy": {
                        level: 60,
                        setFlag: ["nick_name_char"],
                        setVariant: "happy"
                        
                    },
                    "passionate": {
                        level: 70,
                        setFlag: ["nick_name_self"]
                        
                    },
                    "close": {
                        level: 80,
                        setFlag: ["hug"]
                        
                    },
                    "flustered": {
                        level: 90,
                        setFlag: ["nick_name_char", "kiss"],
                        setVariant: "flustered"
                        
                    },
                    "love": {
                        level: 100,
                        setFlag: ["ring"]
                        
                    }
            
                }

            },
            1: {
                Ship_Tree: {
                    "detest": {
                        level: 10,
                        setFlag: ["block_all"]
                        
            
                    },
                    "hate": {
                        level: 20,
                        setFlag: ["block_gift"]
            
                    }, 
                    "annoyed": {
                        level: 30,
                        setVariant: "annoyed" 
            
                    },
                    "main": {
                        level: 40,
                        setVariant: "main"
            
                    },
                    "friendly": {
                        level: 50,
                        setFlag: ["memento"],
            
                        
                    },
                    "happy": {
                        level: 60,
                        setFlag: ["nick_name_char"],
                        setVariant: "happy"
                        
                    },
                    "passionate": {
                        level: 70,
                        setFlag: ["nick_name_self"]
                        
                    },
                    "close": {
                        level: 80,
                        setFlag: ["hug"]
                        
                    },
                    "flustered": {
                        level: 90,
                        setFlag: ["nick_name_char", "kiss"],
                        setVariant: "flustered"
                        
                    },
                    "love": {
                        level: 100,
                        setFlag: ["ring"]
                        
                    }
            
                }

            },
            2: {
                Ship_Tree: {
                    "detest": {
                        level: 10,
                        setFlag: ["block_all"]
                        
            
                    },
                    "hate": {
                        level: 20,
                        setFlag: ["block_gift"]
            
                    }, 
                    "annoyed": {
                        level: 30,
                        setVariant: "annoyed" 
            
                    },
                    "main": {
                        level: 40,
                        setVariant: "main"
            
                    },
                    "friendly": {
                        level: 50,
                        setFlag: ["memento"],
            
                        
                    },
                    "happy": {
                        level: 60,
                        setFlag: ["nick_name_char"],
                        setVariant: "happy"
                        
                    },
                    "passionate": {
                        level: 70,
                        setFlag: ["nick_name_self"]
                        
                    },
                    "close": {
                        level: 80,
                        setFlag: ["hug"]
                        
                    },
                    "flustered": {
                        level: 90,
                        setFlag: ["nick_name_char", "kiss"],
                        setVariant: "flustered"
                        
                    },
                    "love": {
                        level: 100,
                        setFlag: ["ring"]
                        
                    }
            
                }

            },
            3: {
                Ship_Tree: {
                    "detest": {
                        level: 10,
                        setFlag: ["block_all"]
                        
            
                    },
                    "hate": {
                        level: 20,
                        setFlag: ["block_gift"]
            
                    }, 
                    "annoyed": {
                        level: 30,
                        setVariant: "annoyed" 
            
                    },
                    "main": {
                        level: 40,
                        setVariant: "main"
            
                    },
                    "friendly": {
                        level: 50,
                        setFlag: ["memento"],
            
                        
                    },
                    "happy": {
                        level: 60,
                        setFlag: ["nick_name_char"],
                        setVariant: "happy"
                        
                    },
                    "passionate": {
                        level: 70,
                        setFlag: ["nick_name_self"]
                        
                    },
                    "close": {
                        level: 80,
                        setFlag: ["hug"]
                        
                    },
                    "flustered": {
                        level: 90,
                        setFlag: ["nick_name_char", "kiss"],
                        setVariant: "flustered"
                        
                    },
                    "love": {
                        level: 100,
                        setFlag: ["ring"]
                        
                    }
            
                }

            }
        }
        return dict[i].Ship_Tree as Ship_Tree;
    }

    


   
    

    
  }