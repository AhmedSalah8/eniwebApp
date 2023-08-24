"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.postEditProject = exports.getEditProject = exports.postAddProject = exports.getAddProject = exports.getProjects = void 0;
const project_1 = require("../models/project");
const express_validator_1 = require("express-validator");
const file_1 = __importDefault(require("../util/file"));
const getProjects = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield project_1.Project.find();
        res.render('admin/projects', {
            projs: projects,
            title: 'Admin Projects',
            path: '/admin/projects',
        });
    }
    catch (err) {
        res.status(500).redirect('/500');
    }
});
exports.getProjects = getProjects;
const getAddProject = (_req, res) => {
    res.render('admin/edit-project', {
        title: 'Add-Project',
        path: '/admin/edit-project',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
    });
};
exports.getAddProject = getAddProject;
const postAddProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, category, area, description, } = req.body;
        const image = req.file;
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
            }
            catch (err) {
                res.status(500).redirect('/500');
            }
        }
        const errors = (0, express_validator_1.validationResult)(req);
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
            }
            catch (err) {
                res.status(500).redirect('/500');
            }
        }
        const imageUrl = image === null || image === void 0 ? void 0 : image.path;
        const project = new project_1.Project({
            title: title,
            imageUrl: imageUrl,
            description: description,
            category: category,
            area: area,
            userId: req.session.user,
        });
        yield project.save();
        res.redirect('/admin/projects');
    }
    catch (err) {
        res.status(500).redirect('/500');
    }
});
exports.postAddProject = postAddProject;
const getEditProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const editMode = req.query.edit;
        if (!editMode) {
            return res.redirect('/');
        }
        const projId = req.params.projectId;
        const project = yield project_1.Project.findById(projId);
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
    }
    catch (err) {
        res.status(500).redirect('/500');
    }
});
exports.getEditProject = getEditProject;
const postEditProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId, title: updatedTitle, description: updatedDescription, } = req.body;
        const image = req.file;
        const errors = (0, express_validator_1.validationResult)(req);
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
            }
            catch (err) {
                res.status(500).redirect('/500');
            }
        }
        const project = yield project_1.Project.findById(projectId);
        if (project) {
            project.title = updatedTitle;
            project.description = updatedDescription;
            if (image) {
                (0, file_1.default)(project.imageUrl);
                project.imageUrl = image.path;
            }
            yield project.save();
            res.redirect('/admin/projects');
        }
    }
    catch (err) {
        res.status(500).redirect('/500');
    }
});
exports.postEditProject = postEditProject;
const deleteProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projId = req.params.projectId;
        const project = yield project_1.Project.findById(projId);
        if (!project) {
            return next(new Error('Project not found.'));
        }
        (0, file_1.default)(project.imageUrl);
        yield project_1.Project.findByIdAndRemove(projId);
        res.status(200).json({ message: 'Success!' });
    }
    catch (err) {
        res.status(500).json({ message: 'Deleting project failed.' });
    }
});
exports.deleteProject = deleteProject;
