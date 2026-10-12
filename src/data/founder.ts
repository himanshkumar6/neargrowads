export interface Founder {
  id: number;
  name: string;
  position: string;
  story: string;
  image: string;
  linkedin?: string;
  email?: string;
}

export const founders: Founder[] = [
  {
    id: 1,
    name: "Jyoti",
    position: "Director",
    story: "Leading strategic growth, corporate governance, and sustainable organizational development across regional markets.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    linkedin: "https://www.linkedin.com/company/neargrowads/",
    email: "mailto:info@neargrowads.com"
  },
  {
    id: 2,
    name: "Ajay Singh",
    position: "Founder",
    story: "Directing high-impact client partnerships, business scaling, performance marketing, and long-term brand equity.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    linkedin: "https://www.linkedin.com/in/sachin-dubey-bb24b450/",
    email: "mailto:sachin@neargrowads.com"
  },
  {
    id: 3,
    name: "Himanshu Kumar Sharma",
    position: "Chief Technical Officer (CTO)",
    story: "Building robust marketing infrastructure, transparent technology systems, scalable automation, and growth platforms.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
    linkedin: "https://www.linkedin.com/in/sushant-upadhayay-5a8318175/",
    email: "mailto:sushantssbk@gmail.com"
  },
  {
    id: 4,
    name: "Harsh",
    position: "Operations Head",
    story: "Managing campaign delivery, operational coordination, client servicing, and consistent solution execution.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
    linkedin: "https://www.linkedin.com/in/vanshika-gupta-6a59b1199/",
    email: "mailto:vanshika@neargrowads.com"
  }
];
