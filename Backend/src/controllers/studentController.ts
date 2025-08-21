import { RequestHandler, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middlewares/authMiddleware";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

//@ts-ignore
export const getStudentProfile: RequestHandler = async (
    req: AuthRequest,
    res: Response
) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const user = await prisma.student.findUnique({
            where: { id: req.user?.userId },
            select: { id: true, name: true, email: true },
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

//@ts-ignore



export const applyInternship: RequestHandler = async (
    req: AuthRequest,
    res
) => {
    // Ensure the user is authenticated
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { internshipId } = req.body;

    // Ensure the internshipId is provided
    if (!internshipId) {
        return res.status(400).json({ message: "Missing internshipId" });
    }

    try {
        console.log("🔐 User:", req.user);
        console.log("📩 internshipId:", internshipId);

        // Fetch the user from the database
        const user = await prisma.student.findUnique({
            where: { id: req.user.userId },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user has already applied for the internship
        const applied = await prisma.application.findFirst({
            where: {
                studentId: user.id,
                internshipId: internshipId,
            },
        });

        if (applied) {
            return res.status(400).json({ message: "Already applied" });
        }

        // Create a new application with "Pending Review" status by default
        const application = await prisma.application.create({
            data: {
                studentId: user.id,
                internshipId: internshipId,
                status: "Pending Review", // Setting the status to "Pending Review"
            },
        });

        console.log("✅ Application successfully created with status: Pending Review");

        // Return the created application object along with a success message
        return res.status(200).json({
            message: "Successfully applied, application is under review",
            application,
        });
    } catch (error) {
        console.error("❌ Error while applying to internship:", error);

        // Prisma-specific error message
        //@ts-ignore
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            //@ts-ignore
            return res.status(500).json({ error: error.message });
        }

        // Generic error handler
        return res.status(500).json({ error: "An unknown error occurred" });
    }
};


//@ts-ignore
export const addToFavorite: RequestHandler = async (
    req: AuthRequest,
    res: Response
) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { internshipId } = req.body;

    try {
        const user = await prisma.student.findUnique({
            where: { id: req.user?.userId },
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        const favorited = await prisma.favorite.findFirst({
            where: { studentId: user.id, internshipId: internshipId }
        })

        if (favorited) return res.status(400).json({ message: "Already favorited" });

        await prisma.favorite.create({
            data: { studentId: user.id, internshipId: internshipId }
        });

        res.status(200).json({ message: "Favorited!" });
    } catch (error) {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

//@ts-ignore
export const getAppliedInternships: RequestHandler = async (
    req: AuthRequest,
    res: Response
) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const user = await prisma.student.findUnique({
            where: { id: req.user.userId }
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        const count = await prisma.application.count({
            where: { studentId: user.id }
        })

        const appliedInternships = await prisma.application.findMany({
            where: { studentId: user.id },
            select: { internshipId: true }
        });

        const internshipIds = appliedInternships.map(app => app.internshipId);
        const internshipDetails = await getInternshipDetailsFromIds(internshipIds);

        res.status(200).json({ count: count, appliedInternships: internshipDetails });
    } catch (error) {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

//@ts-ignore
export const getFavoriteInternships: RequestHandler = async (
    req: AuthRequest,
    res: Response
) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const user = await prisma.student.findUnique({
            where: { id: req.user.userId }
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        const count = await prisma.favorite.count({
            where: { studentId: user.id }
        })

        const favoriteInternships = await prisma.favorite.findMany({
            where: { studentId: user.id },
            select: { internshipId: true }
        });

        const internshipIds = favoriteInternships.map(fav => fav.internshipId);
        const internshipDetails = await getInternshipDetailsFromIds(internshipIds);

        res.status(200).json({ count: count, favoriteInternships: internshipDetails });
    } catch (error) {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

async function getInternshipDetailsFromIds(internshipIds: string[]) {
    return await prisma.internships.findMany({
        where: { id: { in: internshipIds } }
    });
}

// @ts-ignore
export const getStudentStreak: RequestHandler = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const user = await prisma.student.findUnique({
            where: { id: req.user.userId },
            select: {
                streakCount: true,
                lastLoginDate: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            streak: user.streakCount,
            lastLogin: user.lastLoginDate,
        });
    } catch (error) {
        console.error("Error fetching student streak:", error);
        return res.status(500).json({ message: "Failed to fetch streak data" });
    }
};



  
  // Get all Students with Resumes (HR side)
 