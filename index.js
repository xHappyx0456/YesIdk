const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  if (message.content.startsWith('!player')) {
    // Get player name from command
    const playerName = message.content.split(' ')[1];

    // Make API request to get player info
    try {
      const response = await axios.get(`https://api.sportsdata.io/v3/nfl/scores/json/Players/${playerName}?key=YOUR_API_KEY`);
      const playerInfo = response.data[0];
      const embed = new Discord.MessageEmbed()
        .setTitle(playerInfo.FullName)
        .addField('Team', playerInfo.Team)
        .addField('Position', playerInfo.Position)
        .addField('Height', playerInfo.Height)
        .addField('Weight', playerInfo.Weight)
        .addField('College', playerInfo.College)
        .setThumbnail(`https://static.www.nfl.com/t_q-best/league/api/clubs/logos/${playerInfo.Team}.svg`);

      message.channel.send(embed);
    } catch (error) {
      message.channel.send(`Could not find information for ${playerName}`);
    }
  } else if (message.content.startsWith('!score')) {
    // Get week number from command
    const weekNumber = message.content.split(' ')[1];

    // Make API request to get game scores for the specified week
    try {
      const response = await axios.get(`https://api.sportsdata.io/v3/nfl/scores/json/ScoresByWeek/${weekNumber}?key=YOUR_API_KEY`);
      const gameScores = response.data;

      // Create an array of game score strings
      const scoreStrings = gameScores.map(game => `${game.AwayTeam} ${game.AwayScore} @ ${game.HomeTeam} ${game.HomeScore}`);

      // Send message with game scores to channel
      message.channel.send(`Scores for Week ${weekNumber}:\n${scoreStrings.join('\n')}`);
    } catch (error) {
      message.channel.send(`Could not find scores for Week ${weekNumber}`);
    }
  }
});

client.login('YOUR_DISCORD_BOT_TOKEN_HERE');
