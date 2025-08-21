import { RequestHandler, Request, Response } from "express";
import prisma from "../config/prisma";

//@ts-ignore
export const getInternships:RequestHandler = async (req: Request, res: Response) => {
    
    try {
        const internships= await prisma.internships.findMany({
        })

        res.json({ internships:internships })
    } catch (error) {
        res.json({ message: "error fetching internships, please try again later" })
    }
}

