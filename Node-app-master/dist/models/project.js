"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const projectSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });
exports.Project = (0, mongoose_1.model)('Project', projectSchema);
