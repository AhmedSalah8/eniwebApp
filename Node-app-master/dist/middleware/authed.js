"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res, next) {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    next();
}
exports.default = default_1;
