/**
 * ConvertNow Social Media Calendar - Google Apps Script
 * 
 * This script runs inside Google Sheets to automate content management
 * and integrates with Make.com webhooks
 */

// Configuration
const CONFIG = {
  SHEET_NAME: 'Content Calendar',
  SETTINGS_SHEET: 'Settings',
  WEBHOOK_URL: 'https://hook.make.com/YOUR_WEBHOOK_ID', // Replace with your Make webhook
  OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY', // Store in Script Properties instead
  BUFFER_TOKEN: 'YOUR_BUFFER_TOKEN' // Store in Script Properties instead
};

/**
 * Creates custom menu in Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 ConvertNow Social')
    .addItem('Generate Weekly Content', 'generateWeeklyContent')
    .addItem('Generate Images for Pending', 'generatePendingImages')
    .addItem('Post Ready Items', 'postReadyItems')
    .addSeparator()
    .addItem('View Analytics', 'showAnalytics')
    .addItem('Export to Buffer', 'exportToBuffer')
    .addSeparator()
    .addSubMenu(ui.createMenu('Settings')
      .addItem('Configure API Keys', 'configureApiKeys')
      .addItem('Set Posting Schedule', 'setPostingSchedule'))
    .addToUi();
}

/**
 * Generates 15 posts for the week using OpenAI
 */
function generateWeeklyContent() {
  const ui = SpreadsheetApp.getUi();
  
  const response = ui.alert(
    'Generate Weekly Content',
    'This will create 15 new posts for the week using AI. Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) return;
  
  // Show progress
  const progress = ui.alert('Generating content... This may take 2-3 minutes.');
  
  try {
    // Call OpenAI API
    const posts = callOpenAIForContent();
    
    // Add to sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    const lastRow = sheet.getLastRow();
    
    posts.forEach((post, index) => {
      const row = lastRow + index + 1;
      const postDate = new Date();
      postDate.setDate(postDate.getDate() + post.date_offset);
      
      sheet.getRange(row, 1).setValue(post.id);                    // ID
      sheet.getRange(row, 2).setValue(postDate);                   // Date
      sheet.getRange(row, 3).setValue(post.platform);              // Platform
      sheet.getRange(row, 4).setValue(post.content_pillar);        // Content Pillar
      sheet.getRange(row, 5).setValue(post.hook);                  // Hook
      sheet.getRange(row, 6).setValue(post.caption);               // Caption
      sheet.getRange(row, 7).setValue(post.content_format);        // Content Format
      sheet.getRange(row, 8).setValue(post.image_prompt);          // Image Prompt
      sheet.getRange(row, 9).setValue('');                         // Image URL
      sheet.getRange(row, 10).setValue(post.cta_type);             // CTA Type
      sheet.getRange(row, 11).setValue(post.cta_url);              // CTA URL
      sheet.getRange(row, 12).setValue(post.optimal_time);         // Optimal Time
      sheet.getRange(row, 13).setValue('Draft');                   // Post Status
      sheet.getRange(row, 17).setValue(`Generated ${new Date().toISOString()}`); // Notes
    });
    
    // Apply conditional formatting
    applyStatusColors(sheet);
    
    ui.alert(`✅ Successfully generated ${posts.length} posts!`);
    
    // Trigger Make.com webhook for image generation
    triggerMakeWebhook('generate_images', { postIds: posts.map(p => p.id) });
    
  } catch (error) {
    ui.alert('❌ Error: ' + error.toString());
    console.error(error);
  }
}

/**
 * Calls OpenAI API to generate content
 */
function callOpenAIForContent() {
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  
  const prompt = `Generate 15 unique social media posts for ConvertNow.ca (a free online unit converter).

Return ONLY valid JSON in this format:
{
  "posts": [
    {
      "id": "CNW001",
      "date_offset": 0,
      "platform": "both",
      "content_pillar": "conversion_fact",
      "hook": "Stop guessing in the kitchen! 🍳",
      "caption": "Full caption with hashtags...",
      "content_format": "static_image",
      "image_prompt": "Detailed DALL-E prompt...",
      "cta_type": "website_visit",
      "cta_url": "https://www.convertnow.ca",
      "optimal_time": "09:00"
    }
  ]
}

Requirements:
- 15 posts total
- date_offset: 0-6 (Mon-Sun)
- platform: "facebook", "instagram", or "both"
- 5 posts must link to /shop
- Vary optimal_time: 09:00, 12:00, 15:00, 18:00
- Include 8-12 hashtags per post
- Mix of conversion facts, product highlights, tips, engagement`;

  const response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a social media expert for ConvertNow.ca.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8
    }),
    muteHttpExceptions: true
  });
  
  const data = JSON.parse(response.getContentText());
  const content = data.choices[0].message.content;
  
  // Parse the JSON response
  const parsed = JSON.parse(content);
  return parsed.posts;
}

/**
 * Generates images for posts with "Draft" status
 */
