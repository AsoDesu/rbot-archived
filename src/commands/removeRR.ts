import Discord from 'discord.js'
import 'dotenv/config'

import firebase from 'firebase'

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
    }

    database.collection(msg.guild.id).where('msgId', '==', args[0]).get().then(docs => {
        if (docs.size == 0) {
            msg.reply('That reaction role does not exist')
            return;
        }
        docs.forEach(async doc => {
            var message = await msg.channel.send('Deleting reaction role')
            database.collection(msg.guild.id).doc(doc.id).delete()
            await message.edit('Deleted')
        })
    })
}

export default command