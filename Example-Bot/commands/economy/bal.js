const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "bal",
  category: "Economy",
  aliases: ["balance"],
  cooldown: 2,
  usage: "bal",
  description: "Gives you your acc balance",
  run: async (client, message, args, user, text, prefix) => {
    var user = message.mentions.users.first() || message.author;
    let data = await client.eco.GetBal(user.id, message.guild.id)
    let data2 = await client.eco.GetBankbal(user.id, message.guild.id)
    message.channel.send(new MessageEmbed()
      .setTitle(`${message.author.username}'s Acc`)
      .setDescription(`**Wallet Balance:** ${data} \n**Bank Balance:** ${data2}`)
      .setFooter(' 👍 ')
      .setTimestamp()
    )
  }
}