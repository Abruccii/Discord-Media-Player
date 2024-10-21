import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, Client, ActivityType } from 'discord.js';
import { streamLivestreamVideo, MediaUdp, getInputMetadata, inputHasAudio, Streamer } from "@dank074/discord-video-stream";
import { StageChannel } from "discord.js-selfbot-v13";
import { StreamType, createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, DiscordGatewayAdapterCreator } from '@discordjs/voice';
import ytdl from '@distube/ytdl-core';
import prism from 'prism-media';

import config from "../config.json" with {type: "json"};

let currentTrack: {
    title: string;
    duration: number;
    startTime: number;
} | null = null;

let client: Client;

export const data = new SlashCommandBuilder()
    .setName('playyt')
    .setDescription('Spielt Video und Musik ab')
    .addStringOption(option => 
        option.setName('av')
            .setDescription('Wähle ob Ton oder Video abgespielt werden soll')
            .addChoices(
				{ name: 'Audio', value: 'audio' },
				{ name: 'Video', value: 'video' }
			)
            .setRequired(true)
    )
    .addStringOption(option => 
        option.setName('url')
            .setDescription('Die Link zum Youtube Video')
            .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction, streamer: Streamer, botClient: Client) {
    client = botClient;
    const av = interaction.options.getString('av');
    const url = interaction.options.getString('url');

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
    await interaction.editReply(`Spiele ${url} in ${voiceChannel.name} ab...`);

    if(!ytdl.validateURL(url)){
        await interaction.editReply(`${url} wurde nicht als gültiger YouTube Link erkannt.`);
        return;
    }

    if (av === 'audio')
        playAudio(url, interaction);
    else {
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
    
        await playVideo(url, streamUdpConn);
        streamer.stopStream();
    }

    await interaction.editReply(`Wiedergabe von ${url} beendet.`);
}

async function playVideo(video: string, udpConn: MediaUdp) {
    let includeAudio = true;
    let command: ReturnType<typeof streamLivestreamVideo>;
    let stream: any;

    if (ytdl.validateURL(video)) {
        const info = await ytdl.getInfo(video);
        udpConn.mediaConnection.setSpeaking(true);
        udpConn.mediaConnection.setVideoStatus(true);
        try {
            stream = ytdl(video, { 
                highWaterMark: 1 << 25,
                quality: 'highestaudio'
            });    

            command = streamLivestreamVideo(stream, udpConn, includeAudio);

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
    } else {
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
        const info = await ytdl.getInfo(audio);
        const trackInfo = {
            title: info.videoDetails.title,
            duration: parseInt(info.videoDetails.lengthSeconds)
        };

        const stream = ytdl(audio, { 
            filter: 'audioonly',
            highWaterMark: 1 << 26, // Erhöhter Wert für besseres Buffering
            quality: 'highestaudio'
        });

        // Verwenden Sie prism-media für eine effizientere Audio-Verarbeitung
        const transcoder = new prism.FFmpeg({
            args: [
                '-analyzeduration', '0',
                '-loglevel', '0',
                '-f', 's16le',
                '-ar', '48000',
                '-ac', '2',
            ],
        });

        const resource = createAudioResource(stream.pipe(transcoder), { 
            inputType: StreamType.Raw,
            inlineVolume: true
        });

        // Implementieren Sie ein Buffering-System
        await interaction.editReply("Audiospur wird 5 Sekunden gebuffert um Laggs vorzubeugen.");
        console.log('Buffering audio...');
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 Sekunden Buffering

        player.play(resource);
        connection.subscribe(player);

        if (trackInfo) {
            currentTrack = {
                ...trackInfo,
                startTime: Date.now()
            };
            updateBotStatus();
        }

        player.on(AudioPlayerStatus.Playing, () => {
            console.log('Der AudioPlayer hat mit der Wiedergabe begonnen.');
            updateBotStatus();
        });

        player.on(AudioPlayerStatus.Idle, () => {
            console.log('Der AudioPlayer hat die Wiedergabe beendet.');
            currentTrack = null;
            updateBotStatus();
            connection.destroy();
        });

        player.on('error', error => {
            console.error('Fehler bei der Audiowiedergabe:', error);
            connection.destroy();
        });

        await interaction.editReply('Audiowiedergabe von *' + info.videoDetails.title + '* gestartet.');

    } catch (error) {
        console.error('Fehler beim Abspielen des Audios:', error);
        await interaction.editReply('Es gab einen Fehler beim Abspielen des Audios.');
        connection.destroy();
    }
}

function updateBotStatus() {
    if (!client) return;

    if (currentTrack) {
        const elapsedTime = Math.floor((Date.now() - currentTrack.startTime) / 1000);
        const remainingTime = Math.max(0, currentTrack.duration - elapsedTime);
        const status = `${currentTrack.title} | ${formatTime(elapsedTime)}/${formatTime(currentTrack.duration)}`;
        client.user?.setActivity(status, { type: ActivityType.Playing });
    } else {
        client.user?.setActivity();
    }
}

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

setInterval(updateBotStatus, 10000);