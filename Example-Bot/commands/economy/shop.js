const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "shop",
  category: "Economy",
  aliases: ["balance"],
  cooldown: 2,
  usage: "bal",
  description: "Get Shop",
  run: async (client, message, args, user, text, prefix) => {
    var user = message.mentions.users.first() || message.author;
    let data = await client.eco.GetShop(message.guild.id)
    let embed = new MessageEmbed()
      .setTitle(`SHOP`)
      .setFooter(' 👍 ')
      .setTimestamp()

    data.forEach(item => {
      embed.addField(`${item.Name}`, `Price: ${item.Price}\n ID: ${item.id}`)
    })
    message.channel.send(embed)
  }
}