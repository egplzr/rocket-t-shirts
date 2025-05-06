import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from "../models/PrismaService";

class AuthController{
    static async login(req: Request, res: Response): Promise<void> {
        const {username, password} = req.body;

        const user = await prisma.user.findUnique({where: {username}});

        if(!user || !(await bcrypt.compare(password, user.password))){
            res.status(401).json({error: 'Invalid credentials'});
            return;
        }

        const token = jwt.sign(
            {userId: user.id},
            process.env.ACCESS_KEY!,
            {expiresIn: '1h'}
        );

        res.json({token});
    }
}

export default AuthController;