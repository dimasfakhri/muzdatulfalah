const sheets = require('../config/googleSheets');
const { v4: uuidv4 } = require('uuid');

const SPREADSHEET_ID = process.env.SPREADSHEET_ID; // ID spreadsheet yang digunakan

class GoogleSheetsService {
  constructor(sheetName, idColumnIndex = 0) {
    this.sheetName = sheetName;
    this.idCol = idColumnIndex;
  }

  async getAll() {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${this.sheetName}`,
    });
    const rows = res.data.values || [];
    if (rows.length === 0) return [];
    // Anggap baris pertama adalah header
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i] || '');
      return obj;
    });
    return data;
  }

  async getById(id) {
    const all = await this.getAll();
    return all.find(item => item[Object.keys(item)[this.idCol]] === id) || null;
  }

  async create(data) {
    // Generate ID jika belum ada
    const all = await this.getAll();
    const headers = Object.keys(all[0] || data);
    const idField = headers[this.idCol];
    if (!data[idField]) {
      data[idField] = uuidv4();
    }
    const newRow = headers.map(h => data[h] || '');
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${this.sheetName}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [newRow] },
    });
    return data;
  }

  async update(id, newData) {
    const all = await this.getAll();
    const headers = Object.keys(all[0] || newData);
    const idField = headers[this.idCol];
    const rowIndex = all.findIndex(item => item[idField] === id);
    if (rowIndex === -1) throw new Error('Data tidak ditemukan');
    const updatedRow = headers.map(h => (newData[h] !== undefined ? newData[h] : all[rowIndex][h]));
    const range = `${this.sheetName}!A${rowIndex + 2}`; // +2 karena header di baris 1
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [updatedRow] },
    });
    return { ...all[rowIndex], ...newData };
  }

  async delete(id) {
    const all = await this.getAll();
    const headers = Object.keys(all[0] || {});
    const idField = headers[this.idCol];
    const rowIndex = all.findIndex(item => item[idField] === id);
    if (rowIndex === -1) throw new Error('Data tidak ditemukan');
    // Google Sheets tidak mendukung delete row langsung via API, kita kosongkan saja
    // Alternatif: hapus row dengan batchUpdate, namun sederhanakan dengan menghapus konten
    const range = `${this.sheetName}!A${rowIndex + 2}:ZZ${rowIndex + 2}`;
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });
    return { message: 'Data berhasil dihapus' };
  }
}

module.exports = GoogleSheetsService;