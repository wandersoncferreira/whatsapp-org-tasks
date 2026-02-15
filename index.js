import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { appendFileSync, existsSync } from 'fs';
import express from 'express';
import { config } from './config.js';
import { processCommand } from './commands.js';

// Initialize WhatsApp client with persistent session
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './.wwebjs_auth'
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox']
  }
});

// Display QR code for initial authentication
client.on('qr', (qr) => {
  console.log('📱 Scan this QR code with WhatsApp:');
  qrcode.generate(qr, { small: true });
});

// Store client globally for HTTP server access
let whatsappClient = null;
let myPhoneNumber = null;

// Ready event
client.on('ready', () => {
  whatsappClient = client;
  myPhoneNumber = client.info.wid.user;

  console.log('✅ WhatsApp client is ready!');
  console.log(`📱 Detected phone number: ${myPhoneNumber}`);
  console.log(`📱 Configured phone number: ${config.myPhoneNumber}`);

  // Warn if numbers don't match
  if (myPhoneNumber !== config.myPhoneNumber) {
    console.warn('⚠️  WARNING: Detected phone number does not match configured number!');
    console.warn(`   Please update config.myPhoneNumber to: '${myPhoneNumber}'`);
  }

  console.log(`📝 Monitoring messages to: ${config.myPhoneNumber}`);
  console.log(`📁 Tasks will be saved to: ${config.orgFile}`);
  console.log(`🌐 HTTP server running on http://localhost:${config.httpPort}`);
});

// Authentication success
client.on('authenticated', () => {
  console.log('✅ Authenticated successfully');
});

// Handle messages
client.on('message_create', async (message) => {
  try {
    // Get contact info
    const contact = await message.getContact();
    const chat = await message.getChat();

    // Skip group messages
    if (chat.isGroup) {
      return;
    }

    // Only process messages sent TO YOURSELF
    // Check if the chat is with your own number
    const chatUser = chat.id.user || chat.id._serialized?.split('@')[0];
    const myNumber = config.myPhoneNumber;

    const isSelfChat = chatUser === myNumber;

    if (!isSelfChat) {
      console.log(`Skipping message - not a self-chat (chat: ${chatUser}, my number: ${myNumber})`);
      return;
    }

    // Also verify the message is from me (outgoing)
    if (!message.fromMe) {
      console.log('Skipping message - not from me');
      return;
    }

    const messageText = message.body.trim();

    // Skip empty messages or media-only messages
    if (!messageText) {
      return;
    }

    // Get user ID for caching
    const userId = myNumber;

    // Check if message is a command (CRUD acronyms)
    const lowerText = messageText.toLowerCase();
    if (lowerText.startsWith('th') ||
        lowerText.startsWith('help') ||
        lowerText.startsWith('tl') ||
        lowerText.startsWith('ts') ||
        lowerText.startsWith('tr ') ||
        lowerText.startsWith('tu ') ||
        lowerText.startsWith('tst ') ||
        lowerText.startsWith('tsd ') ||
        lowerText.startsWith('td ') ||
        lowerText.startsWith('cc ') ||
        lowerText.startsWith('cu ') ||
        lowerText.startsWith('cd ')) {
      const response = await processCommand(messageText, userId);
      if (response) {
        // Send reply back to self
        await chat.sendMessage(response);
        console.log(`✅ Processed command: ${messageText.substring(0, 50)}...`);
        return;
      }
    }

    // Check if message is a task creation command
    const taskMatch = messageText.match(/^tc:\s*(.+)$/i);
    if (taskMatch) {
      const taskText = taskMatch[1].trim();

      // Parse and create TODO entry
      const todoEntry = createTodoEntry(taskText);

      // Append to org file
      appendToOrgFile(todoEntry);

      console.log(`✅ Created TODO: ${taskText.substring(0, 50)}...`);

      // Send confirmation
      await chat.sendMessage(`✅ Task created: "${taskText}"`);
      return;
    }

    // Check trigger keywords if configured (for backward compatibility)
    if (config.triggerKeywords.length > 0) {
      const hasKeyword = config.triggerKeywords.some(keyword =>
        messageText.toLowerCase().includes(keyword.toLowerCase())
      );
      if (hasKeyword) {
        // Parse and create TODO entry
        const todoEntry = createTodoEntry(messageText);
        appendToOrgFile(todoEntry);
        console.log(`✅ Created TODO: ${messageText.substring(0, 50)}...`);
        await chat.sendMessage(`✅ Task created: "${messageText}"`);
      }
    }

  } catch (error) {
    console.error('❌ Error processing message:', error);
  }
});

