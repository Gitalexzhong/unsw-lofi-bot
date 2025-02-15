import { Client, GatewayIntentBits, Guild } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands/command-list";
import { config } from "./config";
import { tagUser, verifyUser } from "./functions/verify-user";
import { bongo } from "./functions/bongo-clone";
// import { verifyUser } from "./functions/verify-user";
// import { logVerificationErrorMessage } from "./functions/admin-logger";

/**
 * Create a new Discord Client and set its intents to determine which events
 * the bot will receive information about.
 */
export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
    ],
});

client.once("ready", () => {
    console.log("Discord bot is ready! 🤖");
    deployCommands({ guildId: config.GUILD_ID });
});

/**
 * Watches for messages from webhook channel
 */
client.on("messageCreate", async (message) => {
    // ignores messages that aren't of format (don't include delimiters)
    if (
        message.channelId === config.WEBHOOK_CHANNEL &&
        message.author.id === config.WEBHOOK_SENDER_ID
    ) {
        const data: string[] = message.content.split(",");

        // // updated for new username strings
        // if (!userTag.includes("#")) userTag = userTag.toLowerCase() + "#0";

        // // find the guild the user is in
        // const guild: Guild | undefined = client.guilds.cache.get(
        //     config.GUILD_ID
        // );
        // if (!guild) throw new Error("invalid guild");

        // // get list of all members of guild
        // const memberList = await guild.members.fetch({});
        // const userInGuild = memberList.find((u) => {
        //     console.log(u.user.username + "#" + u.user.discriminator);
        //     return u.user.username + "#" + u.user.discriminator === userTag;
        // });

        // // choose automatic or manual verification if user is in guild cache
        // userInGuild
        //     ? verifyUser(email, name, userInGuild.user, client, guild)
        //     : logVerificationErrorMessage(userTag, client);

        // Send a verification email with verification code
        // verifyUser(email, name, userTag);

        tagUser(data[4], message.content, message);
    } else if (
        message.content.startsWith("!verify ") &&
        message.channelId === config.VERIFY_CHANNEL
        //&& message.author.id === config.WEBHOOK_SENDER_ID
    ) {
        verifyUser(client, message);
    } else if (
        message.content.toLowerCase().startsWith("b.")
    ) {
        bongo(client, message);
    }
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
