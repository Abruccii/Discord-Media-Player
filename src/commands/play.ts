import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { streamLivestreamVideo, MediaUdp, getInputMetadata, inputHasAudio, Streamer, Utils } from "@dank074/discord-video-stream";
import { StageChannel } from "discord.js-selfbot-v13";
import { StreamType, createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, DiscordGatewayAdapterCreator } from '@discordjs/voice';
import { got } from 'got';
import { Readable } from 'stream';

import ytdl from '@distube/ytdl-core';
import config from "../config.json" with {type: "json"};

export const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Spielt Video und Musik ab')
    .addStringOption(option => 
        option.setName('filename')
            .setDescription('Der Name der Datei, die abgespielt werden soll')
            .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction, streamer: Streamer) {
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

    console.log(`Guild Member ID: ${interaction.member.id}`);
    console.log(`Guild ID: ${interaction.guildId}`);

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

    if (filename.endsWith('.mp3') || filename.startsWith('https://youtu.be/') || filename.startsWith('https://www.youtube.com/')  || filename.startsWith('https://www.youtu.be/') || filename.startsWith('https://www.youtube.com/')) {
        await playAudio(filename, interaction);
    } else {
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
    }

    streamer.stopStream();
    await interaction.editReply(`Wiedergabe von ${filename} beendet.`);
}

async function playVideo(video: string, udpConn: MediaUdp) {
    let includeAudio = true;
    let command: ReturnType<typeof streamLivestreamVideo>;


    try {
        const metadata = await getInputMetadata(video);
        includeAudio = inputHasAudio(metadata);
    } catch(e) {
        console.log(e);
        return;
    }

    console.log("Started playing video");

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

async function playAudio(audio: string, interaction: ChatInputCommandInteraction) {
    const voiceChannel = (interaction.member as GuildMember).voice.channel;
    if (!voiceChannel) {
        await interaction.editReply('Du musst in einem Sprachkanal sein, um Musik abzuspielen.');
        return;
    }

    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
    });

    const player = createAudioPlayer();

    try {
        let stream: any;
        if (ytdl.validateURL(audio)) {
            stream = ytdl(audio, { 
                filter: 'audioonly',
                highWaterMark: 1 << 25,
                quality: 'highestaudio'
            });
        } else if (audio.startsWith('http://') || audio.startsWith('https://')) {
            stream = got.stream(audio);
        } else {
            const { createReadStream } = await import('fs');
            stream = createReadStream(audio);
        }

        const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
        player.play(resource);

        connection.subscribe(player);

        player.on(AudioPlayerStatus.Playing, () => {
            console.log('Der AudioPlayer hat mit der Wiedergabe begonnen.');
        });

        player.on(AudioPlayerStatus.Idle, () => {
            console.log('Der AudioPlayer hat die Wiedergabe beendet.');
            connection.destroy();
        });

        player.on('error', error => {
            console.error('Fehler bei der Audiowiedergabe:', error);
            connection.destroy();
        });

        await interaction.editReply('Audiowiedergabe gestartet.');

    } catch (error) {
        console.error('Fehler beim Abspielen des Audios:', error);
        await interaction.editReply('Es gab einen Fehler beim Abspielen des Audios.');
        connection.destroy();
    }
}