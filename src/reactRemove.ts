import Discord from 'discord.js'

import firebase from 'firebase'

var database = firebase.firestore()

function removeReaction(d: any, client: Discord.Client) {
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
            if (!user.roles.cache.has(role)) return;

            user.roles.remove(guild.roles.cache.get(role))
        })
    })

}

export default removeReaction