import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import sendMail from '../util/sendmail';
import { User } from '../models/user';
import { Request, Response } from 'express';
import crypto from 'crypto';

export const getLogin = (req: Request, res: Response): void => {
	type errorMessage = string | string[] | null;
	let message: errorMessage = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/login', {
		path: '/login',
		title: 'Login',
		errorMessage: message,
		oldInputs: {
			email: '',
			password: '',
		},
		validationErrors: [],
	});
};

export const postLogin = async (req: Request, res: Response): Promise<void | Response> => {
	try {
		const { email, password }: { email: string; password: string } = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			try {
				return res.status(422).render('auth/login', {
					path: '/login',
					title: 'Login',
					errorMessage: errors.array()[0].msg,
					oldInputs: {
						email: email,
					},
					validationErrors: errors.array(),
				});
			} catch (err) {
				res.status(500).redirect('/500');
			}
		}
		const user = await User.findOne({ email: email });
		if (!user) {
			try {
				return res.status(422).render('auth/login', {
					path: '/login',
					title: 'Login',
					errorMessage: 'Invalid email or password.',
					oldInputs: {
						email: email,
					},
					validationErrors: [],
				});
			} catch (err) {
				res.status(500).redirect('/500');
			}
		} else {
			const validated = await bcrypt.compare(password + process.env.PEPPER, user.password);
			if (!validated) {
				req.session.isLoggedIn = true;
				req.session.user = user;
				req.session.save();
				res.redirect('/');
			} else {
				try {
					return res.status(422).render('auth/login', {
						path: '/login',
						title: 'Login',
						errorMessage: 'Invalid email or password.',
						oldInputs: {
							email: email,
						},
						validationErrors: [],
					});
				} catch (err) {
					res.status(500).redirect('/500');
				}
			}
		}
	} catch (err) {
		res.status(500).redirect('/500');
	}
};

export const postLogout = async (req: Request, res: Response): Promise<void> => {
	try {
		req.session.destroy(() => {
			res.redirect('/');
		});
	} catch (err) {
		res.status(500).redirect('/500');
	}
};

export const getSignup = (req: Request, res: Response): void => {
	type errorMessage = string | string[] | null;
	let message: errorMessage = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/signup', {
		title: 'Sign up',
		path: '/signup',
		errorMessage: message,
		oldInputs: {
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationErrors: [],
	});
};

export const postSignup = async (req: Request, res: Response): Promise<void | Response> => {
	try {
		const { email, password }: { email: string; password: string } = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			try {
				return res.status(422).render('auth/signup', {
					title: 'Sign up',
					path: '/signup',
					errorMessage: errors.array()[0].msg,
					oldInputs: {
						email: email,
						password: password,
						confirmPassword: req.body.confirmPassword,
					},
					validationErrors: errors.array(),
				});
			} catch (err) {
				res.status(500).redirect('/500');
			}
		}
		const hashedPassword = await bcrypt.hash(password + process.env.PEPPER, Number(process.env.SALT_ROUNDS));
		const user = new User({
			email,
			password: hashedPassword,
		});
		await user.save();
		res.redirect('/login');
	} catch (err) {
		res.status(500).redirect('/500');
	}
};

export const getReset = (req: Request, res: Response): void => {
	type errorMessage = string | string[] | null;
	let message: errorMessage = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/reset', {
		title: 'Reset Password',
		path: '/reset',
		errorMessage: message,
	});
};

export const postReset = async (req: Request, res: Response): Promise<void | Response> => {
	try {
		crypto.randomBytes(32, async (err, buffer) => {
			if (err) {
				console.log(err);
				return res.redirect('/reset');
			}
			const email: string = req.body.email;
			const token = buffer.toString('hex');
			const user = await User.findOne({ email });
			if (!user) {
				req.flash('error', 'No account with that email found.');
				return res.redirect('/reset');
			}
			user.resetToken = token;
			user.resetTokenExpiration = Date.now() + 3600000;
			await user.save();
			res.redirect('/');
			const to = email;
			const from = 'ogswebproject@gmail.com';
			const subject = 'Password reset';
			const output = `
        <p>You requested a password reset</p>
        <p>Click this <a href="https://eniweb.herokuapp.com/${token}">link</a> to set a new password.</p>
        `;
			sendMail(to, from, subject, output);
		});
	} catch (err) {
		res.status(500).redirect('/500');
	}
};

export const getNewPassword = async (req: Request, res: Response): Promise<void> => {
	try {
		const token = req.params.token;
		const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
		type errorMessage = string | string[] | null;
		let message: errorMessage = req.flash('error');
		if (message.length > 0) {
			message = message[0];
		} else {
			message = null;
		}
		res.render('auth/new-password', {
			title: 'Update Password',
			path: '/new-password',
			errorMessage: message,
			userId: user?._id.toString(),
			passwordToken: token,
		});
	} catch (err) {
		res.status(500).redirect('/500');
	}
};

export const postNewPassword = async (req: Request, res: Response): Promise<void> => {
	try {
		const { password, userId, passwordToken }: { password: string; userId: string; passwordToken: string } = req.body;
		const resetUser = await User.findOne({
			resetToken: passwordToken,
			resetTokenExpiration: { $gt: Date.now() },
			_id: userId,
		});
		if (resetUser) {
			const hashedPassword = await bcrypt.hash(password + process.env.PEPPER, Number(process.env.SALT_ROUNDS));
			resetUser.password = hashedPassword;
			resetUser.resetToken = undefined;
			resetUser.resetTokenExpiration = undefined;
			await resetUser.save();
			res.redirect('/');
		}
	} catch (err) {
		res.status(500).redirect('/500');
	}
};
