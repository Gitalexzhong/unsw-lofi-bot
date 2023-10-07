import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Replies with Info about the Bot's uptime");

const start = Date.now();

export async function execute(interaction: CommandInteraction) {
    const passed = Date.now() - start;
    console.log(passed.toLocaleString());
    const duration = convertToDays(passed);

    return interaction.reply(`Bot has been alive for:\n${duration}`);
}

function convertToDays(milliSeconds: number) {
    const days = Math.floor(milliSeconds / (86400 * 1000));
    milliSeconds -= days * (86400 * 1000);
    const hours = Math.floor(milliSeconds / (60 * 60 * 1000));
    milliSeconds -= hours * (60 * 60 * 1000);
    const minutes = Math.floor(milliSeconds / (60 * 1000));
    milliSeconds -= minutes * (60 * 1000);
    const seconds = Math.floor(milliSeconds / 1000);

    return `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
}
