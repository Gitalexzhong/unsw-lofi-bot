// import { randomUUID } from "crypto";
import { Channel, Client, Guild, Message, TextChannel, User } from "discord.js";
// import { sendVerificationEmail } from "./send-mail";
import { config } from "../config";
// import { logVerificationErrorMessage } from "./admin-logger";

// /**
//  * Sends user dm and verification email, and verifies user if user sent code
//  * matches with mail sent code.
//  * @param email as String
//  * @param name as String
//  * @param user as Discord User Object
//  * @param client as Discord Client Object
//  */
// export const verifyUser = async (
//     email: string,
//     name: string,
//     user: User,
//     client: Client,
//     guild: Guild
// ) => {
//     const code: string = randomUUID().toString();
//     user.createDM()
//         .then((dm) => {
//             // if user allows dms send them message in dms
//             dm.send(
//                 `Hi ${user.username}, Please send the **verification code** I sent to your email here for access to the UNSW Rhythm Game Society discord server! Please send it within 5 minutes.`
//             )
//                 .then(() => {
//                     sendVerificationEmail(email, name, code);
//                     // for more info on collectors see https://discordjs.guide/popular-topics/collectors.html#message-collectors
//                     const collectorFilter = (m: Message) =>
//                         m.author.id !== config.BOT_ID;
//                     // keep listening to messages from the user for 5 minutes
//                     const collector = dm.createMessageCollector({
//                         filter: collectorFilter,
//                         time: 300000,
//                     });
//                     console.log(`start of ${user.username} verification`);
//                     collector.on("collect", async (m) => {
//                         if (m.content !== code) {
//                             dm.send(
//                                 "You entered the wrong verification code, please try again! also don't forget to check spam"
//                             );
//                             return;
//                         } else {
//                             m.reply(
//                                 "Verification successful, Welcome to UNSW Rhythm Game Society!"
//                             );
//                             // Gives user the verified role
//                             try {
//                                 const member = guild.members.cache.get(user.id);
//                                 if (!member) throw new Error("invalid member");
//                                 const role = guild.roles.cache.get(
//                                     config.VERIFIED_ROLE_ID
//                                 );
//                                 if (!role) throw new Error("invalid role ID");
//                                 await member.roles.add(role);
//                             } catch (e) {
//                                 dm.send(
//                                     "experienced error while verifying you, please ask an admin to manually verify you"
//                                 );
//                                 logVerificationErrorMessage(
//                                     user.username,
//                                     client
//                                 );
//                                 collector.stop();
//                             }
//                             collector.stop();
//                         }
//                     });
//                     collector.on("end", () =>
//                         console.log(`end of ${user.username} verification`)
//                     );
//                 })
//                 .catch(() => {
//                     // if user has dms blocked send them message in #unverified-chat
//                     // find verification channel
//                     const channel: Channel | undefined =
//                         client.channels.cache.get(config.LOGGING_CHANNEL_ID);
//                     if (!channel) return;
//                     (channel as TextChannel).send(
//                         `Hi <@${user.id}>, since you have dms disabled, Please send the **verification code** I sent to your email here for access to the rest of the server! Please send it within 5 minutes.`
//                     );
//                     sendVerificationEmail(email, name, code);
//                     // for more info on collectors see https://discordjs.guide/popular-topics/collectors.html#message-collectors
//                     const collectorFilter = (m: Message) =>
//                         m.author.id !== config.BOT_ID &&
//                         m.author.id === user.id;
//                     // keep listening to messages from the user for 5 minutes
//                     const collector = (
//                         channel as TextChannel
//                     ).createMessageCollector({
//                         filter: collectorFilter,
//                         time: 300000,
//                     });
//                     console.log(`start of ${user.username} verification`);
//                     collector.on("collect", async (m) => {
//                         if (m.content !== code) {
//                             (channel as TextChannel).send(
//                                 "You entered the wrong verification code, please try again! also don't forget to check spam"
//                             );
//                             return;
//                         } else {
//                             m.reply(
//                                 "Verification successful, Welcome to UNSW Rhythm Game Society!"
//                             );
//                             // Gives user the verified role
//                             try {
//                                 const member = guild.members.cache.get(user.id);
//                                 if (!member) throw new Error("invalid member");
//                                 const role = guild.roles.cache.get(
//                                     config.VERIFIED_ROLE_ID
//                                 );
//                                 if (!role) throw new Error("invalid role ID");
//                                 await member.roles.add(role);
//                             } catch (e) {
//                                 (channel as TextChannel).send(
//                                     "experienced error while verifying you, please ask an admin to manually verify you"
//                                 );
//                                 logVerificationErrorMessage(
//                                     user.username,
//                                     client
//                                 );
//                                 collector.stop();
//                                 return;
//                             }
//                             collector.stop();
//                         }
//                     });
//                     collector.on("end", () =>
//                         console.log(`end of ${user.username} verification`)
//                     );
//                     return;
//                 });
//         })
//         .catch((err) => {
//             console.error(err);
//         });
// };

const lookupTable: { [id: string]: string } = {};

export const tagUser = async (code: string, data: string, message: Message) => {
    lookupTable[code] = data + "," + (Date.now() + 3600).toString();
    message.react("✅");
};

export const verifyUser = async (client: Client, message: Message) => {
    const code = message.content.replace("!verify ", "").slice(0, 6);
    if (lookupTable[code]) {
        const data = lookupTable[code].split(",");
        if (data[7] <= Date.now().toString()) {
            const member = message.guild?.members.cache.get(message.author.id);
            if (!member) throw new Error("invalid member");
            const role = message.guild?.roles.cache.find(
                (role) => role.id === config.VERIFIED_ROLE_ID
            );
            if (!role) throw new Error("invalid role ID");
            await member.roles.add(role);

            if (!config.LOGGING_CHANNEL_ID) return;

            const channel: Channel | undefined = client.channels.cache.get(
                config.LOGGING_CHANNEL_ID
            );
            if (!channel) return;
            (channel as TextChannel).send(
                "verified --> <@" +
                    message.author.id +
                    "> ==> info = {" +
                    data.join(", ").toString() +
                    " }"
            );

            message.react("✅");
            delete lookupTable[code];
        } else {
            delete lookupTable[code];
            message.react("❌");
            message.reply(
                "Code has expired, please redo the verification form or contact an admin"
            );
            return;
        }
    } else {
        message.react("❌");
    }
};
