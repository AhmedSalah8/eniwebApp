import { Project, IProject } from '../models/project';
import { validationResult } from 'express-validator';
import deleteFile from '../util/file';
import { NextFunction, Request, Response } from 'express';

export const getProjects = async (_req: Request, res: Response): Promise<void> => {
	try {
		const projects: IProject[] = await Project.find();
		res.render('admin/projects', {
			projs: projects,
			title: 'Admin Projects',
			path: '/admin/projects',
		});
	} catch (err) {
		res.status(500).redirect('/500');
	}
};

export const getAddProject = (_req: Request, res: Response): void => {
	res.render('admin/edit-project', {
		title: 'Add-Project',
		path: '/admin/edit-project',
		editing: false,
		hasError: false,
		errorMessage: null,
		validationErrors: [],
	});
};

export const postAddProject = async (req: Request, res: Response): Promise<void | Response> => {
	try {
		const {
			title,
			category,
			area,
			description,
		}: { title: string; category: string; area: string; description: string } = req.body;
		const image: Express.Multer.File | undefined = req.file;
		if (!image) {
			try {
				return res.status(422).render('admin/edit-project', {
					title: 'Add-Project',
					path: '/admin/edit-project',
					editing: false,
					hasError: true,
					project: {
						title: title,
						description: description,
					},
					errorMessage: 'Attached file is not an image.',
					validationErrors: [],
				});
			} catch (err) {
				res.status(500).redirect('/500');
			}
		}
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			try {
				return res.status(422).render('admin/edit-project', {
					title: 'Add-Project',
					path: '/admin/edit-project',
					editing: false,
					hasError: true,
					project: {
						title: title,
						description: description,
					},
					errorMessage: errors.array()[0].msg,
					validationErrors: errors.array(),
				});
			} catch (err) {
				res.status(500).redirect('/500');
			}
		}
		const imageUrl = image?.path;

		const project = new Project({
			title: title,
			imageUrl: imageUrl,
			description: description,
			category: category,
			area: area,
			userId: req.session.user,
		});
		await project.save();
		res.redirect('/admin/projects');
	} catch (err) {
		res.status(500).redirect('/500');
	}
};

export const getEditProject = async (req: Request, res: Response): Promise<void | Response> => {
	try {
		const editMode = req.query.edit;
		if (!editMode) {
			return res.redirect('/');
		}
		const projId: string = req.params.projectId;
		const project = await Project.findById(projId);
		if (!project) {
			return res.redirect('/');
		}
		res.render('admin/edit-project', {
			title: 'Edit Project',
			path: '/admin/edit-project',
			editing: editMode,
			project: project,
			hasError: false,
			errorMessage: null,
			validationErrors: [],
		});
	} catch (err) {
		res.status(500).redirect('/500');
	}
};

export const postEditProject = async (req: Request, res: Response): Promise<void | Response> => {
	try {
		const {
			projectId,
			title: updatedTitle,
			description: updatedDescription,
		}: { projectId: string; title: string; description: string } = req.body;
		const image = req.file;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			try {
				return res.status(422).render('admin/edit-project', {
					title: 'Edit-Project',
					path: '/admin/edit-project',
					editing: true,
					hasError: true,
					project: {
						title: updatedTitle,
						description: updatedDescription,
						_id: projectId,
					},
					errorMessage: errors.array()[0].msg,
					validationErrors: errors.array(),
				});
			} catch (err) {
				res.status(500).redirect('/500');
			}
		}
		const project = await Project.findById(projectId);
		if (project) {
			project.title = updatedTitle;
			project.description = updatedDescription;
			if (image) {
				deleteFile(project.imageUrl);
				project.imageUrl = image.path;
			}
			await project.save();
			res.redirect('/admin/projects');
		}
	} catch (err) {
		res.status(500).redirect('/500');
	}
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void | NextFunction> => {
	try {
		const projId = req.params.projectId;
		const project = await Project.findById(projId);
		if (!project) {
			return next(new Error('Project not found.'));
		}
		deleteFile(project.imageUrl);
		await Project.findByIdAndRemove(projId);
		res.status(200).json({ message: 'Success!' });
	} catch (err) {
		res.status(500).json({ message: 'Deleting project failed.' });
	}
};
