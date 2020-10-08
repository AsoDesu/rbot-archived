"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = __importDefault(require("discord.js"));
const client = new discord_js_1.default.Client();
const reactAdd_1 = __importDefault(require("./reactAdd"));
const reactRemove_1 = __importDefault(require("./reactRemove"));
// Commands
const createRR_1 = __importDefault(require("./commands/createRR"));
const removeRR_1 = __importDefault(require("./commands/removeRR"));
client.on('message', async (msg) => {
    if (!msg.content.startsWith(process.env.PREFIX) || msg.author.bot)
        return;
    const args = msg.content.slice(process.env.PREFIX.length).split(/ +/);
    const command = args.shift().toLowerCase();
    switch (command) {
        case 'rr':
            try {
                createRR_1.default(msg, args);
            }
            catch { }
            break;
        case 'removerr':
            try {
                removeRR_1.default(msg, args);
            }
            catch { }
            break;
        case 'test':
            break;
    }
});
client.on('raw', ({ t, d }) => {
    switch (t) {
        case 'MESSAGE_REACTION_ADD':
            try {
                reactAdd_1.default(d, client);
            }
            catch { }
            break;
        case 'MESSAGE_REACTION_REMOVE':
            try {
                reactRemove_1.default(d, client);
            }
            catch { }
            break;
    }
});
client.on('ready', () => {
    console.log('Connected to discord Pog');
    client.user.setActivity({ type: 'PLAYING', name: 'r!' });
});
client.login(process.env.TOKEN);
const express_1 = __importDefault(require("express"));
const app = express_1.default();
app.get('/ping', (req, res) => {
    res.send('Online');
});
app.listen(process.env.PORT);