// Error handling
client.on('auth_failure', () => {
  console.error('❌ Authentication failed. Please delete .wwebjs_auth folder and try again.');
});

client.on('disconnected', (reason) => {
  console.log('⚠️  Client disconnected:', reason);
});

/**
 * Parse WhatsApp message and create org-mode TODO entry
 */
function createTodoEntry(messageText) {
  let priority = '';
  let scheduled = '';
  let content = messageText;

  if (config.parseSpecialSyntax) {
    // Parse priority (lines starting with !)
    if (content.startsWith('!')) {
      priority = ' [#A]';
      content = content.substring(1).trim();
    }

    // Parse scheduled date (@YYYY-MM-DD)
    const dateMatch = content.match(/@(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      scheduled = `\nSCHEDULED: <${dateMatch[1]}>`;
      content = content.replace(dateMatch[0], '').trim();
    }
  }

  // Default scheduled date if configured
  if (!scheduled && config.defaultScheduledDays !== null) {
    const date = new Date();
    date.setDate(date.getDate() + config.defaultScheduledDays);
    const dateStr = date.toISOString().split('T')[0];
    scheduled = `\nSCHEDULED: <${dateStr}>`;
  }

  // Build org entry with configured heading level
  const stars = '*'.repeat(config.headingLevel || 1);
  let entry = `\n${stars} ${config.todoState}${priority} ${content}`;

  if (scheduled) {
    entry += scheduled;
  }

  if (config.includeTimestamp) {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    entry += `\n:PROPERTIES:\n:CREATED: [${timestamp}]\n:SOURCE: WhatsApp\n:END:`;
  }

  entry += '\n';

  return entry;
}

/**
 * Append TODO entry to org file
 */
function appendToOrgFile(entry) {
  try {
    // Check if file exists
    if (!existsSync(config.orgFile)) {
      console.error(`❌ Org file not found: ${config.orgFile}`);
      console.error('Please check the path in config.js');
      return;
    }

    appendFileSync(config.orgFile, entry, 'utf8');
  } catch (error) {
    console.error('❌ Error writing to org file:', error);
  }
}

// HTTP Server for Emacs integration
const app = express();
app.use(express.json());

/**
 * POST /send-message
 * Send a message from Emacs to WhatsApp (to self)
 */
app.post('/send-message', async (req, res) => {
  try {
    if (!whatsappClient) {
      return res.status(503).json({ error: 'WhatsApp client not ready' });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get self chat and send message using configured phone number
    const chatId = `${config.myPhoneNumber}@c.us`;
    const chat = await whatsappClient.getChatById(chatId);
    await chat.sendMessage(message);

    res.json({ success: true, message: 'Message sent' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /status
 * Check if WhatsApp client is ready
 */
app.get('/status', (req, res) => {
  res.json({
    ready: whatsappClient !== null,
    phoneNumber: config.myPhoneNumber
  });
});

app.listen(config.httpPort, () => {
  console.log(`🌐 HTTP server listening on http://localhost:${config.httpPort}`);
});

// Start the client
console.log('🚀 Starting WhatsApp-Org-Tasks...');
client.initialize();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down...');
  await client.destroy();
  process.exit(0);
});
