import { promises as fs } from 'fs';

const deleteFile = async (filePath: string): Promise<void> => {
	try {
		await fs.unlink(filePath);
	} catch (err) {
		throw new Error(`cannot delete file ${err}`);
	}
};

export default deleteFile;
