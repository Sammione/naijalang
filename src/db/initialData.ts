import { HubDatabase } from "@/types/database";

export const initialDatabase: HubDatabase = {
  admins: [
    {
      id: "admin-ngozi",
      name: "Dr. Ngozi Balogun",
      email: "admin@naijalang.com",
      role: "admin",
      title: "Director of Academics & Hub Operations",
      department: "Academic Leadership & Operations",
      avatarLetters: "NB",
      lastActive: "Just now"
    }
  ],
  teachers: [],
  parents: [],
  students: [],
  classes: [],
  assignments: [],
  invoices: []
};
