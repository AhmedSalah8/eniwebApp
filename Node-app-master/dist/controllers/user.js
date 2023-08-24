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
exports.getResources = exports.getSent = exports.postContact = exports.getContact = exports.getSustDev = exports.getAboutUs = exports.getProject = exports.getHome = void 0;
const express_validator_1 = require("express-validator");
const sendmail_1 = __importDefault(require("../util/sendmail"));
const project_1 = require("../models/project");
const getHome = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield project_1.Project.find();
        res.render('user/home', {
            title: 'Home',
            path: '/',
            projs: projects,
        });
    }
    catch (err) {
        res.status(500).redirect('/500');
    }
});
exports.getHome = getHome;
const getProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projId = req.params.projectId;
        const project = yield project_1.Project.findById(projId);
        res.render('user/project-detail', {
            project: project,
            title: project === null || project === void 0 ? void 0 : project.title,
            path: '/',
        });
    }
    catch (err) {
        res.status(500).redirect('/500');
    }
});
exports.getProject = getProject;
const getAboutUs = (_req, res) => {
    res.render('user/about-us', {
        title: 'About-ENI',
        path: '/about-us',
    });
};
exports.getAboutUs = getAboutUs;
const getSustDev = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield project_1.Project.find();
        res.render('user/sust-development', {
            title: 'Sustainable-Development',
            path: '/sust-dev',
            projs: projects,
        });
    }
    catch (err) {
        res.status(500).redirect('/500');
    }
});
exports.getSustDev = getSustDev;
const getContact = (_req, res) => {
    res.render('user/contact', {
        title: 'Contacts',
        path: '/contact',
        errorMessage: '',
        hasError: false,
    });
};
exports.getContact = getContact;
const postContact = (req, res) => {
    const { name, surname, email, Subject, description, } = req.body;
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
    const errors = (0, express_validator_1.validationResult)(req);
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
    (0, sendmail_1.default)(to, from, subject, output);
    res.redirect('/sent');
};
exports.postContact = postContact;
const getSent = (_req, res) => {
    res.render('user/sent', {
        title: 'Email Sent',
        path: '/sent',
    });
};
exports.getSent = getSent;
const getResources = (_req, res) => {
    res.render('user/resources', {
        title: 'Resources',
        path: '/resources',
    });
};
exports.getResources = getResources;
