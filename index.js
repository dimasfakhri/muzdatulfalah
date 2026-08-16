const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/siswa', require('./siswa'));
router.use('/guru', require('./guru'));
router.use('/artikel', require('./artikel'));
router.use('/kelas', require('./kelas'));
router.use('/donasi', require('./donasi'));

module.exports = router;