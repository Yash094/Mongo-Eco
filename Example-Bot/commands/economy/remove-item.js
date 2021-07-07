const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "remove-item",
  category: "Economy",
  aliases: ["remove-item"],
  cooldown: 2,
  usage: "add-item",
  description: "Remove Item From Shop",
  run: async (client, message, args, user, text, prefix) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send(
        `You dont have Permission to use this Command`
      );
    var user = message.mentions.users.first() || message.author;
    console.log(args)
    let data = await client.eco.RemoveItem(message.guild.id, args[0])

    message.channel.send(new MessageEmbed()
      .setTitle(`Product With Id ${args[0]} Has Been Removed From The Shop`)
      .setDescription(`Users can no more buy the item from the shop`)
      .setFooter(' 👍 ')
      .setTimestamp()
    )
  }
}