import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
//import fs from "fs"; // Filesystem NextJs not recomended
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL || "");

type Data = {
	message: string;
};

export const config = {
	api: {
		bodyParser: false,
	},
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "POST":
			return uploadFile(req, res);

		default:
			return res.status(405).json({ message: "Bad Request" });
	}
}

const saveFile = async (file: formidable.File): Promise<string> => {
	// Filesystem not recomended

	// const data = fs.readFileSync(file.filepath);
	// fs.writeFileSync(`./public/${file.originalFilename}`, data);
	// fs.unlinkSync(file.filepath); // delete the temporary file
	// return;

	const data = await cloudinary.uploader.upload(file.filepath);
	console.log(data);
	return data.secure_url;
};

const parseFiles = async (req: NextApiRequest): Promise<string> => {
	return new Promise((resolve, reject) => {
		const form = new formidable.IncomingForm();
		form.parse(req, async (error, fields, files) => {
			//console.log(error, fields, files);
			if (error) {
				return reject(error);
			}

			const filePath = await saveFile(files.file as formidable.File);
			resolve(filePath);
		});
	});
};

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const imageUrl = await parseFiles(req);

	return res.status(200).json({ message: imageUrl });
};