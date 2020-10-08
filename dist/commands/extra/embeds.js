"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
var channel;
var msgId;
var prefix;
var emote;
exports.default = {
    role: new discord_js_1.MessageEmbed({
        "title": "What role would you like to use",
        "description": "This will be the role given to a user when they react \n e.g. @update-pings",
        "color": 65420,
        "footer": {
            "text": "Step 1 - 5"
        }
    }),
    channel: new discord_js_1.MessageEmbed({
        "title": "What channel is the message in",
        "description": "This is the channel that the message is in \n e.g. #roles",
        "color": 65420,
        "footer": {
            "text": "Step 2 - 5"
        }
    }),
    msgId: new discord_js_1.MessageEmbed({
        "title": "What is the id of the message",
        "description": "This is the ID of the message \n [Here is a guide on how to get a message id](https://medium.com/@Seth./how-to-retrieve-message-user-server-and-channel-ids-on-discord-3d83bd0327d4)",
        "color": 65420,
        "footer": {
            "text": "Step 3 - 5"
        }
    }),
    prefix: new discord_js_1.MessageEmbed({
        "title": "What prefix would you like to assign to the user",
        "description": "This is the nickname prefix that will be given to the user \n e.g. [GG] \n [GG] -> [GG] Aso",
        "color": 65420,
        "footer": {
            "text": "Step 5 - 5"
        }
    }),
    emote: new discord_js_1.MessageEmbed({
        "title": "What emote would you like to use",
        "description": "This is the emote the user must react with to get the role \n e.g. 💌",
        "color": 65420,
        "footer": {
            "text": "Step 4 - 5"
        }
    })
};
