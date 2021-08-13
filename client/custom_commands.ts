const { SlashCommandBuilder } = require("@discordjs/builders");

export class Commands {
    name: string = null;
    data: typeof SlashCommandBuilder;

    constructor(name: string, settings: { data: typeof SlashCommandBuilder }) {
        this.name = name;
        this.data = settings.data;



    }

}