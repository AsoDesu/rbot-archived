import Discord from 'discord.js'

import embeds from './extra/embeds'

function command(msg: Discord.Message, args: string[]) {
    msg.channel.send(embeds.help)
}

export default command