const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "sell",
  category: "Economy",
  aliases: ["sell"],
  cooldown: 2,
  usage: "sell",
  description: "Sell an Item",
  run: async (client, message, args, user, text, prefix) => {
    var user = message.mentions.users.first() || message.author;
    let data = await client.eco.SellItem(user.id, message.guild.id, args[0])
    console.log(data)
    if (data === 'NOT_PURCHASED') {
      return message.channel.send("YOU DON'T OWN THIS ITEM")
    }
    message.channel.send(new MessageEmbed()
      .setTitle(`Sucessfully Sold ${data.Name}`)
      .setFooter(' 👍 ')
      .setTimestamp()
    )
  }
}