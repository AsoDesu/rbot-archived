import Discord from 'discord.js'
import 'dotenv/config'

import firebase from 'firebase'
import embeds from './extra/embeds'

var database = firebase.firestore()
var auth = firebase.auth()
auth.signInWithEmailAndPassword('susBot@gmail.com', process.env.FIREPASS)

async function command(msg: Discord.Message, args: string[]) {

    if (!msg.member.hasPermission('MANAGE_ROLES')) {
        msg.channel.send('You don\'t have permssion to do that')
        return;
    }

    const filter = (m: { author: { id: string } }) => msg.author.id === m.author.id;
    const reactionFilter = (reaction: any, user: any) => {
        return user.id === msg.author.id;
    };

    var role: string;
    var channel: string;
    var msgId: string;
    var emote: string;

    var question = await msg.channel.send(embeds.role)
    collectRole()

    async function collectRole() {
        await msg.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] }).then(messages => {
            if (cancel(messages.first())) { return; }
            var tempRole = messages.first().mentions.roles.first().id
            if (!tempRole) { msg.reply('That is not a role'); return; }
            role = tempRole
            messages.first().delete()
            collectChannel()
        }).catch(() => { noInput(msg); return; })
    }

    async function collectChannel() {
        await question.edit(embeds.channel)
        await msg.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] }).then(messages => {
            if (cancel(messages.first())) { return; }
            var tempChnl = getChannelFromMention(messages.first().content)
            if (!msg.guild.channels.cache.get(tempChnl)) { msg.reply('That channel does not exist in this server'); return }
            if (!tempChnl) { msg.reply('That is not a channel'); return; }
            channel = tempChnl
            messages.first().delete()
            collectId()
        }).catch(() => { noInput(msg); return; })
    }

    async function collectId() {
        await question.edit(embeds.msgId)
        await msg.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] }).then(async messages => {
            if (cancel(messages.first())) { return; }
            msgId = messages.first().content
            // Check
            var checkChannel = msg.guild.channels.cache.get(channel)
            if (!((checkChannel): checkChannel is Discord.TextChannel => checkChannel.type === 'text')(checkChannel)) return;
            if (!(await checkChannel.messages.fetch()).get(msgId)) { msg.reply('That message does not exist in this server'); return }

            messages.first().delete()
            collectEmote()
        }).catch(() => { noInput(msg); return; })
    }

    async function collectEmote() {
        await question.edit(embeds.emote)
        await msg.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] }).then(messages => {
            if (cancel(messages.first())) { return; }
            emote = messages.first().content
            messages.first().delete()
            collectOkay()
        }).catch(() => { noInput(msg); return; })
    }

    async function collectOkay() {
        question.delete()
        msg.channel.send('Is this okay?', new Discord.MessageEmbed({
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
                    "name": "Emote",
                    "value": emote
                }
            ]
        })).then(newMsg => {
            newMsg.react('✅')
            newMsg.react('❎')
            var collector = newMsg.createReactionCollector(reactionFilter, { time: 15000 }).on('collect', async (rection: Discord.MessageReaction, user: any) => {
                if (rection.emoji.name == '❎') {
                    newMsg.channel.send('Canceling');
                    collector.stop();
                    return;
                }
                newMsg.delete()
                var newnewMsg = await msg.channel.send('Saving...')

                // React to the message

                var reactchannel = msg.guild.channels.cache.get(channel);
                if (!((reactchannel): reactchannel is Discord.TextChannel => reactchannel.type === 'text')(reactchannel)) return;

                // Get the emote id

                var tempemote = getEmote(emote)
                try {
                    // React to the message
                    (await reactchannel.messages.fetch()).get(msgId).react(tempemote)
                } catch (err) {
                    // There was an error
                    msg.channel.send('An error occured :(')
                    return;
                }

                // Save to the database

                saveStuff().then(() => {
                    newnewMsg.edit('Saved.')
                })

                // Stop collecting reaction
                collector.stop()
            }).on('end', () => {
                return;
            })
        })
    }

    async function saveStuff() {
        var roleData = database.collection(msg.guild.id).doc()
        await roleData.set({
            role: role,
            channel: channel,
            msgId: msgId,
            emote: emote
        }, { merge: true })
    }

    function cancel(messageContent: Discord.Message) {
        if (messageContent.content.toLowerCase() == 'cancel') {
            msg.channel.send('Cancelled')
            return true
        } else {
            return false
        }
    }

    function getEmote(reqEmote: string) {
        var tempemote;
        if (!emote.includes(':')) {
            tempemote = reqEmote
        } else {
            tempemote = reqEmote.split(':')[2].replace('>', '')
        }
        return tempemote
    }

    //var rrRef = database.collection('react roles').doc()
}

function getChannelFromMention(mention: string) {
    if (!mention) return;
    if (mention.startsWith('<#') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);
        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }
        return mention
    }
}

function noInput(msg: Discord.Message) {
    msg.channel.send('Too Slow')
}

export default command