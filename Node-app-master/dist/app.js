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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const csurf_1 = __importDefault(require("csurf"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const multer_1 = __importDefault(require("multer"));
const compression_1 = __importDefault(require("compression"));
const errorController = __importStar(require("./controllers/error"));
dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const MongoDBStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
const store = new MongoDBStore({
    uri: String(process.env.MONGODB_URI),
    collection: 'sessions',
});
const csrfProtection = (0, csurf_1.default)();
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
app.set('view engine', 'ejs');
const admin_1 = __importDefault(require("./routes/admin"));
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
app.use((0, compression_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, multer_1.default)({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.use('/images', express_1.default.static(path_1.default.join(__dirname, '..', 'images')));
app.use((0, express_session_1.default)({
    secret: String(process.env.SESSION_SECRET),
    resave: false,
    saveUninitialized: false,
    store: store,
}));
app.use(csrfProtection);
app.use((0, connect_flash_1.default)());
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use('/admin', admin_1.default);
app.use(users_1.default);
app.use(auth_1.default);
app.get('/500', errorController.get500);
app.use(errorController.get404);
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(String(process.env.MONGODB_URI));
    }
    catch (err) {
        console.log(`failed to connect to MongoDB ${err}`);
    }
});
connectDB();
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
