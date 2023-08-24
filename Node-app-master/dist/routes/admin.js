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
const adminController = __importStar(require("../controllers/admin"));
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const router = express_1.default.Router();
router.get('/projects', is_auth_1.default, adminController.getProjects);
router.get('/add-project', is_auth_1.default, adminController.getAddProject);
router.post('/add-project', [
    (0, express_validator_1.body)('title', 'Please enter a title between 3-80 characters').isString().isLength({ min: 3, max: 80 }).trim(),
    (0, express_validator_1.body)('description', 'Please enter details between 40-2000 characters.').isLength({ min: 40, max: 2000 }).trim(),
], is_auth_1.default, adminController.postAddProject);
router.get('/edit-project/:projectId', is_auth_1.default, adminController.getEditProject);
router.post('/edit-project', [
    (0, express_validator_1.body)('title', 'Please enter a title between 3-80 characters').isString().isLength({ min: 3, max: 80 }).trim(),
    (0, express_validator_1.body)('description', 'Please enter details between 40-2000 characters.').isLength({ min: 40, max: 2000 }).trim(),
], is_auth_1.default, adminController.postEditProject);
router.delete('/project/:projectId', is_auth_1.default, adminController.deleteProject);
exports.default = router;
