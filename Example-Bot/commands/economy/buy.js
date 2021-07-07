const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "buy",
  category: "Economy",
  aliases: ["buy"],
  cooldown: 2,
  usage: "buy",
  description: "buy an item from the shop",
  run: async (client, message, args, user, text, prefix) => {
    var user = message.mentions.users.first() || message.author;
    let data = await client.eco.Buyitem(user.id, message.guild.id, args[0])
    console.log(data)
    if (data === 'ALREADY_PURCHASED') {
      return message.channel.send("YOU ALREADY OWN THIS ITEM")
    }
    else if (data === 'NOT_ENOUGH_CASH') {
      return message.channel.send("YOU DON'T HAVE ENOUGH CASH TO OWN THIS ITEM")
    }
    message.channel.send(new MessageEmbed()
      .setTitle(`Sucessfully Purchased ${data.Name}`)
      .setFooter(' 👍 ')
      .setTimestamp()
    )
  }
}