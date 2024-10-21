import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, Client, ActivityType } from 'discord.js';
import { streamLivestreamVideo, MediaUdp, getInputMetadata, inputHasAudio, Streamer, Utils } from "@dank074/discord-video-stream";
import { StageChannel } from "discord.js-selfbot-v13";
import config from "../config.json" with {type: "json"};

let currentTrack: {
    title: string;
    duration: number;
    startTime: number;
} | null = null;

let client: Client;

export const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Spielt Video und Musik ab')
    .addStringOption(option => 
        option.setName('filename')
            .setDescription('Der Name der Datei, die abgespielt werden soll')
            .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction, streamer: Streamer, botClient: Client) {
    client = botClient;
    const filename = interaction.options.getString('filename');
    if (!filename) {
        return interaction.reply({
            content: 'Bitte gib einen Dateinamen an.',
            ephemeral: true,
        });
    }

    if (!(interaction.member instanceof GuildMember)) {
        return interaction.reply({
            content: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
            ephemeral: true,
        });
    }

    const guildMember = await interaction.guild?.members.fetch(interaction.member.id);

    if (!guildMember) {
        console.log("Konnte GuildMember nicht abrufen");
        return interaction.reply({
            content: 'Konnte deine Mitgliedsinformationen nicht abrufen.',
            ephemeral: true,
        });
    }

    const voiceChannel = guildMember.voice.channel;

    if (!voiceChannel) {
        console.log("Kein Sprachkanal gefunden");
        return interaction.reply({
            content: 'Du bist in keinem Sprachkanal!',
            ephemeral: true,
        });
    }

    await interaction.deferReply();
    await interaction.editReply(`Spiele ${filename} in ${voiceChannel.name} ab...`);

    await streamer.joinVoice(interaction.guildId!, voiceChannel.id);

    if (voiceChannel instanceof StageChannel) {
        await streamer.client.user.voice.setSuppressed(false);
    }

    const streamUdpConn = await streamer.createStream({
        width: config.streamOpts.width, 
        height: config.streamOpts.height, 
        fps: config.streamOpts.fps, 
        bitrateKbps: config.streamOpts.bitrateKbps,
        maxBitrateKbps: config.streamOpts.maxBitrateKbps, 
        hardwareAcceleratedDecoding: config.streamOpts.hardware_acceleration,
        videoCodec: 'H264'
    });

    await playVideo(filename, streamUdpConn);

    streamer.stopStream();
    await interaction.editReply(`Wiedergabe von ${filename} beendet.`);
}

async function playVideo(video: string, udpConn: MediaUdp) {
    let includeAudio = true;
    let command: ReturnType<typeof streamLivestreamVideo>;
    let stream: any;

    
    try {
        const metadata = await getInputMetadata(video);
        includeAudio = inputHasAudio(metadata);
    } catch(e) {
        console.log(e);
        return;
    }

    udpConn.mediaConnection.setSpeaking(true);
    udpConn.mediaConnection.setVideoStatus(true);
    try {
        command = streamLivestreamVideo(video, udpConn, includeAudio);

        const res = await command;
        console.log("Finished playing video " + res);
    } catch (e) {
        if (command && command.isCanceled) {
            // Handle the cancelation here
            console.log('Operation was canceled');
        } else {
            console.log(e);
        }
    } finally {
        udpConn.mediaConnection.setSpeaking(false);
        udpConn.mediaConnection.setVideoStatus(false);
    }
}