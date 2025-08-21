import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET!;

// Define Zod schemas for request bodies with specific constraints
const signupSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").max(30, "Name must be at most 30 characters long"),
    username: z.string().min(3, "Username must be at least 3 characters long").max(15, "Username must be at most 15 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(5, "Password must be at least 5 characters long").max(25, "Password must be at most 25 characters long"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(5, "Password must be at least 5 characters long").max(25, "Password must be at most 25 characters long"),
});

//@ts-ignore
export const studentSignup: RequestHandler = async (req, res) => {
    // Validate request body
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }

    const { name, username, email, password } = result.data;

    try {
        const existingUser = await prisma.student.findUnique({ where: { email } });
        const existingUsername = await prisma.student.findUnique({ where: { username } });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });
        if (existingUsername) return res.status(400).json({ message: "Username already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.student.create({
            data: { name, email, username, password: hashedPassword },
        });

        res.status(201).json({ message: "User registered successfully", userId: user.id });
    } catch (error) {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

//@ts-ignore
export const hrSignup: RequestHandler = async (req, res) => {
    // Validate request body
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }

    const { name, username, email, password } = result.data;

    try {
        const existingUser = await prisma.hR.findUnique({ where: { email } });
        const existingUsername = await prisma.hR.findUnique({ where: { username } });

        if (existingUser) return res.status(400).json({ message: "Email already exists" });
        if (existingUsername) return res.status(400).json({ message: "Username already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.hR.create({
            data: { name, email, username, password: hashedPassword },
        });

        res.status(201).json({ message: "User registered successfully", userId: user.id });
    } catch (error) {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

//@ts-ignore
export const studentLogin: RequestHandler = async (req, res) => {
    // Validate request body
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }

    const { email, password } = result.data;

    try {
        const user = await prisma.student.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid email, please sign up" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Wrong password, please try again" });

        // --------- 🔥 STREAK LOGIC ---------
        const today = new Date().toDateString();
        const lastLogin = user.lastLoginDate?.toDateString();
        let updatedStreak = user.streakCount ?? 0;

        console.log("Last login:", lastLogin);
        console.log("Today's date:", today);

        if (lastLogin !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastLogin === yesterday.toDateString()) {
                updatedStreak += 1; // continued streak
            } else {
                updatedStreak = 1; // reset streak
            }

            await prisma.student.update({
                where: { id: user.id },
                data: {
                    streakCount: updatedStreak,
                    lastLoginDate: new Date() // Set today's date
                }
            });

            console.log(`Streak updated: ${updatedStreak}`);
        }

        // --------- 🔥 END STREAK LOGIC ---------

        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        res.json({ token, streak: updatedStreak }); // Send updated streak in response

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "An unknown error occurred" });
    }
};



//@ts-ignore
export const hrLogin: RequestHandler = async (req, res) => {
    // Validate request body
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }

    const { email, password } = result.data;

    try {
        const user = await prisma.hR.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid email, please sign up" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Wrong password, please try again" });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};