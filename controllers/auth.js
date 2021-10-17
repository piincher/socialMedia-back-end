import User from '../models/user';
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
		console.log('register user', user);
		return res.json({
			ok: true
		});
	} catch (error) {
		console.log('register failed ', error);
		res.status(400).send('error try again');
	}
};
export { register };
