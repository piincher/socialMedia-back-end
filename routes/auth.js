import express from 'express';
import { register, login, currentUser, forgotPassword, profileUpdate, findPeople } from '../controllers/auth';
import { requireSignin } from '../middlewares/auth';
const router = express.Router();

//controllers

router.post('/register', register);
router.post('/login', login);
router.get('/current-user', requireSignin, currentUser);
router.post('/forgot-password', forgotPassword);
router.put('/profile-update', requireSignin, profileUpdate);
router.get('/find-people', requireSignin, findPeople);
module.exports = router;
