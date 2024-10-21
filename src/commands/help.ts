import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Streamer } from "@dank074/discord-video-stream";

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Zeigt eine Übersicht über alle verfügbaren Befehle');

export async function execute(interaction: ChatInputCommandInteraction, streamer: Streamer) {
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Verfügbare Befehle')
        .setDescription('Hier ist eine Liste aller verfügbaren Befehle:')
        .addFields(
            { name: '/play', value: 'Spielt ein Video ab' },
            { name: '/help', value: 'Zeigt diese Hilfeübersicht' }
            // Fügen Sie hier weitere Befehle hinzu, wenn Sie sie implementieren
        )
        .setTimestamp()
        .setFooter({ text: 'Discord Movie Player Bot' });

    await interaction.reply({ embeds: [embed], ephemeral: true });
}