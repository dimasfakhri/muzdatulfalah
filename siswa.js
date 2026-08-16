const router = require('express').Router();
const ctrl = require('../controllers/siswaController');
const validate = require('../middleware/validate');
const Joi = require('joi');
const auth = require('../middleware/authMiddleware');
const cacheMiddleware = require('../middleware/cacheMiddleware');

const schema = Joi.object({
  nama: Joi.string().required().messages({'any.required': 'Nama wajib diisi'}),
  email: Joi.string().email().required(),
  tanggal_lahir: Joi.date().optional(),
});

router.get('/', cacheMiddleware(60), ctrl.getAll);
router.get('/:id', cacheMiddleware(60), ctrl.getById);
router.post('/', auth, validate(schema), ctrl.create);
router.put('/:id', auth, validate(schema), ctrl.update);
router.delete('/:id', auth, ctrl.delete);

module.exports = router;