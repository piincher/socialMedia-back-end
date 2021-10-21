import User from '../models/user';
import jwt from 'jsonwebtoken';
import expertJwt from 'express-jwt';
import { hashPassword, comparePassword } from '../helpers/auth';
const register = async (req, res) => {
	//console.log('register end', req.body);
	const { name, email, password, secret } = req.body;
	//validation
	if (!name) return res.status(400).send('name is required');
	if (!password || password.length < 6)
		return res.status(400).send('Password is required and should be 6 character long');
	if (!secret) return res.status(400).send('answer  is required');
	const exist = await User.findOne({ email });
	if (exist) return res.status(400).send('email is taken');
	const hashedPassword = await hashPassword(password);
	const user = new User({ name, email, password: hashedPassword, secret });
	try {
		await user.save();
		//console.log('register user', user);
		return res.json({
			ok: true
		});
	} catch (error) {
		console.log('register failed ', error);
		res.status(400).send('error try again');
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(400).send('email and password incorrect');
		const match = await comparePassword(password, user.password);
		if (!match) return res.status(400).send('email and password wrong');

		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
		user.password = undefined;
		user.secret = undefined;
		res.status(200).json({
			token,
			user
		});
	} catch (error) {
		console.log(error);
		res.status(400).send('try again ');
	}
};

const currentUser = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		res.json({ ok: true });
	} catch (error) {
		console.log(error);
		res.status(400).send('error not authorize');
	}
};

const forgotPassword = async (req, res) => {
	try {
		const { email, password, secret } = req.body;
		if (!email || !password < 7) {
			return res.status(400).send('the new password should be greater than 6 password');
		}
		if (!secret) res.json({ error: 'secret is required' });

		const user = await User.findOne({ email, secret });

		if (!user) res.json({ error: 'we cant verify the information ' });

		const hashed = await hashPassword(password);
		await User.findByIdAndUpdate(user._id, { password: hashed });
		res.json({
			success: 'congrats!! now you can login with your new password '
		});
	} catch (error) {
		res.status(400).send('something went wrong try again');
	}
};
export { register, login, currentUser, forgotPassword };
