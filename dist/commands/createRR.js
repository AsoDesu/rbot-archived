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
const discord_js_1 = __importDefault(require("discord.js"));
require("dotenv/config");
const firebase_1 = __importDefault(require("firebase"));
const embeds_1 = __importDefault(require("./extra/embeds"));
var database = firebase_1.default.firestore();
var auth = firebase_1.default.auth();
auth.signInWithEmailAndPassword('susBot@gmail.com', process.env.FIREPASS);
function command(msg, args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!msg.member.hasPermission('MANAGE_ROLES')) {
            msg.channel.send('You don\'t have permssion to do that');
            return;
        }
        const filter = (m) => msg.author.id === m.author.id;
        const reactionFilter = (reaction, user) => {
            return user.id === msg.author.id;
        };
        var role;
        var channel;
        var msgId;
        var prefix;
        var emote;
        var question = yield msg.channel.send(embeds_1.default.role);
        collectRole();
        function collectRole() {
            return __awaiter(this, void 0, void 0, function* () {
                yield msg.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] }).then(messages => {
                    if (cancel(messages.first())) {
                        return;
                    }
                    var tempRole = messages.first().mentions.roles.first().id;
                    if (!tempRole) {
                        msg.reply('That is not a role');
                        return;
                    }
                    role = tempRole;
                    messages.first().delete();
                    collectChannel();
                }).catch(() => { noInput(msg); return; });
            });
        }
        function collectChannel() {
            return __awaiter(this, void 0, void 0, function* () {
                yield question.edit(embeds_1.default.channel);
                yield msg.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] }).then(messages => {
                    if (cancel(messages.first())) {
                        return;
                    }
                    var tempChnl = getChannelFromMention(messages.first().content);
                    if (!tempChnl) {
                        msg.reply('That is not a channel');
                        return;
                    }
                    channel = tempChnl;
                    messages.first().delete();
                    collectId();
                }).catch(() => { noInput(msg); return; });
            });
        }
        function collectId() {
            return __awaiter(this, void 0, void 0, function* () {
                yield question.edit(embeds_1.default.msgId);
                yield msg.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] }).then(messages => {
                    if (cancel(messages.first())) {
                        return;
                    }
                    msgId = messages.first().content;
                    messages.first().delete();
                    collectEmote();
                }).catch(() => { noInput(msg); return; });
            });
        }
        function collectEmote() {
            return __awaiter(this, void 0, void 0, function* () {
                yield question.edit(embeds_1.default.emote);
                yield msg.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] }).then(messages => {
                    if (cancel(messages.first())) {
                        return;
                    }
                    emote = messages.first().content;
                    messages.first().delete();
                    collectPrefix();
                }).catch(() => { noInput(msg); return; });
            });
        }
        function collectPrefix() {
            return __awaiter(this, void 0, void 0, function* () {
                yield question.edit(embeds_1.default.prefix);
                yield msg.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] }).then(messages => {
                    if (cancel(messages.first())) {
                        return;
                    }
                    prefix = messages.first().content;
                    messages.first().delete();
                    collectOkay();
                }).catch(() => { noInput(msg); return; });
            });
        }
        function collectOkay() {
            return __awaiter(this, void 0, void 0, function* () {
                question.delete();
                msg.channel.send('Is this okay?', new discord_js_1.default.MessageEmbed({
                    "color": 15896489,
                    "fields": [
                        {
                            "name": "Role",
                            "value": `<@&${role}>`
                        },
                        {
                            "name": "Channel",
                            "value": `<#${channel}>`
                        },
                        {
                            "name": "Message Id",
                            "value": msgId
                        },
                        {
                            "name": "Prefix",
                            "value": `\`${prefix}\``
                        },
                        {
                            "name": "Emote",
                            "value": emote
                        }
                    ]
                })).then(newMsg => {
                    newMsg.react('✅');
                    newMsg.react('❎');
                    var collector = newMsg.createReactionCollector(reactionFilter, { time: 15000 }).on('collect', (rection, user) => __awaiter(this, void 0, void 0, function* () {
                        if (rection.emoji.name == '❎') {
                            newMsg.channel.send('Canceling');
                            collector.stop();
                            return;
                        }
                        newMsg.delete();
                        var newnewMsg = yield msg.channel.send('Saving...');
                        // React to the message
                        var reactchannel = msg.guild.channels.cache.get('763065143827234896');
                        if (!((reactchannel) => reactchannel.type === 'text')(reactchannel))
                            return;
                        // Get the emote id
                        var tempemote;
                        if (!emote.includes(':')) {
                            tempemote = emote;
                        }
                        else {
                            tempemote = emote.split(':')[2].replace('>', '');
                        }
                        try {
                            // React to the message
                            (yield reactchannel.messages.fetch()).get('763807224950030416').react(tempemote);
                        }
                        catch (err) {
                            // There was an error
                            msg.channel.send('An error occured :(');
                            return;
                        }
                        // Save to the database
                        saveStuff().then(() => {
                            newnewMsg.edit('Saved.');
                        });
                        // Stop collecting reaction
                        collector.stop();
                    })).on('end', () => {
                        return;
                    });
                });
            });
        }
        function saveStuff() {
            return __awaiter(this, void 0, void 0, function* () {
                var roleData = database.collection(msg.guild.id).doc();
                yield roleData.set({
                    role: role,
                    channel: channel,
                    msgId: msgId,
                    prefix: prefix,
                    emote: emote
                }, { merge: true });
            });
        }
        function cancel(messageContent) {
            if (messageContent.content.toLowerCase() == 'cancel') {
                msg.channel.send('Cancelled');
                return true;
            }
            else {
                return false;
            }
        }
        //var rrRef = database.collection('react roles').doc()
    });
}
function getChannelFromMention(mention) {
    if (!mention)
        return;
    if (mention.startsWith('<#') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);
        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }
        return mention;
    }
}
function noInput(msg) {
    msg.channel.send('Too Slow');
}
exports.default = command;
