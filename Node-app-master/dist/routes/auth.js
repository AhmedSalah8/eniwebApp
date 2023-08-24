"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authController = __importStar(require("../controllers/auth"));
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const authed_1 = __importDefault(require("../middleware/authed"));
const user_1 = require("../models/user");
const router = express_1.default.Router();
router.get('/login', authed_1.default, authController.getLogin);
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
    (0, express_validator_1.body)('password', 'Password has to be valid and 6-16 characters.')
        .isLength({ min: 6, max: 16 })
        .isAlphanumeric()
        .trim(),
], authController.postLogin);
router.post('/logout', is_auth_1.default, authController.postLogout);
router.get('/signup', is_auth_1.default, authController.getSignup);
router.post('/signup', [
    (0, express_validator_1.check)('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value) => {
        return user_1.User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('E-mail exists already.');
            }
        });
    })
        .normalizeEmail(),
    (0, express_validator_1.body)('password', 'Please Enter a password with only alphanumeric and 6-16 characters.')
        .isLength({ min: 6, max: 16 })
        .isAlphanumeric()
        .trim(),
    (0, express_validator_1.body)('confirmPassword')
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password have to match!');
        }
        return true;
    })
        .trim(),
], is_auth_1.default, authController.postSignup);
router.get('/reset', is_auth_1.default, authController.getReset);
router.post('/reset', (0, express_validator_1.check)('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(), is_auth_1.default, authController.postReset);
router.get('/reset/:token', is_auth_1.default, authController.getNewPassword);
router.post('/new-password', is_auth_1.default, authController.postNewPassword);
exports.default = router;
