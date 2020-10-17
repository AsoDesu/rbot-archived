import 'dotenv/config'
import Discord from 'discord.js'
const client = new Discord.Client()

import addReact from './reactAdd'
import removeReact from './reactRemove'

// Commands
import createRR from './commands/createRR'
import removeRR from './commands/removeRR'
import help from './commands/help'
import dev from './commands/dev';

client.on('message', async (msg: Discord.Message) => {
    if (!msg.content.startsWith(process.env.PREFIX) || msg.author.bot) return;
    if (!msg.guild) { msg.reply('You are not in a server'); return };

    const args = msg.content.slice(process.env.PREFIX.length).split(/ +/)
    const command = args.shift().toLowerCase()

    switch (command) {
        case 'create':
            try { createRR(msg, args) } catch { }
            break;
        case 'delete':
            try { removeRR(msg, args) } catch { }
            break;
        case 'help':
            try { help(msg, args) } catch { }
            break
        case 'test':
            try { dev(msg, args) } catch { }
            break;
    }
})

client.on('raw', ({ t, d }) => {
    switch (t) {
        case 'MESSAGE_REACTION_ADD':
            try { addReact(d, client) } catch { }
            break;
        case 'MESSAGE_REACTION_REMOVE':
            try { removeReact(d, client) } catch { }
            break;
    }
})

client.on('ready', () => {
    console.log('Connected to discord Pog')
    client.user.setActivity({ type: 'WATCHING', name: `${client.guilds.cache.size} servers` })
})

client.on('guildCreate', () => {
    client.user.setActivity({ type: 'WATCHING', name: `${client.guilds.cache.size} servers` })
})

client.login(process.env.TOKEN)

import Express from 'express'
const app = Express()

app.get('/ping', (req, res) => {
    res.send('Online')
})

app.get('/', (req, res) => {
    res.send('hello ;)')
})

app.listen(process.env.PORT)
