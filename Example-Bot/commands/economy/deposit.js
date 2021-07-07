const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "deposit",
  category: "Economy",
  aliases: ["dep"],
  cooldown: 2,
  usage: "deposit",
  description: "Deposit Money In Bank",
  run: async (client, message, args, user, text, prefix) => {
    var user = message.author;
    let data = await client.eco.Deposit(user.id, message.guild.id, args[0])
    let data2 = await client.eco.GetBankbal(user.id, message.guild.id)
    if (data === 'CASH_IN_WALLET') {
      return message.channel.send(`${user} You Don't Have Enough Cash In Wallet`)
    }
    message.channel.send(`${args[0]} deposited. current bank balance ${data2}`)
  }
}