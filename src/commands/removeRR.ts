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

    if (!args[0]) {
        msg.channel.send('Correct usage `!removerr {message id}`')
        return;
    }

    const reactionFilter = (reaction: any, user: any) => {
        return user.id === msg.author.id;
    };

    var yesMsg = await msg.channel.send(embeds.delete)
    yesMsg.react('✅')
    yesMsg.react('❌')
    var collector = yesMsg.createReactionCollector(reactionFilter, { time: 15000 }).on('collect', async (rection: Discord.MessageReaction, user: any) => {
        if (rection.emoji.name == '❌') {
            yesMsg.channel.send('Canceled');
            collector.stop();
            return;
        }
        deleteRR()
        collector.stop()
    }).on('end', () => {
        return;
    })

    function deleteRR() {
        database.collection(msg.guild.id).where('msgId', '==', args[0]).get().then(docs => {
            if (docs.size == 0) {
                msg.reply('That reaction role does not exist')
                return;
            }
            docs.forEach(async doc => {
                var message = await msg.channel.send('Deleting reaction role')
                var reactchannel = msg.guild.channels.cache.get(doc.data().channel)
                if (!((reactchannel): reactchannel is Discord.TextChannel => reactchannel.type === 'text')(reactchannel)) return;
                (await reactchannel.messages.fetch()).get(doc.data().msgId).reactions.removeAll()
                
                await database.collection(msg.guild.id).doc(doc.id).delete()
                await message.edit('Deleted')
                return;
            })
        })
    }
}

export default command