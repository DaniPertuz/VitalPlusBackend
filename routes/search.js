const { Router } = require('express');
const { search } = require('../controllers/search');

const router = Router();

router.get('/:collection/:range/:id', search);

module.exports = router;