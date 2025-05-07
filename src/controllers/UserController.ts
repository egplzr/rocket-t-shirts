import {Request, Response, NextFunction} from 'express';
import prisma from '../models/PrismaService';
import bcrypt from 'bcrypt';

class UserController {
    static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {username, password} = req.body;

        if (!username || !password) {
            res.status(400).json({message: "Username and password required"});
            return; 
        }

        try {
            const existingUser = await prisma.user.findUnique({where: {username}});
            if (existingUser){
                res.status(409).json({message: "Username already exists."});
                return ;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword
                }
            });

            res.status(201).json({message: "User created successfully", userId: newUser.id});
        } catch (error) {
            return next(error);
        }
    }
}

export default UserController