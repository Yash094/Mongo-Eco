const { config } = require("dotenv");
const prefix = "!";
const discord = require("discord.js");
const mongoose = require("mongoose");
const client = new discord.Client({
  disableEveryone: true // 
});
const economy = require("@shinchanop/mongo-eco")
const { MessageEmbed } = require("discord.js");
client.commands = new discord.Collection();
client.aliases = new discord.Collection();

["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

client.on("ready", async () => {
  console.log("I am Reday to Go");
  client.user.setActivity("/help | Aztex OP");
  await mongoose.connect(
    "",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
  );
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose has successfully connected!");
});

mongoose.connection.on("err", err => {
  console.error(`Mongoose connection error: \n${err.stack}`);
});

mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose connection lost");
});
client.eco = new economy("")
client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  // Get the command
  let command = client.commands.get(cmd);
  // If none is found, try to find it by alias
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  // If a command is finally found, run the command
  if (command) command.run(client, message, args);
});
client.login("");
