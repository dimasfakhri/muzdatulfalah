const GoogleSheetsService = require('../services/GoogleSheetsService');
const siswaService = new GoogleSheetsService('Siswa');

exports.getAll = async (req, res, next) => {
  try {
    const data = await siswaService.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await siswaService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const newData = await siswaService.create(req.body);
    res.status(201).json(newData);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await siswaService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const result = await siswaService.delete(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};