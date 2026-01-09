/**
 * Google Apps Script for Baby Bloom Contact Form
 * 
 * INSTRUCTIONS:
 * 1. Go to https://sheets.google.com and create a new Sheet.
 * 2. Name the tabs/sheets: 'Submissions'.
 * 3. In 'Submissions', add headers in Row 1: Timestamp, Name, Email, Phone, Trimester, Message.
 * 4. Go to Extensions > Apps Script.
 * 5. Delete any existing code and paste this entire code.
 * 6. Update the RECIPIENT_EMAIL constant below.
 * 7. Click 'Deploy' > 'New deployment'.
 * 8. Select type: 'Web app'.
 * 9. Description: 'Contact Form v1'.
 * 10. Execute as: 'Me'.
 * 11. Who has access: 'Anyone' (IMPORTANT!).
 * 12. Click 'Deploy'.
 * 13. Copy the 'Web App URL' (ends in /exec).
 * 14. Paste this URL into your website's script.js file (replace the old one).
 * 
 * IMPORTANT: If you change this code later, you MUST create a NEW deployment:
 * A. Click 'Deploy' > 'Manage deployments'.
 * B. Click on the 'pencil' icon (Edit).
 * C. Version: Select 'New version'.
 * D. Click 'Deploy' again. The URL might stay the same, but this pushes your changes to live.
 */

const RECIPIENT_EMAIL = "vatsalpandya2007@gmail.com";

function doGet(e) {
    try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Events');
        if (!sheet) {
            return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": "Events sheet not found" }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        const data = sheet.getDataRange().getValues();
        if (data.length === 0) {
            return ContentService.createTextOutput(JSON.stringify({ "result": "success", "events": [] }))
                .setMimeType(ContentService.MimeType.JSON);
        }
        const headers = data[0];
        const rows = data.slice(1);

        const events = rows.map(row => {
            let event = {};
            headers.forEach((header, index) => {
                event[header.toLowerCase()] = row[index];
            });
            return event;
        });

        // Filter out empty rows (where title is missing)
        const validEvents = events.filter(event => event.title && event.title !== "");

        return ContentService.createTextOutput(JSON.stringify({ "result": "success", "events": validEvents }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (e) {
        return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": e.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function doPost(e) {
    try {
        const lock = LockService.getScriptLock();
        lock.tryLock(10000);

        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Submissions');
        // Optional: Check headers if needed, but for now we just append
        // const headers = ... (removed to prevent crash if sheet is empty)
        const nextRow = sheet.getLastRow() + 1;

        const data = JSON.parse(e.postData.contents);
        const newRow = [];

        // Map data to headers
        const timestamp = new Date();

        // Add data in specific order
        newRow.push(timestamp); // Column A
        newRow.push(data.name);
        newRow.push(data.email);
        newRow.push(data.phone);
        newRow.push(data.trimester);
        newRow.push(data.message);

        sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

        // Send Email Notification
        sendEmailNotification(data);

        return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (e) {
        return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": e.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        LockService.getScriptLock().releaseLock();
    }
}

function sendEmailNotification(data) {
    const subject = `New Inquiry from ${data.name} - Baby Bloom`;
    const body = `
    You have received a new consultation request!
    
    Name: ${data.name}
    Email: ${data.email}
    Phone: ${data.phone}
    Trimester: ${data.trimester}
    
    Message:
    ${data.message}
    
    -----------------------------------
    This email was sent automatically from your website.
  `;

    MailApp.sendEmail({
        to: RECIPIENT_EMAIL,
        subject: subject,
        body: body
    });
}
