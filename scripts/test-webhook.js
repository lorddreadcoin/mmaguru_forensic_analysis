// Test Discord webhook connection
const WEBHOOK_URL = "https://discord.com/api/webhooks/1433975129016111124/IvXYomsREwT_1Ck8v7R5F0U6x6LsQrLVeht0iGTntuhJifMFrlHVmaUTWwtdV52qD0CP";

async function testWebhook() {
  console.log("🧪 Testing Discord webhook...\n");
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: "🔥 **WEBHOOK TEST** - Jesse ON FIRE YouTube Bridge is online!",
        embeds: [{
          title: "✅ Webhook Connection Test",
          description: "If you see this message, your webhook is working correctly!",
          color: 0xFF5A1F, // Fire orange
          fields: [
            { 
              name: "Status", 
              value: "✅ Connected", 
              inline: true 
            },
            { 
              name: "Channel", 
              value: "YouTube Verifications", 
              inline: true 
            }
          ],
          footer: {
            text: "YouTube → Discord Bridge"
          },
          timestamp: new Date().toISOString()
        }]
      })
    });
    
    if (response.ok) {
      console.log("✅ SUCCESS! Webhook message sent!");
      console.log("📱 Check your Discord server for the test message");
      console.log("\n💡 If you see the message, the webhook is working!");
      console.log("🔥 Ready to receive YouTube member notifications!\n");
    } else {
      const error = await response.text();
      console.log("❌ FAILED! Response:", response.status);
      console.log("Error:", error);
      console.log("\n🔧 Possible issues:");
      console.log("   1. Webhook was deleted");
      console.log("   2. Webhook URL is incorrect");
      console.log("   3. Channel was deleted\n");
    }
  } catch (error) {
    console.log("❌ ERROR:", error.message);
    console.log("\n🔧 Check your internet connection\n");
  }
}

testWebhook();
