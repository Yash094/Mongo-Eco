const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "remove-money",
  category: "Economy",
  aliases: ["remove-money"],
  cooldown: 2,
  usage: "remove-money",
  description: "Remove Money From User's Acc",
  run: async (client, message, args, user, text, prefix) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send(
        `You dont have Permission to use this Command`
      );
    var user = message.mentions.users.first()
    if (!user) {
      return message.channel.send(`PLEASE MENTION A USER TO ADD MONEY`)
    }
    console.log(args)
    let data = await client.eco.RemoveMoney(user.id, message.guild.id, args[1])
    message.channel.send(new MessageEmbed()
      .setTitle(`${args[1]} Has Been Removed From ${user.tag}'s Account'`)
      .setFooter(' 👍 ')
      .setTimestamp()
    )
  }
}