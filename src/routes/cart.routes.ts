import {Router} from 'express';
import CartController from '../controllers/CartController';
import {ensureAuth} from '../middlewares/ensureAuth';

const router = Router();

router.post('/', ensureAuth, CartController.addToCart);
router.get('/', ensureAuth, CartController.getCart);
router.delete('/:id', ensureAuth, CartController.removeFromCart);
router.patch('/:id', ensureAuth, CartController.updateCartItem);

export default router;
