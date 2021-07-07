const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "leaderboard",
  category: "Economy",
  aliases: ["lb"],
  cooldown: 2,
  usage: "lb",
  description: "Gives you your server lb",
  run: async (client, message, args, user, text, prefix) => {
    var user = message.mentions.users.first() || message.author;
    let data = await client.eco.LeaderBoard(message.guild.id)
    let embed = new MessageEmbed()
      .setTitle(`${message.guild.name}'s Leaderboard`)
      .setFooter(' 👍 ')
      .setTimestamp()
    data.forEach(lb => {
      let user2 = client.users.cache.find(user => user.id === lb.userID)
      embed.addField(`${lb.wallet} - `, `${user2}`)
    })
    message.channel.send(embed)
  }
}