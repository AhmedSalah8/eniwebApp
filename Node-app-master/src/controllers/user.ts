import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import sendMail from '../util/sendmail';
import { Project } from '../models/project';

export const getHome = async (_req: Request, res: Response): Promise<void> => {
	try {
		const projects = await Project.find();
		res.render('user/home', {
			title: 'Home',
			path: '/',
			projs: projects,
		});
	} catch (err) {
		res.status(500).redirect('/500');
	}
};

export const getProject = async (req: Request, res: Response): Promise<void> => {
	try {
		const projId = req.params.projectId;
		const project = await Project.findById(projId);
		res.render('user/project-detail', {
			project: project,
			title: project?.title,
			path: '/',
		});
	} catch (err) {
		res.status(500).redirect('/500');
	}
};

export const getAboutUs = (_req: Request, res: Response): void => {
	res.render('user/about-us', {
		title: 'About-ENI',
		path: '/about-us',
	});
};

export const getSustDev = async (_req: Request, res: Response): Promise<void> => {
	try {
		const projects = await Project.find();
		res.render('user/sust-development', {
			title: 'Sustainable-Development',
			path: '/sust-dev',
			projs: projects,
		});
	} catch (err) {
		res.status(500).redirect('/500');
	}
};

export const getContact = (_req: Request, res: Response): void => {
	res.render('user/contact', {
		title: 'Contacts',
		path: '/contact',
		errorMessage: '',
		hasError: false,
	});
};

export const postContact = (req: Request, res: Response): void | Response => {
	const {
		name,
		surname,
		email,
		Subject,
		description,
	}: { name: string; surname: string; email: string; Subject: string; description: string } = req.body;

	const from = 'ogswebproject@gmail.com';
	const to = 'baselsalah2053@gmail.com';
	const subject = Subject;
	const output = `
<h2>Contact Details</h2>
<ul>
<li>Name : ${name} ${surname}</li>
<li>E-mail : ${email}</li>
<li>Description : ${description}</li>
</ul>
`;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render('user/contact', {
			title: 'Contacts',
			path: '/contact',
			message: {
				name: name,
				surname: surname,
				email: email,
				subject: Subject,
				desc: description,
			},
			hasError: true,
			errorMessage: errors.array()[0].msg,
		});
	}
	sendMail(to, from, subject, output);
	res.redirect('/sent');
};

export const getSent = (_req: Request, res: Response): void => {
	res.render('user/sent', {
		title: 'Email Sent',
		path: '/sent',
	});
};

export const getResources = (_req: Request, res: Response): void => {
	res.render('user/resources', {
		title: 'Resources',
		path: '/resources',
	});
};
