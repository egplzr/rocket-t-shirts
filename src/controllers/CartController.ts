import { Request, Response } from "express";
import prisma from "../models/PrismaService";

class CartController {
  static async addToCart(req: Request, res: Response): Promise<void> {
    try {
      const { productId, quantity } = req.body;
      const userId = (req as any).user.userId;

      if (!productId || !quantity) {
        res.status(400).json({ error: 'Missing productId or quantity' });
        return;
      }

      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      const existingItem = await prisma.cartItem.findFirst({
        where: { productId, userId }
      });

      let cartItem;
      if (existingItem) {
        cartItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity }
        });
      } else {
        cartItem = await prisma.cartItem.create({
          data: {
            productId,
            quantity,
            userId
          }
        });
      }

      res.status(201).json(cartItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add to cart' });
    }
  }

  static async getCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;

      const cart = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true }
      });

      res.json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch cart' });
    }
  }

  static async removeFromCart(req: Request, res: Response): Promise<void> {
    try {
      const cartItemId = Number(req.params.id);
  
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId }
      });
  
      if (!cartItem) {
        res.status(404).json({ error: 'Cart item not found' });
        return;
      }
  
      await prisma.cartItem.delete({ where: { id: cartItemId } });
  
      res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to remove item from cart' });
    }
  }

  static async updateCartItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const cartItemId = Number(req.params.id);
      const { quantity } = req.body;
  
      if (!quantity || quantity < 1) {
        res.status(400).json({ error: 'Invalid quantity value' });
        return;
      }
  
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId }
      });
  
      if (!cartItem) {
        res.status(404).json({ error: 'Cart item not found' });
        return;
      }
  
      if (cartItem.userId !== userId) {
        res.status(403).json({ error: 'Unauthorized to update this item' });
        return;
      }
  
      const updatedItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity }
      });
  
      res.status(200).json(updatedItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update cart item' });
    }
  }  
}

export default CartController;
