import express from 'express';
import { body, check } from 'express-validator';

import * as authController from '../controllers/auth';
import isAuth from '../middleware/is-auth';
import authed from '../middleware/authed';
import { User } from '../models/user';

const router = express.Router();

router.get('/login', authed, authController.getLogin);
router.post(
	'/login',
	[
		body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
		body('password', 'Password has to be valid and 6-16 characters.')
			.isLength({ min: 6, max: 16 })
			.isAlphanumeric()
			.trim(),
	],
	authController.postLogin
);

router.post('/logout', isAuth, authController.postLogout);

router.get('/signup', isAuth, authController.getSignup);
router.post(
	'/signup',
	[
		check('email')
			.isEmail()
			.withMessage('Please enter a valid email.')
			.custom((value: string) => {
				return User.findOne({ email: value }).then(userDoc => {
					if (userDoc) {
						return Promise.reject('E-mail exists already.');
					}
				});
			})
			.normalizeEmail(),
		body('password', 'Please Enter a password with only alphanumeric and 6-16 characters.')
			.isLength({ min: 6, max: 16 })
			.isAlphanumeric()
			.trim(),
		body('confirmPassword')
			.custom((value: string, { req }) => {
				if (value !== req.body.password) {
					throw new Error('Password have to match!');
				}
				return true;
			})
			.trim(),
	],
	isAuth,
	authController.postSignup
);

router.get('/reset', isAuth, authController.getReset);
router.post(
	'/reset',
	check('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
	isAuth,
	authController.postReset
);

router.get('/reset/:token', isAuth, authController.getNewPassword);
router.post('/new-password', isAuth, authController.postNewPassword);

export default router;
