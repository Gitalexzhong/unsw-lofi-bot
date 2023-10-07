import { Channel, Client, Guild, Message, TextChannel, User } from "discord.js";
import { config } from "../config";
import { log } from "console";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export const bongo = async (client: Client, message: Message) => {
    const command = message.content.toLowerCase().replace("b.", "").trim();
    
    if (command.startsWith("sr")) {
        message.reply(
            "https://cdn.discordapp.com/attachments/1160136173725941791/1160138082029404180/4340-furina-heh.png?ex=653391c9&is=65211cc9&hm=21898cced260a995fd9441efd8b04392c387a338cce02d72cd7ee469264efe14&"
        );
    } else if (command.startsWith("cd")) {
        message.reply(
            `✅ daily\n✅ daily claim\n✅ claim\n**${getRandomInt(100).toString()}** rolls\n**${getRandomInt(100).toString()}** super rolls\n**${getRandomInt(100).toString()}** bank roll resets\n✅ loot\n**${getRandomInt(1000000).toString()}** points\n**${getRandomInt(100).toString()}** daily streak | **${getRandomInt(100).toString()}** vote streak`
        );
    } else if (command.startsWith("w") || command.startsWith("c")) {
        message.reply(
            "https://cdn.discordapp.com/attachments/1160136173725941791/1160138720930967572/lofi-frankie.png?ex=65339261&is=65211d61&hm=5455e7132c9a30821d0b0dcafca425d2c91ac0f3a89b625c5e5c1431afe3357a&"
        );
    } else if (command.startsWith("l")) {
        const num = getRandomInt(100000000).toString();
        message.reply(
            `${message.author}, you looted ${num} points`
        );
    } else if (command.startsWith("daily")) {
        message.reply(
            `Daily (Streak ${getRandomInt(30).toString()}/30)`
        );
    } else {
        message.reply(
            "SHONKIE COMMAND"
        );
    }
};

