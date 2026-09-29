require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

client.on('clientReady', async () => {
  try {
    const channels = ['1545095344839336026', '1544242588721225768'];
    const allData = [];
    
    for (const chId of channels) {
      const channel = await client.channels.fetch(chId);
      const messages = await channel.messages.fetch({ limit: 100 });
      
      messages.forEach(msg => {
        if (msg.embeds && msg.embeds[0]) {
          const embed = msg.embeds[0].data;
          const content = embed.description || '';
          const fields = embed.fields || [];
          const fullText = content + ' ' + fields.map(f => f.name + ':' + f.value).join(' ');
          
          // Extract field values
          const getField = (name) => {
            const field = fields.find(f => f.name.includes(name));
            return field ? field.value.trim() : '';
          };
          
          allData.push({
            timestamp: new Date(embed.timestamp || msg.createdAt).toISOString(),
            location: getField('Location') || content.trim(),
            device: getField('Device'),
            browser: getField('Browser'),
            ip: getField('IP Address'),
            referrer: getField('Referrer'),
            channel: channel.name
          });
        }
      });
    }
    
    // Generate CSV
    const csvRows = [['Timestamp','Location','Device','Browser','IP Address','Referrer','Channel']];
    
    allData.forEach(d => {
      csvRows.push([
        d.timestamp,
        d.location,
        d.device,
        d.browser,
        d.ip,
        d.referrer,
        d.channel
      ].map(val => '"' + (val || '').replace(/"/g, '""') + '"'));
    });
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const filePath = '/Users/rabbi/Desktop/spot_visitors_combined.csv';
    
    fs.writeFileSync(filePath, csvContent);
    
    console.log('✅ Saved combined CSV to:', filePath);
    console.log('Total records combined:', allData.length);
    
    const timestamps = allData.map(d => new Date(d.timestamp));
    console.log('Time range:', new Date(Math.min(...timestamps)).toLocaleString(), 'to', new Date(Math.max(...timestamps)).toLocaleString());
    
    // Summary stats
    const countries = new Map();
    allData.forEach(d => {
      const flag = d.location.match(/\p{Emoji}/u)?.[0] || 'Unknown';
      const countryMap = {
        '🇺🇸': 'United States',
        '🇧🇩': 'Bangladesh',
        '🇮🇩': 'Indonesia',
        '🇧🇷': 'Brazil',
        '🇨🇳': 'China',
        '🇭🇰': 'Hong Kong',
        '🇮🇳': 'India'
      };
      const countryName = countryMap[flag] || d.location;
      countries.set(countryName, (countries.get(countryName) || 0) + 1);
    });
    
    console.log('\n🌍 LOCATION BREAKDOWN:');
    [...countries.entries()].sort((a,b) => b[1]-a[1]).forEach(([country, count]) => {
      console.log('  ' + country + ': ' + count + ' (' + (count/allData.length*100).toFixed(1) + '%)');
    });
    
    client.destroy();
  } catch (e) {
    console.log('❌ Error:', e.message);
    client.destroy();
  }
});

client.login(process.env.DISCORD_TOKEN);