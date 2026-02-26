# Firstpage (Homepage) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the homepage at route `/` matching `guideline.html`, with shared Header/Footer, dynamic product/service data via GraphQL + MSW mocks.

**Architecture:** Feature-based MVC. HomePage composes HeroSection, ProductSection, ServiceSection. Data flows from Apollo `useQuery` in `useHome()` controller hook, passed as props to view components. Header/Footer are shared layout components in AppLayout.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Apollo Client (useQuery), MSW v2 (graphql handlers), MUI wrappers (Card, Button), i18next, Jest + RTL.

---

### Task 1: Define Types and GraphQL Query

**Files:**
- Modify: `src/features/home/interface.ts`
- Create: `src/features/home/services/queries.ts`

**Step 1: Add types to interface.ts**

```ts
// src/features/home/interface.ts
export interface Product {
  id: string;
  name: string;
  detail: string;
  imageUrl: string;
}

export interface Service {
  id: string;
  name: string;
  detail: string;
  imageUrl: string;
}

export interface HomePageData {
  products: Product[];
  services: Service[];
}
```

**Step 2: Create GraphQL query**

```ts
// src/features/home/services/queries.ts
import { gql } from "@apollo/client";

export const GET_HOME_PAGE_DATA = gql`
  query GetHomePageData {
    products {
      id
      name
      detail
      imageUrl
    }
    services {
      id
      name
      detail
      imageUrl
    }
  }
`;
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/features/home/interface.ts src/features/home/services/queries.ts
git commit -m "feat(home): add Product/Service types and GraphQL query"
```

---

### Task 2: Create MSW Mock Handler

**Files:**
- Create: `src/core/data/mocks/handlers/home.ts`
- Modify: `src/core/data/mocks/handlers/index.ts`

**Step 1: Create home handler with 4 products and 4 services**

```ts
// src/core/data/mocks/handlers/home.ts
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
```

**Step 2: Register handler in index.ts**

```ts
// src/core/data/mocks/handlers/index.ts
import { authHandlers } from "./auth";
import { homeHandlers } from "./home";

export const handlers = [...authHandlers, ...homeHandlers];
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/core/data/mocks/handlers/home.ts src/core/data/mocks/handlers/index.ts
git commit -m "feat(mocks): add MSW handler for homepage products and services"
```

---

### Task 3: Footer Component (TDD)

**Files:**
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/Footer.test.tsx`

**Step 1: Write the failing test**

```tsx
// src/components/layout/Footer.test.tsx
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";

