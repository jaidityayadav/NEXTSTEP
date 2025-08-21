import { Request, Response } from "express";
import prisma from "../config/prisma"; // your Prisma client

// Create Notice - HR only
export const createNotice = async (req: Request, res: Response) => {
    try {
      const { title, message } = req.body;
  
      // @ts-ignore: Assuming the userId is available in the req.user object
      const hrUserId = req.user?.userId; // Get the logged-in HR's userId
  
      if (!hrUserId) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
  
      // Create the notice with the logged-in HR user's ID
      const notice = await prisma.notice.create({
        data: {
          title,
          message,
          postedBy: { connect: { id: hrUserId } }, // Associate the HR user with the notice
        },
      });
  
      res.status(201).json(notice); // Respond with the created notice
    } catch (error) {
      console.error("Create Notice Error:", error);
      res.status(500).json({ error: "Failed to create notice" });
    }
  };
// GET /api/notices - Get all notices
export const getAllNotices = async (_req: Request, res: Response) => {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        postedBy: { select: { name: true, email: true } }, // Include the HR details who posted the notice
      },
    });

    res.json(notices);
  } catch (error) {
    console.error("Get Notices Error:", error);
    res.status(500).json({ error: "Failed to fetch notices" });
  }
};

// GET /api/notices/:id - Get notice by ID
export const getNoticeById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const notice = await prisma.notice.findUnique({
      where: { id },
      include: {
        postedBy: { select: { name: true, email: true } }, // Include HR's details
      },
    });

    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res.json(notice);
  } catch (error) {
    console.error("Get Notice Error:", error);
    res.status(500).json({ error: "Failed to fetch notice" });
  }
};



export const getNoticesByHr = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const { userId } = req.user;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access. User ID missing in token.'
      });
    }

    const notices = await prisma.notice.findMany({
      where: {
        postedById: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id:true,
        title: true,
        message: true,
        createdAt: true
      }
    });

    res.status(200).json({
      success: true,
      count: notices.length,
      notices
    });

  } catch (error) {
    console.error('Error fetching user notices:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notices'
    });
  }
};

export const deleteNoticeById = async (req: Request, res: Response) => {
  try {
      // 1. Find the notice by its ID
      const notice = await prisma.notice.findUnique({
          where: {
              id: req.params.id, // Assuming the notice ID is passed as a URL parameter
          }
      });

      // 2. Check if the notice exists
      if (!notice) {
          return res.status(404).json({
              success: false,
              message: 'Notice not found'
          });
      }

      // 3. Verify that the authenticated user is the one who posted the notice
      // Assuming req.user contains the authenticated user's info (after authentication middleware)
      //@ts-ignore
      if (notice.postedById !== req.user?.userId) {
          return res.status(403).json({
              success: false,
              message: 'Unauthorized: You can only delete your own notices'
          });
      }

      // 4. Delete the notice
      await prisma.notice.delete({
          where: {
              id: req.params.id
          }
      });

      // 5. Return success response
      res.status(200).json({
          success: true,
          message: 'Notice deleted successfully'
      });

  } catch (error) {
      console.error('Error deleting notice:', error);
      res.status(500).json({
          success: false,
          message: 'Server error while deleting notice'
      });
  }
};