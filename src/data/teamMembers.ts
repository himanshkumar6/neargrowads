export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  image: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Brijgopal",
    role: "",
    image: "/assets/brijgopal 2.jpg",
  },
  {
    id: "2",
    name: "Kritika",
    role: "",
    image: "/assets/Kritika.jpg",
  },
  {
    id: "3",
    name: "Harsh",
    role: "",
    image: "/assets/Harsh.jpg",
  },
  {
    id: "4",
    name: "Aditya",
    role: "",
    image: "/assets/Aditya.jpeg",
  },
  // {
  //   id: "5",
  //   name: "Michael Chang",
  //   role: "Senior Strategist",
  //   image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800",
  // },
  // {
  //   id: "6",
  //   name: "Jessica Taylor",
  //   role: "Operations Lead",
  //   image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
  // },
  // {
  //   id: "7",
  //   name: "Ryan Gosling",
  //   role: "Frontend Developer",
  //   image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
  // },
];
