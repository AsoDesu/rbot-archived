"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
client.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (!msg.content.startsWith(process.env.PREFIX) || msg.author.bot)
        return;
    const args = msg.content.slice(process.env.PREFIX.length).split(/ +/);
    const command = args.shift().toLowerCase();
    switch (command) {
        case 'rr':
            try {
                createRR_1.default(msg, args);
            }
            catch (_a) { }
            break;
        case 'removerr':
            try {
                removeRR_1.default(msg, args);
            }
            catch (_b) { }
            break;
        case 'test':
            break;
    }
}));
client.on('raw', ({ t, d }) => {
    switch (t) {
        case 'MESSAGE_REACTION_ADD':
            try {
                reactAdd_1.default(d, client);
            }
            catch (_a) { }
            break;
        case 'MESSAGE_REACTION_REMOVE':
            try {
                reactRemove_1.default(d, client);
            }
            catch (_b) { }
            break;
    }
});
client.on('ready', () => {
    console.log('Connected to discord Pog');
    client.user.setActivity({ type: 'PLAYING', name: 'r!' });
});
client.login(process.env.TOKEN);
