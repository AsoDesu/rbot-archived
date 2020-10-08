"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const firebase_1 = __importDefault(require("firebase"));
var database = firebase_1.default.firestore();
var auth = firebase_1.default.auth();
auth.signInWithEmailAndPassword('susBot@gmail.com', process.env.FIREPASS);
async function command(msg, args) {
    if (!msg.member.hasPermission('MANAGE_ROLES')) {
        msg.channel.send('You don\'t have permssion to do that');
        return;
    }
    if (!args[0]) {
        msg.channel.send('Correct usage `!removerr {message id}`');
    }
    database.collection(msg.guild.id).where('msgId', '==', args[0]).get().then(docs => {
        if (docs.size == 0) {
            msg.reply('That reaction role does not exist');
            return;
        }
        docs.forEach(async (doc) => {
            var message = await msg.channel.send('Deleting reaction role');
            database.collection(msg.guild.id).doc(doc.id).delete();
            await message.edit('Deleted');
        });
    });
}
exports.default = command;