function generatePendingImages() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  const pendingRows = [];
  
  // Find posts needing images (Draft status, no Image URL)
  for (let i = 1; i < data.length; i++) {
    if (data[i][12] === 'Draft' && !data[i][8]) { // Status column, Image URL column
      pendingRows.push({
        row: i + 1,
        id: data[i][0],
        prompt: data[i][7] // Image Prompt
      });
    }
  }
  
  if (pendingRows.length === 0) {
    SpreadsheetApp.getUi().alert('No pending images to generate.');
    return;
  }
  
  // Trigger Make.com for image generation
  triggerMakeWebhook('generate_images_batch', { 
    posts: pendingRows,
    sheetId: SpreadsheetApp.getActiveSpreadsheet().getId()
  });
  
  SpreadsheetApp.getUi().alert(`🎨 Triggered image generation for ${pendingRows.length} posts`);
}

/**
 * Posts items with "Ready to Post" status
 */
function postReadyItems() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  const readyPosts = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][12] === 'Ready to Post') {
      readyPosts.push({
        row: i + 1,
        id: data[i][0],
        platform: data[i][2],
        caption: data[i][5],
        imageUrl: data[i][8],
        ctaUrl: data[i][10]
      });
    }
  }
  
  if (readyPosts.length === 0) {
    SpreadsheetApp.getUi().alert('No posts ready to publish.');
    return;
  }
  
  // Trigger Make.com for posting
  triggerMakeWebhook('post_to_buffer', { 
    posts: readyPosts,
    sheetId: SpreadsheetApp.getActiveSpreadsheet().getId()
  });
  
  SpreadsheetApp.getUi().alert(`📤 Scheduled ${readyPosts.length} posts for publishing`);
}

/**
 * Triggers Make.com webhook
 */
function triggerMakeWebhook(action, data) {
  try {
    UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        action: action,
        timestamp: new Date().toISOString(),
        data: data
      }),
      muteHttpExceptions: true
    });
  } catch (e) {
    console.error('Webhook error:', e);
  }
}

/**
 * Applies conditional formatting based on status
 */
function applyStatusColors(sheet) {
  const range = sheet.getRange('M2:M1000'); // Status column
  
  // Clear existing rules
  const rules = sheet.getConditionalFormatRules();
  
  // Add new rules
  const newRules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Error')
      .setBackground('#FFCDD2')
      .setRanges([range])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Posted')
      .setBackground('#C8E6C9')
      .setRanges([range])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Scheduled')
      .setBackground('#BBDEFB')
      .setRanges([range])
      .build()
  ];
  
  sheet.setConditionalFormatRules(newRules);
}

/**
 * Shows analytics dashboard
 */
function showAnalytics() {
  const html = HtmlService.createHtmlOutputFromFile('Analytics')
    .setWidth(800)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, '📊 Social Media Analytics');
}

/**
 * Configures API keys (secure storage)
 */
function configureApiKeys() {
  const ui = SpreadsheetApp.getUi();
  
  const openaiResponse = ui.prompt('OpenAI API Key', 'Enter your OpenAI API key:', ui.ButtonSet.OK_CANCEL);
  if (openaiResponse.getSelectedButton() === ui.Button.OK) {
    PropertiesService.getScriptProperties().setProperty('OPENAI_API_KEY', openaiResponse.getResponseText());
  }
  
  const bufferResponse = ui.prompt('Buffer Access Token', 'Enter your Buffer access token:', ui.ButtonSet.OK_CANCEL);
  if (bufferResponse.getSelectedButton() === ui.Button.OK) {
    PropertiesService.getScriptProperties().setProperty('BUFFER_TOKEN', bufferResponse.getResponseText());
  }
  
  ui.alert('✅ API keys configured securely');
}

/**
 * Sets posting schedule
 */
function setPostingSchedule() {
  // Implementation for customizing the 15-post weekly schedule
  const ui = SpreadsheetApp.getUi();
  ui.alert('Schedule configuration coming soon!');
}

/**
 * Exports content to Buffer CSV format
 */
function exportToBuffer() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  let csv = 'Date,Time,Platform,Content,Image URL\n';
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][12] === 'Ready to Post' || data[i][12] === 'Scheduled') {
      const date = Utilities.formatDate(data[i][1], Session.getScriptTimeZone(), 'yyyy-MM-dd');
      const time = data[i][11];
      const platform = data[i][2];
      const content = data[i][5].replace(/"/g, '""'); // Escape quotes
      const imageUrl = data[i][8];
      
      csv += `"${date}","${time}","${platform}","${content}","${imageUrl}"\n`;
    }
  }
  
  // Create downloadable file
  const blob = Utilities.newBlob(csv, 'text/csv', 'convertnow-buffer-export.csv');
  const file = DriveApp.createFile(blob);
  
  SpreadsheetApp.getUi().alert(`📁 Export created: ${file.getUrl()}`);
}

/**
 * Webhook endpoint for Make.com to update sheet
 * (Must be deployed as web app)
 */
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  if (data.action === 'update_image_url') {
    updateImageUrl(data.postId, data.imageUrl);
  } else if (data.action === 'update_post_status') {
    updatePostStatus(data.postId, data.status, data.bufferId);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function updateImageUrl(postId, imageUrl) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === postId) {
      sheet.getRange(i + 1, 9).setValue(imageUrl);  // Image URL column
      sheet.getRange(i + 1, 13).setValue('Ready to Post'); // Status
      break;
    }
  }
}

function updatePostStatus(postId, status, bufferId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === postId) {
      sheet.getRange(i + 1, 13).setValue(status);
      if (bufferId) sheet.getRange(i + 1, 14).setValue(bufferId);
      break;
    }
  }
}
