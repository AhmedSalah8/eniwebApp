import { Schema, model, Types } from 'mongoose';

export interface IUser {
	email: string;
	password: string;
	resetToken?: string;
	resetTokenExpiration?: Date | number;
	_id?: Types.ObjectId | string;
}

const userSchema = new Schema<IUser>({
	email: {
		required: true,
		type: String,
		unique: true,
	},
	password: {
		required: true,
		type: String,
	},
	resetToken: String,
	resetTokenExpiration: Date,
});

export const User = model<IUser>('User', userSchema);
