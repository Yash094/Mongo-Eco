const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "inv",
  category: "Economy",
  aliases: ["Daily"],
  cooldown: 2,
  usage: "Daily",
  description: "Gives you your Inv",
  run: async (client, message, args, user, text, prefix) => {
    var user = message.mentions.users.first() || message.author;
    let data = await client.eco.GetInv(user.id, message.guild.id)
    let embed = new MessageEmbed()
      .setTitle(`${message.author.username}'s Inv'`)
      .setFooter(' 👍 ')
      .setTimestamp()

   console.log(data)
    data.forEach(item => {
      console.log(item)
      embed.addField(`${item.Name}`, `Selling Price - ${item.Sell}`)
    })


    message.channel.send(embed)


  }
}