const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "transfer",
  category: "Economy",
  aliases: ["Transfer"],
  cooldown: 2,
  usage: "Transfer",
  description: "Transfer Money To A User",
  run: async (client, message, args, user, text, prefix) => {
    var user = message.mentions.users.first()
    if(!user) {
      message.channel.send("MENTION A USER TO TRANSFER THE MONEY")
    }
    let data = await client.eco.Transfer(message.guild.id, message.author.id, user.id, args[1])
    if(data === 'NOT_ENOUGnH_CASH') {
      return message.channel.send(`${user} You Don't Have Enough Cash`)
    }
    message.channel.send("TRANSFERED THE MONEY TO ${user.tag}'s Acc'")
  }
}