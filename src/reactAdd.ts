import Discord from 'discord.js'

import firebase from 'firebase'
firebase.initializeApp({
    apiKey: "AIzaSyCsnQ-zf-q5UmZ-2aFbico-fyRw0oPwkR8",
    authDomain: "sus-bot-00o8.firebaseapp.com",
    databaseURL: "https://sus-bot-00o8.firebaseio.com",
    projectId: "sus-bot-00o8",
    storageBucket: "sus-bot-00o8.appspot.com",
    messagingSenderId: "563655496654",
    appId: "1:563655496654:web:57f8b4fdc81fe55b73919f"
})

var database = firebase.firestore()

function addReaction(d: any, client: Discord.Client) {
    if (d.user_id == client.user.id) return;
    var guild = client.guilds.cache.get(d.guild_id)
    var user = guild.members.cache.get(d.user_id)

    var emote
    if (d.emoji.id) {
        emote = `<:${d.emoji.name}:${d.emoji.id}>`
    } else {
        emote = d.emoji.name
    }

    database.collection(d.guild_id).where('emote', '==', emote).get().then(docs => {
        docs.forEach(doc => {
            var data = doc.data()
            if (!data.msgId == d.message_id) return;

            var role = data.role
            if (user.roles.cache.has(role)) return;

            try {
                user.roles.add(guild.roles.cache.get(role))
            } catch { }
        })
    })
}

export default addReaction