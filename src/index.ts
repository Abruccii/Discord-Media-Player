import { GatewayIntentBits, REST, Routes, Collection, Client } from 'discord.js';
import { Streamer } from "@dank074/discord-video-stream";
import { Client as Selfbot } from "discord.js-selfbot-v13";
import config from "./config.json" with {type: "json"};
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CustomClient, Command } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Bots
const streamer = new Streamer(new Selfbot());
const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as CustomClient;


client.commands = new Collection<string, Command>();
const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Slash Commands registrieren
const rest = new REST({ version: '10' }).setToken(config.botToken);

(async () => {
    try {
        console.log('Registriere Slash Commands...');

        await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands },
        );

        console.log('Slash Commands erfolgreich registriert');
    } catch (error) {
        console.error(error);
    }
})();

// Slash Command Interaktionen verarbeiten
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = (client as CustomClient).commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction, streamer);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// ready event
streamer.client.on("ready", () => {
    console.log(`--- ${streamer.client.user.tag} is ready ---`);
});

client.on("ready", () => {
    console.log(`--- ${client.user.tag} is ready ---`);
});

// login
streamer.client.login(config.token);
client.login(config.botToken);