"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get500 = exports.get404 = void 0;
const get404 = (req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found',
        path: '/404',
        isAuthenticated: req.session.isLoggedIn,
    });
};
exports.get404 = get404;
const get500 = (req, res) => {
    res.status(500).render('500', {
        title: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn,
    });
};
exports.get500 = get500;
