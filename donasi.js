const router = require('express').Router();
const ctrl = require('../controllers/donasiController');
const validate = require('../middleware/validate');
const Joi = require('joi');
const auth = require('../middleware/authMiddleware');
const cacheMiddleware = require('../middleware/cacheMiddleware');

const schema = Joi.object({
  nama_donatur: Joi.string().required(),
  jumlah: Joi.number().positive().required(),
  tanggal: Joi.date().required(),
});

// Donasi bisa diakses publik untuk read, tapi create tidak perlu auth? Untuk donasi, create boleh publik
router.get('/', cacheMiddleware(60), ctrl.getAll);
router.get('/:id', cacheMiddleware(60), ctrl.getById);
router.post('/', validate(schema), ctrl.create);
router.put('/:id', auth, validate(schema), ctrl.update);
router.delete('/:id', auth, ctrl.delete);

module.exports = router;