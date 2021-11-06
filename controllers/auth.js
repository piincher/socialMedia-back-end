import User from '../models/user';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../helpers/auth';
import {nanoid} from 'nanoid'
const register = async (req, res) => {
	//console.log('register end', req.body);
	const { name, email, password, secret } = req.body;
	//validation
	if (!name) {
		return res.json({
			error: 'name should be provide'
		});
	}
	if (!password || password.length < 6) {
		return res.json({ error: 'word is required and should be 6 character long' });
	}
	if (!secret) return res.json({ error: 'secret should be provide' });
	const exist = await User.findOne({ email });
	if (exist) {
		return res.json({ error: 'email is taken ' });
	}

	const hashedPassword = await hashPassword(password);
	const user = new User({ name, email, password: hashedPassword, secret ,username:nanoid(5)});
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
		if (!user) {
			return res.json({ error: 'email and password incorrect' });
		}
		const match = await comparePassword(password, user.password);
		if (!match) {
			return res.json({ error: 'email and password incorrect' });
		}

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
		if (!email || password < 7) {
			return res.json({ error: 'the new password should be greater than 7' });
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
const profileUpdate = async (req,res) => {
	try {
		//console.log('profile update',req.body)
		const data = {}
		if (req.body.username) {
			data.username = req.body.username
		}
		if (req.body.about) {
			data.about = req.body.about
		}
		if (req.body.name) {
			data.name = req.body.name
		}
		if (req.body.password && req.body.password < 7) {
			return res.json({error:'choose a long password'})
		}
		else {
			data.password = await hashPassword(req.body.password)
		}
		if (req.body.secret) {
			data.name = req.body.secret
		}
		let user = await User.findByIdAndUpdate(req.user._id, data, { new: true })
		user.password = undefined
		user.secret = undefined
		res.json(user)
	} catch (error) {
		if (error.code == 11000) {
			return res.json({error:'duplicate value'})
		}
		console.log(error)

	}
}
export { register, login, currentUser, forgotPassword,profileUpdate };
