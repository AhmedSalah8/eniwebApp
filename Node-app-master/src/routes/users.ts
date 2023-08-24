import express from 'express';
import { body, check } from 'express-validator';
import * as userController from '../controllers/user';

const router = express.Router();

router.get('/', userController.getHome);
router.get('/project/:projectId', userController.getProject);
router.get('/about-us', userController.getAboutUs);
router.get('/sust-dev', userController.getSustDev);
router.get('/contact', userController.getContact);
router.post(
	'/contact',
	[
		body('name').isString().withMessage('Please enter your name.'),
		check('email').isEmail().withMessage('Please enter a vaild email.'),
		check('description', 'Please enter a message.').notEmpty(),
	],
	userController.postContact
);
router.get('/sent', userController.getSent);
router.get('/resources', userController.getResources);

export default router;
