import express from 'express';
import { body } from 'express-validator';

import * as adminController from '../controllers/admin';
import isAuth from '../middleware/is-auth';

const router = express.Router();

router.get('/projects', isAuth, adminController.getProjects);
router.get('/add-project', isAuth, adminController.getAddProject);
router.post(
	'/add-project',
	[
		body('title', 'Please enter a title between 3-80 characters').isString().isLength({ min: 3, max: 80 }).trim(),
		body('description', 'Please enter details between 40-2000 characters.').isLength({ min: 40, max: 2000 }).trim(),
	],
	isAuth,
	adminController.postAddProject
);
router.get('/edit-project/:projectId', isAuth, adminController.getEditProject);
router.post(
	'/edit-project',
	[
		body('title', 'Please enter a title between 3-80 characters').isString().isLength({ min: 3, max: 80 }).trim(),
		body('description', 'Please enter details between 40-2000 characters.').isLength({ min: 40, max: 2000 }).trim(),
	],
	isAuth,
	adminController.postEditProject
);
router.delete('/project/:projectId', isAuth, adminController.deleteProject);

export default router;
