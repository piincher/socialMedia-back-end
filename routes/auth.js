import express from 'express';
import { register } from '../controllers/auth';
const router = express.Router();

//controllers

router.post('/register', register);

module.exports = router;
