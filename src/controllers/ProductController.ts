import { Request, Response } from 'express';
import prisma from '../models/PrismaService';

class ProductController {
    static async list(req: Request, res: Response): Promise<void> {
        try {
            const products = await prisma.product.findMany();
            res.json(products);
        } catch(error) {
            res.status(500).json({ error: 'Failed to list products' });
        }
    }

    static async create(req: Request, res: Response): Promise<void> {
        try{
            const {name, price, description} = req.body;
            const image = (req as any).file ? `/uploads/${(req as any).file.filename}` : null;

            if(!name || !price || !description) {
                res.status(400).json({error: 'Missing fields'});
                return;
            }

            const product = await prisma.product.create({
                data: {
                    name,
                    price: parseFloat(price),
                    description,
                    image
                }
            });

            res.status(201).json(product);
        } catch(error) {
            res.status(500).json({error: 'Failed to create product'});
        }
    }
}

export default ProductController;