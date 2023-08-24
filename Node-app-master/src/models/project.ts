import { Schema, model, Types } from 'mongoose';

export interface IProject {
	title: string;
	imageUrl: string;
	description: string;
	category: string;
	area?: string;
	userId: Types.ObjectId | string;
}

const projectSchema = new Schema<IProject>(
	{
		title: {
			required: true,
			type: String,
		},
		imageUrl: {
			require: true,
			type: String,
		},
		description: {
			required: true,
			type: String,
		},
		category: {
			required: true,
			type: String,
		},
		area: {
			type: String,
		},
		userId: {
			required: true,
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

export const Project = model<IProject>('Project', projectSchema);
