import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';
import csrf from 'csurf';
import flash from 'connect-flash';
import multer from 'multer';
import compression from 'compression';

import * as errorController from './controllers/error';
import { IUser } from './models/user';

dotenv.config();

declare module 'express-session' {
	export interface SessionData {
		isLoggedIn: boolean;
		user: IUser;
	}
}
const app: express.Application = express();
const port = process.env.PORT || 3000;

const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
	uri: String(process.env.MONGODB_URI),
	collection: 'sessions',
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
	destination: (req, file, cb): void => {
		cb(null, 'images');
	},
	filename: (req, file, cb): void => {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: any): void => {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.set('view engine', 'ejs');

import adminRoutes from './routes/admin';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';

app.use(compression());

app.use(express.urlencoded({ extended: true }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

app.use(
	session({
		secret: String(process.env.SESSION_SECRET),
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

app.use(csrfProtection);
app.use(flash());

app.use((req: Request, res: Response, next: NextFunction): void => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

const connectDB = async () => {
	try {
		await mongoose.connect(String(process.env.MONGODB_URI));
	} catch (err) {
		console.log(`failed to connect to MongoDB ${err}`);
	}
};

connectDB();
app.listen(port, (): void => {
	console.log(`Server is running on port ${port}`);
});
