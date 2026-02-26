import { graphql, HttpResponse } from "msw";

export const homeHandlers = [
  graphql.query("GetHomePageData", () => {
    return HttpResponse.json({
      data: {
        products: [
          { id: "1", name: "Product Alpha", detail: "High-performance solution", imageUrl: "" },
          { id: "2", name: "Product Beta", detail: "Cost-effective choice", imageUrl: "" },
          { id: "3", name: "Product Gamma", detail: "Enterprise-grade platform", imageUrl: "" },
          { id: "4", name: "Product Delta", detail: "Next-gen technology", imageUrl: "" },
        ],
        services: [
          { id: "1", name: "Consulting", detail: "Expert guidance for your business", imageUrl: "" },
          { id: "2", name: "Development", detail: "Custom software solutions", imageUrl: "" },
          { id: "3", name: "Support", detail: "24/7 technical assistance", imageUrl: "" },
          { id: "4", name: "Training", detail: "Hands-on workshops and courses", imageUrl: "" },
        ],
      },
    });
  }),
];
