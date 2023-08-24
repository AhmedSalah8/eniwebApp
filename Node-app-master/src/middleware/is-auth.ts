import { NextFunction, Request, Response } from 'express';

export default function (req: Request, res: Response, next: NextFunction): void | Response {
	if (!req.session.isLoggedIn) {
		return res.redirect('/404');
	}
	next();
}
