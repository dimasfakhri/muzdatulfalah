const GoogleSheetsService = require('../services/GoogleSheetsService');
const artikelService = new GoogleSheetsService('Artikel');

exports.getAll = async (req, res, next) => {
  try {
    const data = await artikelService.getAll();
    res.json(data);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await artikelService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Artikel tidak ditemukan' });
    res.json(data);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const newData = await artikelService.create(req.body);
    res.status(201).json(newData);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await artikelService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const result = await artikelService.delete(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
};