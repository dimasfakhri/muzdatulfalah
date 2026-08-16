const GoogleSheetsService = require('../services/GoogleSheetsService');
const guruService = new GoogleSheetsService('Guru');

exports.getAll = async (req, res, next) => {
  try {
    const data = await guruService.getAll();
    res.json(data);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await guruService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Guru tidak ditemukan' });
    res.json(data);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const newData = await guruService.create(req.body);
    res.status(201).json(newData);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await guruService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const result = await guruService.delete(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
};