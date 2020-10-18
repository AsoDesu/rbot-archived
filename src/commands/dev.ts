import { Message } from "discord.js";

import firebase from 'firebase'
var database = firebase.firestore()

async function command(msg: Message, args: string[]) {
    var doc = await database.collection('bot').doc('devinfo').get()

    var betaMsg: string;

    switch (doc.data().beta) {
        case false:
            betaMsg = 'There is currently no public beta avalible.'
            break;
        case true:
            betaMsg = 'There is a public beta avalable at https://rbot.asodev.tk/beta'
            break;
    }

    msg.channel.send(`${doc.data().testmessage}\n${betaMsg}`)
}

async function dev(msg: Message, args: string[]) {
    msg.channel.send(msg.guild.id)
}

export default { command: command, dev: dev }