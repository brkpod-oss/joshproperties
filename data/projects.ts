export type Project = {
  title: string;
  edition: string;
  area: string;
  location: string;
  duration: string;
  category: string;
  seed: string;
  tall?: boolean;
};

export const projects: Project[] = [
  {
    title: "The Verma Residence",
    edition: "Edition No. 014/250",
    area: "3,400 sq.ft",
    location: "Khammam",
    duration: "14 weeks",
    category: "Full Home",
    seed: "victory-verma",
    tall: true,
  },
  {
    title: "The Reddy Home",
    edition: "Edition No. 027/250",
    area: "2,800 sq.ft",
    location: "Khammam",
    duration: "14 weeks",
    category: "Full Home",
    seed: "victory-reddy",
  },
  {
    title: "The Iyer Apartment",
    edition: "Edition No. 033/250",
    area: "2,150 sq.ft",
    location: "Khammam",
    duration: "12 weeks",
    category: "Full Home",
    seed: "victory-iyer",
    tall: true,
  },
  {
    title: "The Krishnan Pooja Room",
    edition: "Edition No. 041/250",
    area: "160 sq.ft",
    location: "Khammam",
    duration: "5 weeks",
    category: "Pooja",
    seed: "victory-krishnan",
  },
  {
    title: "The Sharma Kitchen",
    edition: "Edition No. 052/250",
    area: "10 × 12 ft",
    location: "Warangal",
    duration: "6 weeks",
    category: "Kitchen",
    seed: "victory-sharma",
    tall: true,
  },
  {
    title: "The Wyra Farmhouse",
    edition: "Edition No. 061/250",
    area: "4,200 sq.ft",
    location: "Wyra",
    duration: "16 weeks",
    category: "Full Home",
    seed: "victory-wyra",
  },
];
