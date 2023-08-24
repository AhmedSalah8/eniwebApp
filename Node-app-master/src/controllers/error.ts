import { Request, Response } from 'express';

export const get404 = (req: Request, res: Response): void => {
	res.status(404).render('404', {
		title: 'Page Not Found',
		path: '/404',
		isAuthenticated: req.session.isLoggedIn,
	});
};
export const get500 = (req: Request, res: Response): void => {
	res.status(500).render('500', {
		title: 'Error!',
		path: '/500',
		isAuthenticated: req.session.isLoggedIn,
	});
};
