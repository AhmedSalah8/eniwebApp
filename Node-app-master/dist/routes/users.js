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
const userController = __importStar(require("../controllers/user"));
const router = express_1.default.Router();
router.get('/', userController.getHome);
router.get('/project/:projectId', userController.getProject);
router.get('/about-us', userController.getAboutUs);
router.get('/sust-dev', userController.getSustDev);
router.get('/contact', userController.getContact);
router.post('/contact', [
    (0, express_validator_1.body)('name').isString().withMessage('Please enter your name.'),
    (0, express_validator_1.check)('email').isEmail().withMessage('Please enter a vaild email.'),
    (0, express_validator_1.check)('description', 'Please enter a message.').notEmpty(),
], userController.postContact);
router.get('/sent', userController.getSent);
router.get('/resources', userController.getResources);
exports.default = router;
