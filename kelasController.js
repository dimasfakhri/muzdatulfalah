const GoogleSheetsService = require('../services/GoogleSheetsService');
const kelasService = new GoogleSheetsService('Kelas');

exports.getAll = async (req, res, next) => {
  try {
    const data = await kelasService.getAll();
    res.json(data);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await kelasService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    res.json(data);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const newData = await kelasService.create(req.body);
    res.status(201).json(newData);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await kelasService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const result = await kelasService.delete(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
};