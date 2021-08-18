import { Client } from "discord.js";

import { Commands } from "../client/Amadeus_Commands";
import game_model from "../db_schemas/toe";
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");

class Toe extends Commands {
  constructor() {
    super("toe", {
      description: "helpaa",
      data: new SlashCommandBuilder()
        .addSubcommand((sub) =>
          sub
            .setName("create")
            .setDescription("create tictac tieeeee")
            .addUserOption((option) =>
              option
                .setName("oppo")
                .setDescription("8==D tag me")
                .setRequired(true)
            )
        ),
      dbRequired: false,
      ownerOnly: false,
    });
  }

  async buildboard(gameboard) {
    var id = 0,
      label,
      style;
    const dict = {
      0: {
        label: "❌",
        style: "DANGER",
      },
      1: {
        label: "⭕",
        style: "SUCCESS",
      },
      null: {
        label: " ",
        style: "SECONDARY",
      },
    };

    var board = [];
    for (let column of gameboard) {
      var row = new MessageActionRow();
      for (let board_row of column) {
        console.log("Pair: " + id);
        row.addComponents(
          new MessageButton()
            .setCustomId(`${id}`)
            .setLabel(dict[board_row].label)
            .setStyle(dict[board_row].style)
        );
        id++;
      }

      board.push(row);
    }

    return board;
  }

  async checkDiag(board) {
    var internalY = 0, internalX = 0;
    var win = 0;
    var internal = 0;

    for (let column of board) {
      internalY = 0;
      for (let row of column) {
        if (internalY == internalX) {
          if (row == internal) {
            win++;

          } else {
            win = 0;
            internal = row;

          }

          if (win >= 3) return row;
        }
        internalY++;
        
        
    
      }
      
      internalX++;
    }

    var internalY = 3, internalX = 3;
    var win = 0;
    var internal = 0;

    for (let column of board) {
      internalY = 0;

      for (let row of column) {

        if (internalY == internalX) {
          if (row == internal) {
            win++;

          } else {
            win = 0;
            internal = row;

          }

          if (win >= 3) return row;
        }
        
        internalY--;
        
        
    
      }
      
      internalX--;
    }

  }

  async checkHorizontal(board) {
    var internal = 0, win = 0;
    var internalY= 0 
    for (let column of board) {
      internalY = 0;
      win = 0;
      for (let row of column) {

          if (row == internal) {
            win++;

          } else {
            win = 0;
            internal = row;


          }
          if (win >= 3) return row;

        
        
        
        internalY++;



      }
      
    }

  }
  
  async checkVertical(board) {
    var internal = 0, win = 0;
    var internalY= 0, internalX= 0;
    for (let column of board) {
      internalY = 0;

      for (let row of column) {
        
        if (internalY == internalX) {
          if (row == internal) {
            win++;

          } else {
            win = 0;
            internal = row;


          }
          if (win >= 3) return row;

        }
        
        
        internalY++;



      }
      internalX++;
    }

  }

  async checkIfWin(board){
    await this.checkVertical(board)
    await this.checkHorizontal(board)
    await this.checkDiag(board)
    return false;


  }

  async getId(board, id) {
    var count = 0;
    var internalY= 0, internalX= 0;
    console.log()
    
    for (let column of board) {
      internalY = 0;
      for (let row of column) {

        if (count == id) return [internalX, internalY]
        
        internalY++;
        count++;


      }
      internalX++;
    }

    return null;
  }

  async execute(bot: Client, interaction) {
    var gameboard = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    var game = false;
    const opponent = interaction.options.getUser("oppo");

    const sub = interaction.options.getSubcommand();
    switch (sub) {
      case "create":
        
        if (game) return;
        var turn = 0;


        var xd = await this.buildboard(gameboard);
        console.log(xd);
        await interaction.reply({
          content: "Turn: " + interaction.user.toString(),
          ephemeral: false,
          components: xd,
        });

        const filter = (i) =>
          {
            console.log(i.isButton() + " Is it button")
            console.log(i.user.id)
            console.log(opponent.id)
            console.log([interaction.user.id, opponent.id].includes(i.user.id))
          //console.log(i.customId.startsWith(interaction.user.id) && [interaction.user.id, opponent.id].includes(i.user.id))
          return i.isButton() && [interaction.user.id, opponent.id].includes(i.user.id); }

        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 60000,
        });

        collector.on("collect", async (i) => {

          
          var button_id = await this.getId(gameboard, i.customId)
          console.log(button_id)
          if (gameboard[button_id[0]][button_id[1]] !== null) return;
          


          if (turn == 0) {
            console.log(i.user.id == interaction.user.id)
            if (i.user.id == interaction.user.id) {
              turn = 1;
              console.log("IT WORKS")
              gameboard[button_id[0]][button_id[1]] = 0;

              xd = await this.buildboard(gameboard);
              

              i.update({
                content: "Turn: " + opponent.toString(),
                ephemeral: false,
                components: xd,
              })


              

            }

          } else {
            if (i.user.id == opponent.id) {
              turn = 0;
              gameboard[button_id[0]][button_id[1]] = 1;

              xd = await this.buildboard(gameboard);
              console.log(gameboard)

              
              i.update({
                content: "Turn: " + interaction.user.toString(),
                ephemeral: false,
                components: xd,
              })

            }

          }

          var winQuestion = await this.checkIfWin(gameboard);
          console.log(winQuestion + "AAAAAAAAAAAAAAAAAAAAA")
          if (winQuestion) {
            i.update({
              content: "!!!!!!!!!!!!!!!!!WINNER!!!!!!!!!!!!!!!!!!! ISSSSSSSSSSSSS " + winQuestion
            })
            return collector.stop()
          }
        });

        break;


    }
  }
}

export = Toe;
