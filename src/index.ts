import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config } from "./config";

/**
 * Create a new Discord Client and set its intents to determine which events
 * the bot will receive information about.
 */
const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", () => {
  console.log("Discord bot is ready! 🤖");
});

/**
 * Deploy commands when new guild has been created
 */
client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

/**
 * Run corresponding commands when new user interaction has been created
 */
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

/**
 * Login the client using the bot token
 */
client.login(config.DISCORD_TOKEN);
