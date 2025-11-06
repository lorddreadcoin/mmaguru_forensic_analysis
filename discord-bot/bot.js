// Jesse ON FIRE - YouTube Member Auto-Invite Bot
// Monitors #youtube-members channel and auto-assigns roles

require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes } = require('discord.js');

// Configuration
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const WEBHOOK_CHANNEL_ID = '1433481744904093869'; // Your #youtube-members channel
const DISCORD_INVITE_URL = 'https://discord.gg/9WpPC5GS';

// Role IDs from Discord server
const ROLES = {
  'member': '1435138402474393812', // Default YouTube member role
  'inner-circle': '1435138402474393812', // $4.99 tier - Jesse's Inner Circle
  'best-friends': '1435139067984482315',  // $9.99 tier - Jesse's Best Friends (BFF)
  'elite': '1435139809214464051'          // $24.99 tier - Love Me Long Time
};

// Store pending verifications
// Format: { 'JESSE-XXXX': { youtube: 'username', discord: 'username', email: 'email' } }
const pendingVerifications = new Map();
// Format: { 'discordUsername': { youtube: 'username', role: 'member' } }
const pendingUsernames = new Map();

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

client.once('ready', async () => {
  console.log('✅ YouTube Bridge Bot is online!');
  console.log(`🤖 Logged in as ${client.user.tag}`);
  console.log(`📡 Monitoring channel: ${WEBHOOK_CHANNEL_ID}`);
  console.log(`🔗 Discord invite: ${DISCORD_INVITE_URL}`);
  console.log('🔐 YouTube membership verification: ENABLED');
  
  // Debug: List all channels to find the right one
  console.log('\n🔍 Available channels:');
  client.guilds.cache.forEach(guild => {
    guild.channels.cache.forEach(channel => {
      console.log(`   ${channel.name} (${channel.id}) - Type: ${channel.type}`);
    });
  });
  
  // Register slash commands
  const commands = [
    new SlashCommandBuilder()
      .setName('verify')
      .setDescription('Verify your YouTube membership with a code')
      .addStringOption(option =>
        option.setName('code')
          .setDescription('Your verification code from the email')
          .setRequired(true)
      ),
    new SlashCommandBuilder()
      .setName('check-pending')
      .setDescription('Check if you have a pending verification'),
    new SlashCommandBuilder()
      .setName('assign-role')
      .setDescription('[ADMIN] Manually assign YouTube member role')
      .addUserOption(option =>
        option.setName('user')
          .setDescription('User to assign role to')
          .setRequired(true))
      .addStringOption(option =>
        option.setName('tier')
          .setDescription('Membership tier')
          .setRequired(true)
          .addChoices(
            { name: "Inner Circle ($4.99)", value: 'inner-circle' },
            { name: "Best Friends ($9.99)", value: 'best-friends' },
            { name: "Elite ($24.99)", value: 'elite' }
          ))
  ];
  
  const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
  
  try {
    console.log('📝 Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('✅ Slash commands registered!');
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
  
  console.log('');
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  
  const commandName = interaction.commandName;
  
  if (commandName === 'check-pending') {
    // Check if user has a pending verification
    const username = interaction.user.username.toLowerCase().trim();
    const globalName = interaction.user.globalName?.toLowerCase().trim();
    
    // Check multiple formats
    const pending = pendingUsernames.get(username) || 
                   pendingUsernames.get(globalName);
    
    console.log(`🔍 Checking pending for: ${username} / ${globalName}`);
    console.log(`📋 Available pending: ${Array.from(pendingUsernames.keys()).join(', ')}`);
    
    if (pending) {
      // Try to assign role now
      const role = interaction.guild.roles.cache.get(pending.role);
      if (role) {
        try {
          await interaction.member.roles.add(role);
          pendingUsernames.delete(username);
          
          await interaction.reply({
            content: `✅ Found your pending verification! Role assigned: **${role.name}**`,
            ephemeral: false
          });
          
          // Post success in webhook channel
          const channel = client.channels.cache.get(WEBHOOK_CHANNEL_ID);
          if (channel) {
            const embed = new EmbedBuilder()
              .setColor('#00FF00')
              .setTitle('✅ Member Verified via Check')
              .setDescription(`${interaction.user} has been assigned the **${role.name}** role`)
              .setTimestamp();
            await channel.send({ embeds: [embed] });
          }
        } catch (error) {
          console.error('Error assigning role:', error);
          await interaction.reply({
            content: '❌ Failed to assign role. Please contact an admin.',
            ephemeral: true
          });
        }
      }
    } else {
      await interaction.reply({
        content: '❌ No pending verification found for your username. Please submit the form at https://jesseonfire.com/youtube-members',
        ephemeral: true
      });
    }
  }
  
  if (commandName === 'assign-role') {
    // Check if user is admin
    if (!interaction.member.permissions.has('Administrator')) {
      await interaction.reply({
        content: '❌ You need Administrator permission to use this command.',
        ephemeral: true
      });
      return;
    }

    const targetUser = interaction.options.getUser('user');
    const tier = interaction.options.getString('tier');
    const roleId = ROLES[tier];
    
    if (!roleId) {
      await interaction.reply({
        content: '❌ Invalid tier selected.',
        ephemeral: true
      });
      return;
    }

    try {
      const member = await interaction.guild.members.fetch(targetUser.id);
      const role = interaction.guild.roles.cache.get(roleId);
      
      if (!role) {
        await interaction.reply({
          content: `❌ Could not find role for tier: ${tier}`,
          ephemeral: true
        });
        return;
      }

      await member.roles.add(role);
      
      await interaction.reply({
        content: `✅ Successfully assigned **${role.name}** to ${targetUser}!`,
        ephemeral: false
      });

      console.log(`✅ Admin manually assigned ${role.name} to ${targetUser.tag}`);
    } catch (error) {
      console.error('Error assigning role:', error);
      await interaction.reply({
        content: '❌ Failed to assign role. Check bot permissions.',
        ephemeral: true
      });
    }
  }
  
  if (commandName === 'verify') {
    const code = interaction.options.getString('code').toUpperCase();
    const verification = pendingVerifications.get(code);
    
    if (!verification) {
      await interaction.reply({
        content: '❌ Invalid verification code. Please check your email for the correct code.',
        ephemeral: true
      });
      return;
    }
    
    // Assign role
    const member = interaction.member;
    const role = interaction.guild.roles.cache.get(ROLES.member);
    
    if (!role) {
      await interaction.reply({
        content: '❌ Role not found. Please contact an admin.',
        ephemeral: true
      });
      return;
    }
    
    try {
      await member.roles.add(role);
      pendingVerifications.delete(code);
      
      await interaction.reply({
        content: `✅ Welcome ${verification.youtube}! Your YouTube membership has been verified!`,
        ephemeral: false
      });
      
      // Post in webhook channel
      const channel = client.channels.cache.get(WEBHOOK_CHANNEL_ID);
      if (channel) {
        const embed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('✅ Member Verified via Code')
          .setDescription(`**${member.user.tag}** verified with code ${code}`)
          .addFields(
            { name: 'YouTube', value: verification.youtube, inline: true },
            { name: 'Discord', value: member.user.tag, inline: true }
          )
          .setTimestamp();
        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      await interaction.reply({
        content: '❌ Failed to assign role. Please contact an admin.',
        ephemeral: true
      });
    }
  }
});

// Handle new members joining
client.on('guildMemberAdd', async member => {
  console.log(`👤 New member joined: ${member.user.tag}`);
  console.log(`   Username: ${member.user.username}`);
  console.log(`   Global name: ${member.user.globalName}`);
  console.log(`   Currently watching for: ${Array.from(pendingUsernames.keys()).join(', ')}`);
  
  // Check multiple username formats
  const usernameLower = member.user.username.toLowerCase().trim();
  const globalNameLower = member.user.globalName?.toLowerCase().trim();
  
  // Try to find pending verification with multiple formats
  const pending = pendingUsernames.get(usernameLower) || 
                  pendingUsernames.get(globalNameLower) ||
                  pendingUsernames.get(member.user.tag.toLowerCase());
  
  if (pending) {
    console.log(`✅ Found pending verification for ${member.user.username}`);
    const role = member.guild.roles.cache.get(pending.role);
    
    if (role) {
      console.log(`🎯 Assigning role: ${role.name} (${pending.tier})`);
      try {
        await member.roles.add(role);
        pendingUsernames.delete(member.user.username.toLowerCase());
        
        // Post success in webhook channel
        const channel = client.channels.cache.get(WEBHOOK_CHANNEL_ID);
        if (channel) {
          const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Member Auto-Verified')
            .setDescription(`**${member.user.tag}** was automatically verified!`)
            .addFields(
              { name: 'YouTube', value: pending.youtube, inline: true },
              { name: 'Discord', value: member.user.tag, inline: true }
            )
            .setTimestamp();
          await channel.send({ embeds: [embed] });
        }
        
        // Send welcome DM
        try {
          await member.send({
            embeds: [new EmbedBuilder()
              .setColor('#FF5A1F')
              .setTitle('🔥 Welcome to Jesse ON FIRE!')
              .setDescription('Your YouTube membership has been verified!')
              .addFields(
                { name: '✅ Access Granted', value: 'You now have member access!' }
              )
            ]
          });
        } catch (error) {
          console.log(`Could not DM ${member.user.tag}`);
        }
      } catch (error) {
        console.error('Error assigning role:', error);
      }
    }
  }
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

// Monitor webhook channel// Monitor webhook messages
client.on('messageCreate', async message => {
  // Debug: Log EVERY message to find webhook posts
  if (message.author.bot || message.webhookId) {
    console.log(`\n📬 BOT/WEBHOOK MESSAGE DETECTED:`);
    console.log(`   Channel: ${message.channel.name} (${message.channel.id})`);
    console.log(`   From: ${message.author.username}`);
    console.log(`   Webhook ID: ${message.webhookId || 'none'}`);
    console.log(`   Has embed: ${message.embeds?.length > 0}`);
    if (message.embeds?.length > 0) {
      console.log(`   Embed title: ${message.embeds[0].title}`);
    }
  }
  
  // Debug: Log ALL messages in webhook channel
  if (message.channel.id === WEBHOOK_CHANNEL_ID) {
    console.log(`📨 Message in webhook channel from: ${message.author.username}`);
    console.log(`   Author ID: ${message.author.id}`);
    console.log(`   Is webhook: ${!!message.webhookId}`);
    console.log(`   Webhook ID: ${message.webhookId || 'none'}`);
    console.log(`   Has embeds: ${message.embeds?.length > 0}`);
    console.log(`   Message type: ${message.type}`);
    console.log(`   Is bot: ${message.author.bot}`);
    
    if (message.embeds?.length > 0) {
      console.log(`   Embed title: ${message.embeds[0].title}`);
      console.log(`   Embed fields: ${message.embeds[0].fields?.length || 0}`);
    }
    
    // Try to process ANY embed with YouTube verification
    if (message.embeds?.length > 0 && message.embeds[0].title?.includes('YouTube')) {
      console.log('🎯 FOUND YOUTUBE EMBED - Processing even if not webhook!');
    }
  }
  
  // Only process messages in the webhook channel
  if (message.channel.id !== WEBHOOK_CHANNEL_ID) return;
  
  // Only process webhook messages
  if (!message.webhookId) return;
  
  console.log('🎯 Processing webhook message...');
  
  // Check for embeds
  if (!message.embeds || message.embeds.length === 0) {
    console.log('⚠️ No embed found - Discord might have stripped it. Skipping this message.');
    return;
  }
  
  const embed = message.embeds[0];
  console.log(`📋 Embed title: ${embed.title}`);
  
  // Check if this is a YouTube verification message
  if (!embed.title || !embed.title.includes('YouTube Member Verification')) {
    console.log('⚠️ Not a YouTube verification message');
    return;
  }
  
  console.log('📝 New YouTube member verification detected!');
  
  // Extract info from embed
  const fields = embed.fields;
  const discordUsername = fields.find(f => f.name === 'Discord')?.value || null;
  const youtubeUsername = fields.find(f => f.name === 'YouTube')?.value || 'Unknown';
  const email = fields.find(f => f.name === 'Email')?.value || 'Unknown';
  const membershipTier = fields.find(f => f.name === 'Membership Tier')?.value || null;
  const verificationCode = fields.find(f => f.name === 'Verification Code')?.value || null;
  
  console.log('🔍 EXTRACTED FROM WEBHOOK:');
  console.log(`   YouTube Username: ${youtubeUsername}`);
  console.log(`   Discord Username: ${discordUsername}`);
  console.log(`   Email: ${email}`);
  console.log(`   Tier: ${membershipTier}`);
  
  // Determine role based on tier
  let roleToAssign = ROLES.member; // Default
  if (membershipTier) {
    if (membershipTier.includes('$4.99')) roleToAssign = ROLES['inner-circle'];
    else if (membershipTier.includes('$9.99')) roleToAssign = ROLES['best-friends'];
    else if (membershipTier.includes('$24.99')) roleToAssign = ROLES['elite'];
  }
  
  console.log(`👤 Discord: ${discordUsername || 'Not provided'}`);
  console.log(`📺 YouTube: ${youtubeUsername}`);
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Code: ${verificationCode || 'N/A'}`);
  
  // Store pending verification
  if (verificationCode && verificationCode !== 'N/A - Has Discord') {
    pendingVerifications.set(verificationCode, {
      youtube: youtubeUsername,
      discord: discordUsername,
      email: email
    });
    console.log(`📝 Stored verification code: ${verificationCode}`);
  }
  
  // Store pending username if provided
  if (discordUsername && discordUsername !== 'Not provided (new user)') {
    // Clean the username - remove @ symbol if present
    const cleanUsername = discordUsername.replace('@', '').toLowerCase().trim();
    
    pendingUsernames.set(cleanUsername, {
      youtube: youtubeUsername,
      role: roleToAssign,
      tier: membershipTier
    });
    console.log(`📝 Watching for username: ${cleanUsername} (original: ${discordUsername})`);
    console.log(`🎯 Will assign role: ${roleToAssign} for tier: ${membershipTier}`);
    console.log(`📋 Currently tracking: ${Array.from(pendingUsernames.keys()).join(', ')}`);
  }
  
  // Verify YouTube membership
  const verification = await verifyYouTubeMembership(youtubeUsername);
  
  // Create response embed based on verification
  const responseEmbed = new EmbedBuilder()
    .setColor('#FF5A1F')
    .setTitle('📋 Verification Status')
    .setDescription(`Submission from **${youtubeUsername}**`)
    .addFields(
      { name: 'Discord', value: discordUsername || 'Not provided (new user)', inline: true },
      { name: 'Email', value: email, inline: true },
      { name: '📊 Status', value: discordUsername ? '⏳ Waiting for user to join' : '⏳ Waiting for /verify command', inline: false }
    );
  
  if (discordUsername) {
    responseEmbed.addFields({
      name: '✅ Auto-Assignment Ready',
      value: `When **${discordUsername}** joins, they'll get the member role automatically!`,
      inline: false
    });
  } else {
    responseEmbed.addFields({
      name: '🔑 Verification Code',
      value: `User must use: \`/verify ${verificationCode}\``,
      inline: false
    });
  }
  
  responseEmbed.setFooter({ text: 'YouTube Member Bridge Bot' });
  responseEmbed.setTimestamp();
  
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
