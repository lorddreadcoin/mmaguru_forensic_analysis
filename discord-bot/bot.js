// Jesse ON FIRE - YouTube Member Auto-Invite Bot
// Monitors #youtube-members channel and auto-assigns roles

require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// Configuration
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const WEBHOOK_CHANNEL_ID = '1433481744904093869'; // Your #youtube-members channel
const DISCORD_INVITE_URL = 'https://discord.gg/9WpPC5GS';

// Role IDs from Discord server
const ROLES = {
  'inner-circle': '1435138402474393812', // $4.99 tier - Jesse's Inner Circle
  'best-friends': '1435139067984482315',  // $9.99 tier - Jesse's Best Friends (BFF)
  'elite': '1435139809214464051'          // $24.99 tier - Love Me Long Time
};

// YouTube membership verification
async function verifyYouTubeMembership(youtubeUsername) {
  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    console.warn('⚠️ YouTube API not configured - skipping verification');
    return { verified: false, error: 'API not configured' };
  }

  try {
    console.log(`🔍 Verifying YouTube membership for: ${youtubeUsername}`);
    
    // Note: YouTube API doesn't have a direct "check if user is a member" endpoint
    // This is a limitation of the YouTube API
    // Options:
    // 1. Trust the user (they submitted form)
    // 2. Require them to connect YouTube in Discord (Discord will verify)
    // 3. Manual verification by checking channel members list
    
    // For now, we'll use Discord's native YouTube integration
    // which auto-verifies membership when users connect their YouTube account
    
    console.log('ℹ️ YouTube membership will be verified when user connects YouTube in Discord');
    
    return { 
      verified: 'pending',
      message: 'User must connect YouTube account in Discord for verification',
      method: 'discord_integration'
    };
    
  } catch (error) {
    console.error('❌ YouTube verification error:', error);
    return { verified: false, error: error.message };
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log('✅ YouTube Bridge Bot is online!');
  console.log(`🤖 Logged in as ${client.user.tag}`);
  console.log(`📡 Monitoring channel: ${WEBHOOK_CHANNEL_ID}`);
  console.log(`🔗 Discord invite: ${DISCORD_INVITE_URL}`);
  console.log('🔐 YouTube membership verification: ENABLED (via Discord integration)');
  console.log('');
});

// Monitor when members get roles (YouTube verification complete)
client.on('guildMemberUpdate', async (oldMember, newMember) => {
  // Check if roles changed
  const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
  
  if (addedRoles.size === 0) return;
  
  // Check if any YouTube member role was added
  const youtubeRoles = Object.values(ROLES);
  const gotYouTubeRole = addedRoles.some(role => youtubeRoles.includes(role.id));
  
  if (gotYouTubeRole) {
    console.log(`✅ YouTube member verified: ${newMember.user.tag}`);
    
    // Get the verification channel
    const channel = client.channels.cache.get(WEBHOOK_CHANNEL_ID);
    if (!channel) return;
    
    // Post verification success
    const verifiedEmbed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ YouTube Member Verified!')
      .setDescription(`**${newMember.user.tag}** has been verified as a YouTube member!`)
      .addFields(
        { name: '🎉 Status', value: 'Discord successfully verified YouTube membership', inline: false },
        { name: '👤 User', value: `<@${newMember.id}>`, inline: true },
        { name: '🏆 Roles Assigned', value: addedRoles.map(r => r.name).join(', '), inline: true }
      )
      .setFooter({ text: 'Auto-verified by Discord YouTube integration' })
      .setTimestamp();
    
    await channel.send({ embeds: [verifiedEmbed] });
    
    // Optional: Send welcome DM to the user
    try {
      await newMember.send({
        embeds: [new EmbedBuilder()
          .setColor('#FF5A1F')
          .setTitle('🔥 Welcome to Jesse ON FIRE Discord!')
          .setDescription('Your YouTube membership has been verified!')
          .addFields(
            { name: '✅ Access Granted', value: 'You now have full member access!' },
            { name: '📺 Channel', value: 'Check out member-only channels!' }
          )
        ]
      });
      console.log(`📧 Welcome DM sent to ${newMember.user.tag}`);
    } catch (error) {
      console.log(`⚠️ Could not DM ${newMember.user.tag} (DMs might be closed)`);
    }
  }
});

// Monitor webhook channel for new submissions
client.on('messageCreate', async (message) => {
  // Only watch the webhook channel
  if (message.channel.id !== WEBHOOK_CHANNEL_ID) return;
  
  // Only process webhook messages with embeds
  if (!message.embeds || message.embeds.length === 0) return;
  
  const embed = message.embeds[0];
  
  // Check if this is a YouTube verification message
  if (!embed.title || !embed.title.includes('YouTube Member Verification')) return;
  
  console.log('📝 New YouTube member verification detected!');
  
  // Extract info from embed
  const fields = embed.fields;
  const discordUsername = fields.find(f => f.name === 'Discord')?.value || 'Unknown';
  const youtubeUsername = fields.find(f => f.name === 'YouTube')?.value || 'Unknown';
  const email = fields.find(f => f.name === 'Email')?.value || 'Unknown';
  
  console.log(`👤 Discord: ${discordUsername}`);
  console.log(`📺 YouTube: ${youtubeUsername}`);
  console.log(`📧 Email: ${email}`);
  
  // Verify YouTube membership
  const verification = await verifyYouTubeMembership(youtubeUsername);
  
  // Create response embed based on verification
  const responseEmbed = new EmbedBuilder()
    .setColor('#FF5A1F')
    .setTitle('📋 Verification Status')
    .setDescription(`Submission from **${youtubeUsername}**`)
    .addFields(
      { name: 'Discord Username', value: discordUsername, inline: true },
      { name: 'Email', value: email, inline: true },
      { name: '📊 Status', value: '⏳ Pending YouTube Connection', inline: false },
      { 
        name: '✅ Required Actions', 
        value: 
          '1️⃣ User joins Discord via invite\n' +
          '2️⃣ User goes to Settings → Connections → YouTube\n' +
          '3️⃣ Discord auto-verifies membership (2-3 min)\n' +
          '4️⃣ Role auto-assigned based on tier',
        inline: false 
      },
      { name: '🔗 Invite Link', value: DISCORD_INVITE_URL, inline: false }
    )
    .setFooter({ text: 'YouTube membership verified by Discord integration' })
    .setTimestamp();
  
  await message.channel.send({ embeds: [responseEmbed] });
  
  console.log('✅ Verification status posted!');
  console.log('⏳ Waiting for user to connect YouTube account in Discord...\n');
});

// Error handling
client.on('error', error => {
  console.error('❌ Discord bot error:', error);
});

// Login
if (!BOT_TOKEN) {
  console.error('❌ DISCORD_BOT_TOKEN not set in environment variables!');
  process.exit(1);
}

client.login(BOT_TOKEN);
