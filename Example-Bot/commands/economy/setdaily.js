const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "setdaily",
  category: "Economy",
  aliases: ["setdaily"],
  cooldown: 2,
  usage: "setdaily",
  description: "Set DailY LiMIT",
  run: async (client, message, args, user, text, prefix) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send(
        `You dont have Permission to use this Command`
      );
    var user = message.mentions.users.first() || message.author;
    let data = await client.eco.SetDaily(message.guild.id, args[0])

    message.channel.send(new MessageEmbed()
      .setTitle(`Changed The Weekly Bonus Amount To ${data.dailyAmt}`)
      .setColor("GREEN")
      .setFooter(' 👍 ')
      .setTimestamp()
    )
  }
}