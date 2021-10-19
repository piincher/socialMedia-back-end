import express from 'express';
import { register, login, currentUser } from '../controllers/auth';
import { requireSignin } from '../middlewares/auth';
const router = express.Router();

//controllers

router.post('/register', register);
router.post('/login', login);
router.get('/current-user', requireSignin, currentUser);

module.exports = router;
