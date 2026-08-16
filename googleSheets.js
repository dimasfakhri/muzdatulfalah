const { google } = require('googleapis');
const path = require('path');

// Inisialisasi auth
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Fungsi untuk append data ke spreadsheet
async function appendToSheet(spreadsheetId, range, values) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [values]
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error append to sheet:', error.message);
    return { success: false, error: error.message };
  }
}

// Fungsi untuk membaca data dari spreadsheet (opsional)
async function getSheetData(spreadsheetId, range) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range
    });
    return { success: true, data: response.data.values };
  } catch (error) {
    console.error('❌ Error reading sheet:', error.message);
    return { success: false, error: error.message };
  }
}

// Ekspor semuanya
module.exports = { 
  sheets, 
  appendToSheet, 
  getSheetData 
};