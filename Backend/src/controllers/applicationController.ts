import { PrismaClient, Application } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Create a new application
export const createApplication = async (req: Request, res: Response): Promise<void> => {
  const { studentId, internshipId }: { studentId: string; internshipId: string } = req.body;

  try {
    const newApplication: Application = await prisma.application.create({
      data: {
        studentId,
        internshipId,
        status: "Pending Review", // Default status
      },
    });
    res.json(newApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create application" });
  }
};

// Get all applications
export const getApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications: Application[] = await prisma.application.findMany();
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// Update application status
export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status }: { status: string } = req.body;

  // Ensure the status is valid
  const validStatuses = ["Pending Review", "Approved", "Interview Stage", "Rejected"];

  if (!validStatuses.includes(status)) {
    //@ts-ignore
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const updatedApplication: Application = await prisma.application.update({
      where: { id },
      data: { status },
    });
    res.json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update application status" });
  }
};

export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    try {
      const application = await prisma.application.findUnique({
        where: { id },
        include: {
          internship: true, // Include internship details
          student: true, // Include student details (name, etc.)
        },
      });
  
      if (!application) {
        //@ts-ignore
        return res.status(404).json({ message: "Application not found" });
      }
  
      // Send the application along with the student details
      res.json(application);
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ message: "Failed to fetch application" });
    }
  };

  export const getStudentApplications = async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      const studentId = req.user?.userId;
  
      if (!studentId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const applications = await prisma.application.findMany({
        where: {
          studentId,
        },
        select: {
          status: true,
          internship: {
            select: {
              company_name: true,
              position: true,
            },
          },
        },
      });
  
      const result = applications.map((app) => ({
        company_name: app.internship.company_name,
        position: app.internship.position,
        status: app.status,
      }));
  
      res.json({ applications: result });
    } catch (error) {
      console.error("Error fetching student applications:", error);
      res.status(500).json({ message: "Server error" });
    }
  };