import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { client } from "..";
import { differenceInMilliseconds } from "date-fns/fp";

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("returns status of bot's functioning!");

export async function execute(interaction: CommandInteraction) {
    const startTime = Date.now();
    const sent = await interaction.reply({
        content: "Pinging...",
        fetchReply: true,
    });
    const endTime = Date.now();
    const roundtripLatency = differenceInMilliseconds(startTime, endTime);

    return interaction.editReply(
        `Pong!\n${roundtripLatency}ms`
    );
}
