"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("firebase"));
var database = firebase_1.default.firestore();
function removeReaction(d, client) {
    if (d.user_id == client.user.id)
        return;
    var guild = client.guilds.cache.get(d.guild_id);
    var user = guild.members.cache.get(d.user_id);
    var emote;
    if (d.emoji.id) {
        emote = `<:${d.emoji.name}:${d.emoji.id}>`;
    }
    else {
        emote = d.emoji.name;
    }
    database.collection(d.guild_id).where('emote', '==', emote).get().then(docs => {
        docs.forEach(doc => {
            var data = doc.data();
            if (!data.msgId == d.message_id)
                return;
            var role = data.role;
            if (!user.roles.cache.has(role))
                return;
            user.roles.remove(guild.roles.cache.get(role));
            user.setNickname(user.user.username);
        });
    });
}
exports.default = removeReaction;
