import { Collection, Client } from 'discord.js';

export interface Command {
    data: any;
    execute: (...args: any[]) => Promise<void>;
}

export interface CustomClient extends Client {
    commands: Collection<string, Command>;
}
