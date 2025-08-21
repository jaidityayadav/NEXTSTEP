// controllers/hrController.ts
import { Request, RequestHandler, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middlewares/authMiddleware";

//@ts-ignore
export const postInternship: RequestHandler = async (req: AuthRequest, res: Response) => {
  const { company_name, position, location, stipend, duration, starting_date, is_immediate, deadline } = req.body;

  // Ensure the user is authenticated
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
      // Create internship with deadline
      const internship = await prisma.internships.create({
          data: {
              company_name,
              position,
              location,
              stipend,
              duration,
              starting_date: new Date(starting_date), // Ensure this is in Date format
              is_immediate,
              deadline: deadline ? new Date(deadline) : null, // If deadline is provided, convert it to Date
              hr: { connect: { id: req.user.userId } }, // Associate with logged-in HR user
          },
      });

      res.status(201).json({ message: "Internship created successfully", internship });
  } catch (error) {
      console.error("Error creating internship:", error);
      res.status(500).json({ error: "An unknown error occurred" });
  }
};

//@ts-ignore
export const deleteInternship: RequestHandler = async (req, res) => {
    const { id } = req.params;  // Get internshipId from URL params
  //@ts-ignore
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        // Check if internship exists
        const internship = await prisma.internships.findUnique({
            where: {
                id: id  // Use the id from req.params
            }
        });

        if (!internship) {
            return res.status(404).json({ message: "Internship not found" });
        }

        // Check if the current user is the HR who created the internship
        //@ts-ignore
        if (internship.hrId !== req.user.userId) {
            return res.status(403).json({ message: "You are not authorized to delete this internship" });
        }

        // Delete related favorites first
        await prisma.favorite.deleteMany({
            where: { internshipId: id }
        });

        // Delete related applications
        await prisma.application.deleteMany({
            where: { internshipId: id }
        });

        // Now delete the internship
        await prisma.internships.delete({
            where: { id: id }
        });

        res.json({ message: "Internship deleted successfully" });
    } catch (error) {
        console.error('Error deleting internship:', error);
        res.status(500).json({ error: "An unknown error occurred" });
    }
};





//@ts-ignore
export const getHRProfile:RequestHandler = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const user = await prisma.hR.findUnique({
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
// controllers/hrController.ts
// Ensure you're importing the Prisma client instance

export const getHRInternships: RequestHandler = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const internships = await prisma.internships.findMany({
            where: {
                hrId: req.user.userId,
            },
            include: {
                applications: {
                    include: {
                        student: {
                            select: { // Selecting only relevant student fields
                                id: true,
                                username: true,
                                name: true,
                                email: true,
                                lastLoginDate: true,
                                streakCount: true,
                            },
                        },
                    },
                },
            },
        });

        // If no internships found
        if (internships.length === 0) {
            return res.status(404).json({ message: "No internships found for this HR" });
        }

        // Return the internships, applications, and student details
        return res.status(200).json({ internships });
    } catch (error) {
        console.error("Error fetching HR internships:", error);
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

export const editInternship: RequestHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
  }

  const internshipId = req.params.id; // Get internship ID from URL parameters
  const { company_name, position, location, stipend, duration, starting_date, is_immediate, deadline } = req.body;

  try {
      // Check if internship exists
      const internship = await prisma.internships.findFirst({
          where: {
              id: internshipId,
              hrId: req.user.userId, // Ensure the HR is authorized to edit the internship
          },
      });

      if (!internship) {
          return res.status(404).json({ message: "Internship not found" });
      }

      // Update internship details
      const updatedInternship = await prisma.internships.update({
          where: { id: internshipId },
          data: {
              company_name,
              position,
              location,
              stipend,
              duration,
              starting_date: new Date(starting_date), // Ensure the date format is correct
              is_immediate,
              deadline: deadline ? new Date(deadline) : internship.deadline, // Update deadline if provided, otherwise keep the old one
          },
      });

      return res.status(200).json({ message: "Internship updated successfully", updatedInternship });
  } catch (error) {
      console.error("Error updating internship:", error);
      return res.status(500).json({ error: "An unknown error occurred" });
  }
};
  
  export const getInternshipById: RequestHandler = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const internshipId = req.params.id; // Get internship ID from the URL parameters
    console.log(`Fetching internship with ID: ${internshipId}`); // Debug log to check ID
    
    try {
      // Fetch the internship details by its ID and ensure that the HR user owns the internship
      const internship = await prisma.internships.findFirst({
        where: {
          id: internshipId, // Search by ID
          hrId: req.user.userId, // Ensure the HR user is authorized to view this internship
        },
      });
  
      if (!internship) {
        return res.status(404).json({ message: "Internship not found" });
      }
  
      console.log("Internship found:", internship); // Debug log to check the fetched internship
      // Return only the internship details
      return res.status(200).json({ internship });
    } catch (error) {
      console.error("Error fetching internship:", error); // Log the error for debugging
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  };
  



export const getHRavgSalary = async (req: Request, res: Response): Promise<void> => {
    //@ts-ignore
    const hrId = req.user?.id; // Assuming the HR's ID is added to the `req.user` object by authenticateUser middleware
  
    try {
      // Query to get the average stipend for the HR
      const result = await prisma.internships.aggregate({
        _avg: {
          stipend: true,
        },
        where: {
          hrId: hrId, // Use the hrId from the authenticated user
        },
      });
  
      // Check if stipend data exists
      if (result._avg.stipend !== null) {
        res.status(200).json({ averageStipend: result._avg.stipend });
      } else {
        res.status(404).json({ message: 'No internships found for this HR' });
      }
    } catch (error) {
      console.error('Error fetching average stipend:', error);
      res.status(500).json({ error: 'Failed to calculate the average stipend' });
    }
  };