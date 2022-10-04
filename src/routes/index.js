const { formulario, postUser } = require('../controllers/formController')
const { Router } = require('express');

const router = Router();

router.get('/', formulario);
router.post('/', postUser);

module.exports = router;

