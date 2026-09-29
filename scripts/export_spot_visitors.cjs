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
    
    const countryMap = {
      '🇺🇸': 'United States',
      '🇧🇩': 'Bangladesh',
      '🇮🇩': 'Indonesia',
      '🇧🇷': 'Brazil',
      '🇨🇳': 'China',
      '🇭🇰': 'Hong Kong',
      '🇮🇳': 'India',
      '🇬🇧': 'United Kingdom',
      '🇨🇦': 'Canada',
      '🇦🇺': 'Australia',
      '🇩🇪': 'Germany',
      '🇫🇷': 'France',
      '🇯🇵': 'Japan',
      '🇰🇷': 'South Korea',
      '🇪🇸': 'Spain',
      '🇷🇺': 'Russia',
      '🇹🇷': 'Turkey',
      '🇳🇬': 'Nigeria',
      '🇲🇽': 'Mexico',
      '🇦🇷': 'Argentina',
      '🇨🇱': 'Chile',
      '🇵🇰': 'Pakistan',
      '🇳🇵': 'Nepal',
      '🇻🇪': 'Venezuela',
      '🇲🇳': 'Mongolia',
      '🇦🇹': 'Austria',
      '🇩🇰': 'Denmark',
      '🇧🇪': 'Belgium',
      '🇳🇱': 'Netherlands',
      '🇭🇷': 'Croatia'
    };
    
    for (const chId of channels) {
      const channel = await client.channels.fetch(chId);
      const messages = await channel.messages.fetch({ limit: 100 });
      
      messages.forEach(msg => {
        if (msg.embeds && msg.embeds[0]) {
          const embed = msg.embeds[0].data;
          const fields = embed.fields || [];
          
          const getField = (name) => {
            const field = fields.find(f => f.name.includes(name));
            return field ? field.value.trim() : '';
          };
          
          allData.push({
            timestamp: new Date(embed.timestamp || msg.createdAt).toISOString(),
            location: getField('Location') || (embed.description || '').trim(),
            device: getField('Device'),
            browser: getField('Browser'),
            ip: getField('IP Address'),
            referrer: getField('Referrer'),
            channel: channel.name
          });
        }
      });
    }
    
    // Calculate counters
    const countries = new Map();
    const uniqueIps = new Set();
    const referrerCounts = new Map();
    const deviceTypes = new Map();
    
    allData.forEach(d => {
      const flag = d.location.match(/\p{Emoji}/u)?.[0] || 'Unknown';
      const countryName = countryMap[flag] || d.location;
      countries.set(countryName, (countries.get(countryName) || 0) + 1);
      
      if (d.ip && d.ip !== '') uniqueIps.add(d.ip);
      if (d.referrer && d.referrer !== '') {
        referrerCounts.set(d.referrer, (referrerCounts.get(d.referrer) || 0) + 1);
      }
      if (d.device.includes('Mobile')) deviceTypes.set('Mobile', (deviceTypes.get('Mobile') || 0) + 1);
      if (d.device.includes('Desktop')) deviceTypes.set('Desktop', (deviceTypes.get('Desktop') || 0) + 1);
      if (d.device.includes('Tablet')) deviceTypes.set('Tablet', (deviceTypes.get('Tablet') || 0) + 1);
    });
    
    // Generate CSV
    const csvRows = [['Timestamp','Location','Device','Browser','IP Address','Referrer','Channel']];
    
    allData.forEach(d => {
      csvRows.push([d.timestamp, d.location, d.device, d.browser, d.ip, d.referrer, d.channel]
        .map(val => '"' + (val || '').replace(/"/g, '""') + '"'));
    });
    
    // Add summary section
    csvRows.push([]);
    csvRows.push(['=== SUMMARY COUNTERS ===']);
    csvRows.push(['Metric', 'Value']);
    csvRows.push(['Total Visits', allData.length]);
    csvRows.push(['Unique IP Addresses', uniqueIps.size]);
    csvRows.push(['Distinct Countries', countries.size]);
    csvRows.push(['Referrer Sources', referrerCounts.size]);
    csvRows.push(['Device Categories', deviceTypes.size]);
    
    csvRows.push([]);
    csvRows.push(['=== COUNTRY COUNTERS ===']);
    csvRows.push(['Country', 'Visits', 'Percentage']);
    [...countries.entries()].sort((a,b) => b[1]-a[1]).forEach(([country, count]) => {
      csvRows.push([country, count, (count/allData.length*100).toFixed(1) + '%']);
    });
    
    csvRows.push([]);
    csvRows.push(['=== DEVICE TYPE COUNTERS ===']);
    csvRows.push(['Device Type', 'Count', 'Percentage']);
    [...deviceTypes.entries()].sort((a,b) => b[1]-a[1]).forEach(([device, count]) => {
      csvRows.push([device, count, (count/allData.length*100).toFixed(1) + '%']);
    });
    
    csvRows.push([]);
    csvRows.push(['=== TOP REFERRERS ===']);
    csvRows.push(['Referrer', 'Count']);
    [...referrerCounts.entries()].sort((a,b) => b[1]-a[1]).slice(0, 10).forEach(([ref, count]) => {
      csvRows.push([ref, count]);
    });
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const filePath = '/Users/rabbi/Desktop/spot_visitors_combined.csv';
    fs.writeFileSync(filePath, csvContent);
    
    console.log('✅ Saved combined CSV to:', filePath);
    console.log('Total records combined:', allData.length);
    
    const timestamps = allData.map(d => new Date(d.timestamp));
    console.log('Time range:', new Date(Math.min(...timestamps)).toLocaleString(), 'to', new Date(Math.max(...timestamps)).toLocaleString());
    
    console.log('\n=== COMBINED SPOT VISITORS SUMMARY ===');
    console.log('Total Visits:', allData.length);
    console.log('Unique IPs:', uniqueIps.size);
    console.log('Distinct Countries:', countries.size);
    console.log('Referrer Sources:', referrerCounts.size);
    console.log('Device Categories:', deviceTypes.size);
    
    console.log('\n🌍 COUNTRY COUNTERS');
    [...countries.entries()].sort((a,b) => b[1]-a[1]).slice(0, 10).forEach(([country, count]) => {
      console.log('  ' + country + ': ' + count + ' visits (' + (count/allData.length*100).toFixed(1) + '%)');
    });
    
    console.log('\n📊 VISIT COUNTERS');
    console.log('Total Visits:', allData.length);
    console.log('Unique IP Addresses:', uniqueIps.size);
    console.log('Distinct Countries:', countries.size);
    console.log('Unique Referrer Sources:', referrerCounts.size);
    
    client.destroy();
  } catch (e) {
    console.log('❌ Error:', e.message);
    client.destroy();
  }
});

client.login(process.env.DISCORD_TOKEN);