describe("Footer", () => {
  it("renders copyright text", () => {
    render(<Footer />);
    expect(screen.getByText(/copyright/i)).toBeInTheDocument();
  });

  it("has the correct background color class", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("bg-[#4096ff]");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/components/layout/Footer.test.tsx --no-coverage`
Expected: FAIL — module not found

**Step 3: Write the Footer component**

```tsx
// src/components/layout/Footer.tsx
export const Footer = () => (
  <footer className="bg-[#4096ff] text-white text-center py-4 text-xs">
    Copyright
  </footer>
);
```

**Step 4: Run test to verify it passes**

Run: `npx jest src/components/layout/Footer.test.tsx --no-coverage`
Expected: PASS (2 tests)

**Step 5: Commit**

```bash
git add src/components/layout/Footer.tsx src/components/layout/Footer.test.tsx
git commit -m "feat(layout): add Footer component with TDD"
```

---

### Task 4: Header Component (TDD)

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Header.test.tsx`

**Step 1: Write the failing test**

```tsx
// src/components/layout/Header.test.tsx
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/layout/Header";

describe("Header", () => {
  it("renders the site name", () => {
    render(<Header />);
    expect(screen.getByText("NAME PAGE")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Header />);
    expect(screen.getByText("HOME")).toBeInTheDocument();
    expect(screen.getByText("PRODUCT")).toBeInTheDocument();
    expect(screen.getByText("ABOUT US")).toBeInTheDocument();
    expect(screen.getByText("CONTACT US")).toBeInTheDocument();
  });

  it("renders the hamburger menu icon", () => {
    render(<Header />);
    expect(screen.getByLabelText("Toggle menu")).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/components/layout/Header.test.tsx --no-coverage`
Expected: FAIL — module not found

**Step 3: Write the Header component**

```tsx
// src/components/layout/Header.tsx
import { useState } from "react";

const NAV_ITEMS = [
  { label: "HOME", sectionId: "hero" },
  { label: "PRODUCT", sectionId: "products" },
  { label: "ABOUT US", sectionId: "services" },
  { label: "CONTACT US", sectionId: "footer" },
];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header>
      {/* Top bar */}
      <div className="bg-[#4096ff] text-white px-5 py-4 flex justify-between items-center text-sm uppercase">
        <div>NAME PAGE</div>
        <button
          className="md:hidden text-xl cursor-pointer bg-transparent border-none text-white"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      {/* Nav bar */}
      <nav
        className={`bg-[#3e7ced] text-white px-5 py-2.5 text-xs uppercase ${
          menuOpen ? "block" : "hidden md:block"
        }`}
      >
        {NAV_ITEMS.map((item, i) => (
          <span key={item.sectionId}>
            <button
              onClick={() => scrollTo(item.sectionId)}
              className="bg-transparent border-none text-white cursor-pointer hover:underline"
            >
              {item.label}
            </button>
            {i < NAV_ITEMS.length - 1 && <span className="mx-2.5">|</span>}
          </span>
        ))}
      </nav>
    </header>
  );
};
```

**Step 4: Run test to verify it passes**

Run: `npx jest src/components/layout/Header.test.tsx --no-coverage`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/Header.test.tsx
git commit -m "feat(layout): add Header component with scroll-to-section nav"
```

---

### Task 5: Update AppLayout with Header + Footer

**Files:**
- Modify: `src/components/layout/AppLayout.tsx`

**Step 1: Update AppLayout to include Header and Footer**

```tsx
// src/components/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "@/core/middleware/ErrorBoundary";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const AppLayout = () => (
  <ErrorBoundary>
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  </ErrorBoundary>
);
```

**Step 2: Run existing tests to make sure nothing breaks**

Run: `npx jest --no-coverage`
Expected: All existing tests PASS

**Step 3: Commit**

```bash
git add src/components/layout/AppLayout.tsx
git commit -m "feat(layout): wrap AppLayout with Header and Footer"
```

---

### Task 6: HeroSection Component (TDD)

**Files:**
- Create: `src/features/home/components/HeroSection.tsx`
- Create: `src/features/home/components/HeroSection.test.tsx`

**Step 1: Write the failing test**

```tsx
// src/features/home/components/HeroSection.test.tsx
import { render } from "@testing-library/react";
import { HeroSection } from "@/features/home/components/HeroSection";

describe("HeroSection", () => {
  it("renders with the correct section id", () => {
    const { container } = render(<HeroSection />);
    expect(container.querySelector("#hero")).toBeInTheDocument();
  });

  it("renders the placeholder image icon", () => {
    const { container } = render(<HeroSection />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/features/home/components/HeroSection.test.tsx --no-coverage`
Expected: FAIL — module not found

**Step 3: Write the HeroSection component**

```tsx
// src/features/home/components/HeroSection.tsx
const ImagePlaceholder = () => (
  <svg className="w-8 h-8 fill-[#555]" viewBox="0 0 24 24">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
  </svg>
);

export const HeroSection = () => (
  <section
    id="hero"
    className="bg-[#8c8c8c] h-[250px] md:h-[400px] flex justify-center items-center"
  >
    <ImagePlaceholder />
  </section>
);
```

**Step 4: Run test to verify it passes**

Run: `npx jest src/features/home/components/HeroSection.test.tsx --no-coverage`
Expected: PASS (2 tests)

**Step 5: Commit**

```bash
git add src/features/home/components/HeroSection.tsx src/features/home/components/HeroSection.test.tsx
git commit -m "feat(home): add HeroSection component"
```

---

### Task 7: ProductCard Component (TDD)

**Files:**
- Create: `src/features/home/components/ProductCard.tsx`
- Create: `src/features/home/components/ProductCard.test.tsx`

**Step 1: Write the failing test**

```tsx
// src/features/home/components/ProductCard.test.tsx
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/features/home/components/ProductCard";

const mockProduct = {
  id: "1",
  name: "Test Product",
  detail: "Test detail text",
  imageUrl: "",
};

describe("ProductCard", () => {
  it("renders product name", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("renders product detail", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Test detail text")).toBeInTheDocument();
  });

  it("renders as a horizontal card layout", () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    // The card should have a flex row layout
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("flex");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/features/home/components/ProductCard.test.tsx --no-coverage`
Expected: FAIL — module not found

**Step 3: Write the ProductCard component**

```tsx
// src/features/home/components/ProductCard.tsx
import type { Product } from "@/features/home/interface";

const ImagePlaceholder = () => (
  <svg className="w-8 h-8 fill-[#555]" viewBox="0 0 24 24">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
  </svg>
);

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => (
  <div className="flex h-[180px] md:h-[200px] bg-white border border-[#ddd] shadow-sm">
    <div className="bg-[#8c8c8c] w-1/2 flex justify-center items-center">
      <ImagePlaceholder />
    </div>
    <div className="p-5 w-1/2">
      <h3 className="text-lg text-[#333] mb-1">{product.name}</h3>
      <p className="text-sm text-[#4096ff]">{product.detail}</p>
    </div>
  </div>
);
```

**Step 4: Run test to verify it passes**

Run: `npx jest src/features/home/components/ProductCard.test.tsx --no-coverage`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/features/home/components/ProductCard.tsx src/features/home/components/ProductCard.test.tsx
git commit -m "feat(home): add ProductCard component with horizontal layout"
```

---

### Task 8: ProductSection Component (TDD)

**Files:**
- Create: `src/features/home/components/ProductSection.tsx`
- Create: `src/features/home/components/ProductSection.test.tsx`

**Step 1: Write the failing test**

```tsx
// src/features/home/components/ProductSection.test.tsx
import { render, screen } from "@testing-library/react";
import { ProductSection } from "@/features/home/components/ProductSection";

const mockProducts = [
  { id: "1", name: "Product A", detail: "Detail A", imageUrl: "" },
  { id: "2", name: "Product B", detail: "Detail B", imageUrl: "" },
];

describe("ProductSection", () => {
  it("renders the PRODUCT title", () => {
    render(<ProductSection products={mockProducts} />);
    expect(screen.getByText("PRODUCT")).toBeInTheDocument();
  });

  it("renders all product cards", () => {
    render(<ProductSection products={mockProducts} />);
    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
  });

  it("has the correct section id for scroll navigation", () => {
    const { container } = render(<ProductSection products={mockProducts} />);
    expect(container.querySelector("#products")).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/features/home/components/ProductSection.test.tsx --no-coverage`
Expected: FAIL — module not found

**Step 3: Write the ProductSection component**

```tsx
// src/features/home/components/ProductSection.tsx
import type { Product } from "@/features/home/interface";
import { ProductCard } from "@/features/home/components/ProductCard";

interface ProductSectionProps {
  products: Product[];
}

export const ProductSection = ({ products }: ProductSectionProps) => (
  <section id="products">
    <h2 className="text-[#3e7ced] text-center my-10 text-[28px] font-bold uppercase">
      PRODUCT
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[1200px] mx-auto mb-12 px-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </section>
);
```

**Step 4: Run test to verify it passes**

Run: `npx jest src/features/home/components/ProductSection.test.tsx --no-coverage`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/features/home/components/ProductSection.tsx src/features/home/components/ProductSection.test.tsx
git commit -m "feat(home): add ProductSection with 2-column responsive grid"
```

---

### Task 9: ServiceCard Component (TDD)

**Files:**
- Create: `src/features/home/components/ServiceCard.tsx`
- Create: `src/features/home/components/ServiceCard.test.tsx`

**Step 1: Write the failing test**

```tsx
// src/features/home/components/ServiceCard.test.tsx
import { render, screen } from "@testing-library/react";
import { ServiceCard } from "@/features/home/components/ServiceCard";

const mockService = {
  id: "1",
  name: "Test Service",
  detail: "Test service detail",
  imageUrl: "",
};

describe("ServiceCard", () => {
  it("renders service name", () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText("Test Service")).toBeInTheDocument();
  });

  it("renders service detail", () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText("Test service detail")).toBeInTheDocument();
  });

  it("renders the MORE button", () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByRole("button", { name: /more/i })).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/features/home/components/ServiceCard.test.tsx --no-coverage`
Expected: FAIL — module not found

**Step 3: Write the ServiceCard component**

```tsx
// src/features/home/components/ServiceCard.tsx
import { Button } from "@/components/ui/Button";
import type { Service } from "@/features/home/interface";

const ImagePlaceholder = () => (
  <svg className="w-8 h-8 fill-[#555]" viewBox="0 0 24 24">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
  </svg>
);

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard = ({ service }: ServiceCardProps) => (
  <div className="flex flex-col bg-white border border-[#c9defc] shadow-sm">
    <div className="bg-[#8c8c8c] h-[150px] md:h-[180px] flex justify-center items-center">
      <ImagePlaceholder />
    </div>
    <div className="p-5 flex-1">
      <h3 className="text-lg text-[#333] mb-1">{service.name}</h3>
      <p className="text-sm text-[#4096ff]">{service.detail}</p>
    </div>
    <Button
      variant="contained"
      fullWidth
      sx={{
        backgroundColor: "#4096ff",
        borderRadius: 0,
        textTransform: "uppercase",
        "&:hover": { backgroundColor: "#3e7ced" },
      }}
    >
      MORE
    </Button>
  </div>
);
```

**Step 4: Run test to verify it passes**

Run: `npx jest src/features/home/components/ServiceCard.test.tsx --no-coverage`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/features/home/components/ServiceCard.tsx src/features/home/components/ServiceCard.test.tsx
git commit -m "feat(home): add ServiceCard component with MORE button"
```

---

### Task 10: ServiceSection Component (TDD)

**Files:**
- Create: `src/features/home/components/ServiceSection.tsx`
- Create: `src/features/home/components/ServiceSection.test.tsx`

**Step 1: Write the failing test**

```tsx
// src/features/home/components/ServiceSection.test.tsx
import { render, screen } from "@testing-library/react";
import { ServiceSection } from "@/features/home/components/ServiceSection";

const mockServices = [
  { id: "1", name: "Service A", detail: "Detail A", imageUrl: "" },
  { id: "2", name: "Service B", detail: "Detail B", imageUrl: "" },
];

describe("ServiceSection", () => {
  it("renders the SERVICE title", () => {
    render(<ServiceSection services={mockServices} />);
    expect(screen.getByText("SERVICE")).toBeInTheDocument();
  });

  it("renders all service cards", () => {
    render(<ServiceSection services={mockServices} />);
    expect(screen.getByText("Service A")).toBeInTheDocument();
    expect(screen.getByText("Service B")).toBeInTheDocument();
  });

  it("has the correct section id for scroll navigation", () => {
    const { container } = render(<ServiceSection services={mockServices} />);
    expect(container.querySelector("#services")).toBeInTheDocument();
  });

  it("has the light blue background", () => {
    const { container } = render(<ServiceSection services={mockServices} />);
    const section = container.querySelector("#services");
    expect(section).toHaveClass("bg-[#dbeafe]");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/features/home/components/ServiceSection.test.tsx --no-coverage`
Expected: FAIL — module not found

**Step 3: Write the ServiceSection component**

```tsx
// src/features/home/components/ServiceSection.tsx
import type { Service } from "@/features/home/interface";
import { ServiceCard } from "@/features/home/components/ServiceCard";

interface ServiceSectionProps {
  services: Service[];
}

export const ServiceSection = ({ services }: ServiceSectionProps) => (
  <section id="services" className="bg-[#dbeafe] py-8 px-5">
    <h2 className="text-[#3e7ced] text-center mb-8 text-[28px] font-bold uppercase">
      SERVICE
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-[1200px] mx-auto">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  </section>
);
```

**Step 4: Run test to verify it passes**

Run: `npx jest src/features/home/components/ServiceSection.test.tsx --no-coverage`
Expected: PASS (4 tests)

**Step 5: Commit**

```bash
git add src/features/home/components/ServiceSection.tsx src/features/home/components/ServiceSection.test.tsx
git commit -m "feat(home): add ServiceSection with 4-column responsive grid"
```

---

### Task 11: Home Controller Hook (TDD)

**Files:**
- Modify: `src/features/home/hooks/controller.ts` (currently empty — treat as create)
- Create: `src/features/home/hooks/controller.test.ts`

**Note:** The controller currently lives at `src/features/home/controller.ts` (empty). Per the design, it should be in `src/features/home/hooks/controller.ts`. Check which path is used by the router and adjust accordingly. If the router imports from `src/features/home/HomePage.tsx` directly (and HomePage will call the hook internally), we can place the hook at the `hooks/` path.

**Step 1: Write the failing test**

```ts
// src/features/home/hooks/controller.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import type { ReactNode } from "react";
import { useHome } from "@/features/home/hooks/controller";
import { GET_HOME_PAGE_DATA } from "@/features/home/services/queries";

const mockData = {
  products: [
    { id: "1", name: "P1", detail: "D1", imageUrl: "" },
  ],
  services: [
    { id: "1", name: "S1", detail: "D1", imageUrl: "" },
  ],
};

const mocks = [
  {
    request: { query: GET_HOME_PAGE_DATA },
    result: { data: mockData },
  },
];

const wrapper = ({ children }: { children: ReactNode }) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    {children}
  </MockedProvider>
);

describe("useHome", () => {
  it("returns loading true initially", () => {
    const { result } = renderHook(() => useHome(), { wrapper });
    expect(result.current.loading).toBe(true);
  });

  it("returns products and services after loading", async () => {
    const { result } = renderHook(() => useHome(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.products).toEqual(mockData.products);
    expect(result.current.services).toEqual(mockData.services);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/features/home/hooks/controller.test.ts --no-coverage`
Expected: FAIL — useHome not found

**Step 3: Create the hooks directory and write the controller**

```ts
// src/features/home/hooks/controller.ts
import { useQuery } from "@apollo/client";
import { GET_HOME_PAGE_DATA } from "@/features/home/services/queries";
import type { HomePageData } from "@/features/home/interface";

export const useHome = () => {
  const { data, loading, error } = useQuery<HomePageData>(GET_HOME_PAGE_DATA);

  return {
    products: data?.products ?? [],
    services: data?.services ?? [],
    loading,
    error,
  };
};
```

**Step 4: Run test to verify it passes**

Run: `npx jest src/features/home/hooks/controller.test.ts --no-coverage`
Expected: PASS (2 tests)

**Step 5: Commit**

```bash
git add src/features/home/hooks/controller.ts src/features/home/hooks/controller.test.ts src/features/home/services/queries.ts
git commit -m "feat(home): add useHome controller hook with Apollo query"
```

---

### Task 12: Compose HomePage (TDD)

**Files:**
- Modify: `src/features/home/HomePage.tsx`
- Create: `src/features/home/HomePage.test.tsx`

**Step 1: Write the failing test**

```tsx
// src/features/home/HomePage.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { HomePage } from "@/features/home/HomePage";
import { GET_HOME_PAGE_DATA } from "@/features/home/services/queries";

const mockData = {
  products: [
    { id: "1", name: "Product A", detail: "Detail A", imageUrl: "" },
  ],
  services: [
    { id: "1", name: "Service A", detail: "Detail A", imageUrl: "" },
  ],
};

const mocks = [
  {
    request: { query: GET_HOME_PAGE_DATA },
    result: { data: mockData },
  },
];

const renderHomePage = () =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <HomePage />
    </MockedProvider>
  );

describe("HomePage", () => {
  it("shows loading state initially", () => {
    renderHomePage();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders hero, products, and services after data loads", async () => {
    const { container } = renderHomePage();
    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
    });
    expect(screen.getByText("PRODUCT")).toBeInTheDocument();
    expect(screen.getByText("SERVICE")).toBeInTheDocument();
    expect(screen.getByText("Service A")).toBeInTheDocument();
    expect(container.querySelector("#hero")).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/features/home/HomePage.test.tsx --no-coverage`
Expected: FAIL — HomePage does not render expected content

**Step 3: Rewrite HomePage to compose all sections**

```tsx
// src/features/home/HomePage.tsx
import { useHome } from "@/features/home/hooks/controller";
import { HeroSection } from "@/features/home/components/HeroSection";
import { ProductSection } from "@/features/home/components/ProductSection";
import { ServiceSection } from "@/features/home/components/ServiceSection";

export const HomePage = () => {
  const { products, services, loading, error } = useHome();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Something went wrong</div>;
  }

  return (
    <>
      <HeroSection />
      <ProductSection products={products} />
      <ServiceSection services={services} />
    </>
  );
};
```

**Step 4: Run test to verify it passes**

Run: `npx jest src/features/home/HomePage.test.tsx --no-coverage`
Expected: PASS (2 tests)

**Step 5: Commit**

```bash
git add src/features/home/HomePage.tsx src/features/home/HomePage.test.tsx
git commit -m "feat(home): compose HomePage with Hero, Products, and Services sections"
```

---

### Task 13: Full Test Suite & Final Verification

**Files:** None new — just verification.

**Step 1: Run full test suite**

Run: `npx jest --no-coverage`
Expected: All tests PASS (existing + new)

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Run lint**

Run: `npm run lint`
Expected: No errors (fix any issues found)

**Step 4: Test dev server**

Run: `npm run dev` (manual verification — open browser, confirm layout matches guideline.html)

**Step 5: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 6: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "chore: fix lint/type issues from homepage implementation"
```
