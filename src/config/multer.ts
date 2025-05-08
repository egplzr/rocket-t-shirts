import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.resolve(__dirname, '..', '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export default multer({
    storage: multer.diskStorage({
        destination: uploadDir,
        filename: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
            const filename = `${Date.now()}-${file.originalname}`;
            cb(null, filename);
        }
    })
});
