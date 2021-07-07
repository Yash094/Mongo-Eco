const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "withdraw",
  category: "Economy",
  aliases: ["with"],
  cooldown: 2,
  usage: "withdraw",
  description: "Withdraw amount from bank",
  run: async (client, message, args, user, text, prefix) => {
    var user = message.author;
    let data = await client.eco.Withdraw(user.id, message.guild.id, args[0])
    let data2 = await client.eco.GetBankbal(user.id, message.guild.id)
    if(data === 'CASH_IN_BANK' ){
      return message.channel.send(`${user} You Don't Have Enough Cash In Wallet`)
    }
    message.channel.send(`${user} ${args[0]} withdrawn. current bank balance ${data2}`)
  }
}