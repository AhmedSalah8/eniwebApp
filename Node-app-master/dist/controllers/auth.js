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
exports.postNewPassword = exports.getNewPassword = exports.postReset = exports.getReset = exports.postSignup = exports.getSignup = exports.postLogout = exports.postLogin = exports.getLogin = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sendmail_1 = __importDefault(require("../util/sendmail"));
const user_1 = require("../models/user");
const crypto_1 = __importDefault(require("crypto"));
const getLogin = (req, res) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    }
    else {
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
exports.getLogin = getLogin;
const postLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
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
            }
            catch (err) {
                res.status(500).redirect('/500');
            }
        }
        const user = yield user_1.User.findOne({ email: email });
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
            }
            catch (err) {
                res.status(500).redirect('/500');
            }
        }
        else {
            const validated = yield bcryptjs_1.default.compare(password + process.env.PEPPER, user.password);
            if (!validated) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                req.session.save();
                res.redirect('/');
            }
            else {
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
                }
                catch (err) {
                    res.status(500).redirect('/500');
                }
            }
        }
    }
    catch (err) {
        res.status(500).redirect('/500');
    }
});
exports.postLogin = postLogin;
const postLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
    catch (err) {
        res.status(500).redirect('/500');
    }
});
exports.postLogout = postLogout;
const getSignup = (req, res) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    }
    else {
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
exports.getSignup = getSignup;
const postSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
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
            }
            catch (err) {
                res.status(500).redirect('/500');
            }
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password + process.env.PEPPER, Number(process.env.SALT_ROUNDS));
        const user = new user_1.User({
            email,
            password: hashedPassword,
        });
        yield user.save();
        res.redirect('/login');
    }
    catch (err) {
        res.status(500).redirect('/500');
    }
});
exports.postSignup = postSignup;
const getReset = (req, res) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    res.render('auth/reset', {
        title: 'Reset Password',
        path: '/reset',
        errorMessage: message,
    });
};
exports.getReset = getReset;
const postReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        crypto_1.default.randomBytes(32, (err, buffer) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                return res.redirect('/reset');
            }
            const email = req.body.email;
            const token = buffer.toString('hex');
            const user = yield user_1.User.findOne({ email });
            if (!user) {
                req.flash('error', 'No account with that email found.');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            yield user.save();
            res.redirect('/');
            const to = email;
            const from = 'ogswebproject@gmail.com';
            const subject = 'Password reset';
            const output = `
        <p>You requested a password reset</p>
        <p>Click this <a href="https://eniweb.herokuapp.com/${token}">link</a> to set a new password.</p>
        `;
            (0, sendmail_1.default)(to, from, subject, output);
        }));
    }
    catch (err) {
        res.status(500).redirect('/500');
    }
});
exports.postReset = postReset;
const getNewPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        const user = yield user_1.User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
        let message = req.flash('error');
        if (message.length > 0) {
            message = message[0];
        }
        else {
            message = null;
        }
        res.render('auth/new-password', {
            title: 'Update Password',
            path: '/new-password',
            errorMessage: message,
            userId: user === null || user === void 0 ? void 0 : user._id.toString(),
            passwordToken: token,
        });
    }
    catch (err) {
        res.status(500).redirect('/500');
    }
});
exports.getNewPassword = getNewPassword;
const postNewPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, userId, passwordToken } = req.body;
        const resetUser = yield user_1.User.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Date.now() },
            _id: userId,
        });
        if (resetUser) {
            const hashedPassword = yield bcryptjs_1.default.hash(password + process.env.PEPPER, Number(process.env.SALT_ROUNDS));
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            yield resetUser.save();
            res.redirect('/');
        }
    }
    catch (err) {
        res.status(500).redirect('/500');
    }
});
exports.postNewPassword = postNewPassword;
