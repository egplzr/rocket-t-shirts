import {Router} from 'express';
import ProductController from '../controllers/ProductController';
import { ensureAuth } from '../middlewares/ensureAuth';
import upload from '../config/multer';

const router = Router();

router.get('/', ProductController.list);
router.post('/', ensureAuth, upload.single('image'), ProductController.create);

export default router;