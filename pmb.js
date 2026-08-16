const router = require('express').Router();
const Joi = require('joi');
const { appendToSheet } = require('../config/googleSheets');

// Konfigurasi Google Sheet
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || 'https://docs.google.com/spreadsheets/d/1cc64I5pwmp2vHRZnqakDcZlxukaYjDJQ356TtuGtH3w/edit?gid=105565086#gid=105565086';
const SHEET_RANGE = 'PMB'; // Ganti dengan nama sheet Anda

// Schema validasi untuk PMB
const pmbSchema = Joi.object({
  nama: Joi.string().required(),
  tanggal_lahir: Joi.date().required(),
  program: Joi.string().required(),
  orangtua: Joi.string().required(),
  kontak: Joi.string().required(),
  email: Joi.string().email().allow('', null),
  alamat: Joi.string().required(),
  catatan: Joi.string().allow('', null)
});

// GET endpoint - cek status
router.get('/', (req, res) => {
  res.json({ 
    message: 'Endpoint PMB aktif. Gunakan method POST untuk mengirim data pendaftaran.'
  });
});

// POST endpoint - terima data dan simpan ke Google Sheets
router.post('/', async (req, res) => {
  // Validasi data
  const { error, value } = pmbSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Format data untuk Google Sheets
    const rowData = [
      new Date().toISOString(), // Tanggal pendaftaran
      value.nama,
      value.tanggal_lahir,
      value.program,
      value.orangtua,
      value.kontak,
      value.email || '-',
      value.alamat,
      value.catatan || '-'
    ];

    // Kirim ke Google Sheets
    const result = await appendToSheet(SPREADSHEET_ID, SHEET_RANGE, rowData);
    
    if (!result.success) {
      console.error('Google Sheets error:', result.error);
      return res.status(500).json({ 
        message: 'Data diterima tapi gagal simpan ke Google Sheets. Kami akan hubungi Anda.',
        data: value
      });
    }

    console.log(`✅ Data pendaftaran dari ${value.nama} berhasil disimpan`);
    
    res.status(201).json({ 
      message: 'Pendaftaran berhasil dikirim! Data sudah tersimpan.',
      data: value
    });
    
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ 
      message: 'Terjadi kesalahan, silakan coba lagi.',
      data: value
    });
  }
});

module.exports = router;