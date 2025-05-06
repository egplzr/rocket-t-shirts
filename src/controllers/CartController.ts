import { Request, Response } from "express";
import prisma from "../models/PrismaService";
import { RequiredExtensionArgs } from "@prisma/client/runtime/library";

class CartController{
    static async addToCart(req: Request, res: Response) : Promise<void> {
        try {
            const {productId, quantity} = req.body;

            if(!productId||!quantity) {
                res.status(400).json({error: 'Missing productId or quantity'});
                return;
            }

            const product = await prisma.product.findUnique({where: {id: productId}});
            if(!product) {
                res.status(404).json({error: 'Product not found'});
                return;
            }

            const cartItem = await prisma.cartItem.create({
                data: {
                    productId,
                    quantity
                }
            });

            res.status(201).json(cartItem);
        } catch (error) {
            res.status(500).json({error: 'Failed to add to cart'});
        }
    }

    static async getCart(req: Request, res: Response): Promise<void> {
        try {
            const cart = await prisma.cartItem.findMany({
                include: {
                    product: true,
                }
            });

            res.json(cart);
        } catch(error) {
            res.status(500).json({error: 'Failed to fetch cart'});
        }
    }
}

export default CartController;