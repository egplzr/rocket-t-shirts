import {Router} from 'express';
import CartController from '../controllers/CartController';

const router = Router();

router.post('/', CartController.addToCart);
router.get('/', CartController.getCart);

export default router;
