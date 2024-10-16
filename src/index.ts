import { Client, StageChannel } from "discord.js-selfbot-v13";
import { streamLivestreamVideo, MediaUdp, getInputMetadata, inputHasAudio, Streamer, Utils } from "@dank074/discord-video-stream";
import config from "./config.json" with {type: "json"};
import PCancelable from "p-cancelable";

const streamer = new Streamer(new Client());
let command: PCancelable<string>;

// ready event
streamer.client.on("ready", () => {
    console.log(`--- ${streamer.client.user.tag} is ready ---`);
});

// message event
streamer.client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;
    if (!config.acceptedAuthors.includes(msg.author.id)) return;
    if (!msg.content) return;

    if (msg.content.startsWith(`!play`)) {
        const args = parseArgs(msg.content)
        if (!args) return;

        const channel = msg.author.voice.channel;

        if(!channel) return;

        console.log(`Betrete Voicechannel ${msg.guildId}/${channel.id}`);
        await streamer.joinVoice(msg.guildId, channel.id);

        if(channel instanceof StageChannel)
            await streamer.client.user.voice.setSuppressed(false);

        const streamUdpConn = await streamer.createStream({
            width: config.streamOpts.width,
            height: config.streamOpts.height,
            fps: config.streamOpts.fps,
            bitrateKbps: config.streamOpts.bitrateKbps,
            maxBitrateKbps: config.streamOpts.maxBitrateKbps,
            hardwareAcceleratedDecoding: config.streamOpts.hardware_acceleration,
            videoCodec: Utils.normalizeVideoCodec(config.streamOpts.videoCodec)
        });

        await playVideo(args.url, streamUdpConn);
        streamer.stopStream();
        return;
    } else if (msg.content.startsWith("!disconnect")) {
        command?.cancel()
        streamer.leaveVoice();
    } else if(msg.content.startsWith("!stop")) {
        command?.cancel()
        const stream = streamer.voiceConnection?.streamConnection;
        if(!stream) return;
        streamer.stopStream();
    }
});

// login
streamer.client.login(config.token);

async function playVideo(video: string, udpConn: MediaUdp) {
    let includeAudio = true;

    try {
        const metadata = await getInputMetadata(video);
        const fps = parseInt(videoStream.avg_frame_rate.split('/')[0])/parseInt(videoStream.avg_frame_rate.split('/')[1])
        const width = videoStream.width
        const height = videoStream.height
        console.log({fps, width, height, "profile": videoStream.profile})
        udpConn.mediaConnection.streamOptions = { fps, width, height }
        includeAudio = inputHasAudio(metadata);
    } catch(e) {
        console.log(e);
        return;
    }

    console.log("Video wird abgespielt");

    udpConn.mediaConnection.setSpeaking(true);
    udpConn.mediaConnection.setVideoStatus(true);
    try {
        command = streamLivestreamVideo(video, udpConn, includeAudio);

        const res = await command;
        console.log("Wiedergabe beendet " + res);
    } catch (e) {
        if (command.isCanceled) {
            console.log('Aktion abgebrochen');
        } else {
            console.log(e);
        }
    } finally {
        udpConn.mediaConnection.setSpeaking(false);
        udpConn.mediaConnection.setVideoStatus(false);
    }
}

function parseArgs(message: string): Args | undefined {
    const url = message.split(/\s(.+)/)[1];
    return { url }
}

type Args = {
    url: string;
}
 