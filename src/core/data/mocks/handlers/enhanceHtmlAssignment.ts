import { graphql, HttpResponse } from "msw";

const mockProducts = [
  {
    id: "1",
    title: "Premium Widget",
    description:
      "Experience unparalleled quality with our flagship product, designed to exceed expectations.",
    imageUrl: null,
  },
  {
    id: "2",
    title: "Pro Toolset",
    description:
      "Empower your workflow with professional-grade tools built for maximum efficiency and speed.",
    imageUrl: null,
  },
  {
    id: "3",
    title: "Essential Kit",
    description:
      "Everything you need to get started, packaged into one convenient and accessible bundle.",
    imageUrl: null,
  },
  {
    id: "4",
    title: "Advanced Module",
    description:
      "Take your capabilities to the next level with our most robust and feature-rich module yet.",
    imageUrl: null,
  },
];

const mockServices = [
  {
    id: "1",
    title: "Consulting",
    description:
      "Expert advice tailored to your unique business needs and strategic objectives.",
    imageUrl: null,
  },
  {
    id: "2",
    title: "Development",
    description:
      "Custom solutions built with modern technologies to scale with your growth.",
    imageUrl: null,
  },
  {
    id: "3",
    title: "Design",
    description:
      "Beautiful, user-centric interfaces that engage and convert your audience.",
    imageUrl: null,
  },
  {
    id: "4",
    title: "Support",
    description:
      "24/7 dedicated assistance to ensure your operations run smoothly at all times.",
    imageUrl: null,
  },
];

export const enhanceHtmlAssignmentHandlers = [
  graphql.query("GetProducts", () => {
    return HttpResponse.json({
      data: {
        products: mockProducts,
      },
    });
  }),

  graphql.query("GetServices", () => {
    return HttpResponse.json({
      data: {
        services: mockServices,
      },
    });
  }),
];
