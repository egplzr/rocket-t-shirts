import {Router} from 'express';
import ProductController from '../controllers/ProductController';
import { ensureAuth } from '../middlewares/ensureAuth';

const router = Router();

router.get('/', ProductController.list);
router.post('/', ensureAuth, ProductController.create);

export default router;