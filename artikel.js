const router = require('express').Router();
const ctrl = require('../controllers/artikelController');
const validate = require('../middleware/validate');
const Joi = require('joi');
const auth = require('../middleware/authMiddleware');
const cacheMiddleware = require('../middleware/cacheMiddleware');

const schema = Joi.object({
  judul: Joi.string().required(),
  isi: Joi.string().required(),
  penulis: Joi.string().required(),
});

router.get('/', cacheMiddleware(120), ctrl.getAll);
router.get('/:id', cacheMiddleware(120), ctrl.getById);
router.post('/', auth, validate(schema), ctrl.create);
router.put('/:id', auth, validate(schema), ctrl.update);
router.delete('/:id', auth, ctrl.delete);

module.exports = router;