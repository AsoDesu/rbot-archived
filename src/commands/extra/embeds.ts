import { MessageEmbed } from "discord.js"

export default {
    role: new MessageEmbed({
        "title": "What role would you like to use",
        "description": "This will be the role given to a user when they react \n e.g. @update-pings",
        "color": 65420,
        "footer": {
            "text": "Step 1 - 5"
        }
    }),
    channel: new MessageEmbed({
        "title": "What channel is the message in",
        "description": "This is the channel that the message is in \n e.g. #roles",
        "color": 65420,
        "footer": {
            "text": "Step 2 - 5"
        }
    }),
    msgId: new MessageEmbed({
        "title": "What is the id of the message",
        "description": "This is the ID of the message \n [Here is a guide on how to get a message id](https://medium.com/@Seth./how-to-retrieve-message-user-server-and-channel-ids-on-discord-3d83bd0327d4)",
        "color": 65420,
        "footer": {
            "text": "Step 3 - 5"
        }
    }),
    emote: new MessageEmbed({
        "title": "What emote would you like to use",
        "description": "This is the emote the user must react with to get the role \n e.g. 💌",
        "color": 65420,
        "footer": {
            "text": "Step 4 - 5"
        }
    }),
    delete: new MessageEmbed({
        "title": "Are you sure you want to delete this reaction role",
        "description": "This will remove all reactions to the message \n This action is irreversible",
        "color": 15415860
    }),
    help: new MessageEmbed({
        "title": "rBot Beta Help",
        "description": "use r!help [command] for help on a specific command",
        "color": 4360181,
        "fields": [
          {
            "name": "create",
            "value": "Creates a new reaction role",
            "inline": true
          },
          {
            "name": "delete {message id}",
            "value": "Deletes all reaction roles on a specific message",
            "inline": true
          },
          {
            "name": "help",
            "value": "Display's this help menu",
            "inline": true
          }
        ],
        "footer": {
          "icon_url": "https://cdn.discordapp.com/avatars/580425653325791272/a_3f2acc778b557be3d58156b5b1262158.png",
          "text": "rBot created by Aso"
        }
      })
}  