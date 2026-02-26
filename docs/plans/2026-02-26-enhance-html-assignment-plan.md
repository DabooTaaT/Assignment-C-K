# Enhance HTML Assignment — Implementation Plan (Second Page)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert `guideline-enhanced.html` into a React feature at `/enhance-html-assignment` with GraphQL API, MSW mocks, i18n, and Tailwind styling. This is the second page in the app (first page is `/` — see `2026-02-26-firstpage-design.md`).

**Architecture:** Feature-based MVC. Data flows: MSW mock -> Apollo Client -> controller hook -> view components. Each section is a separate view component assembled by the page component. This page has its own local Header/Footer (different design from the first page's shared layout).

**Tech Stack:** React 18, TypeScript, Apollo Client (GraphQL), MSW v2, Tailwind CSS, i18next, React Router v6

**Layout Note:** The first page plans to add shared Header/Footer to AppLayout. This page has a different header/footer design. AppLayout must stay minimal — the first page's shared Header/Footer should use a nested route layout instead.

---

### Task 1: Types & Interface

**Files:**
- Create: `src/features/enhanceHtmlAssignment/interface.ts`

**Step 1: Create the types file**

```typescript
export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface EnhanceHtmlAssignmentState {
  products: Product[];
  services: Service[];
  loading: boolean;
  error?: string;
}
```

**Step 2: Commit**

```bash
git add src/features/enhanceHtmlAssignment/interface.ts
git commit -m "feat(enhanceHtml): add Product, Service, and state types"
```

---

### Task 2: i18n — English Translations

**Files:**
- Create: `src/core/i18n/locales/en/enhanceHtml.json`

**Step 1: Create English translation file**

```json
{
  "header": {
    "logo": "BrandName",
    "nav": {
      "home": "Home",
      "product": "Product",
      "aboutUs": "About Us",
      "contactUs": "Contact Us"
    }
  },
  "products": {
    "sectionTitle": "Featured Products"
  },
  "services": {
    "sectionTitle": "Our Services",
    "learnMore": "Learn More"
  },
  "footer": {
    "copyright": "© 2026 BrandName. All rights reserved."
  }
}
```

**Step 2: Commit**

```bash
git add src/core/i18n/locales/en/enhanceHtml.json
git commit -m "feat(i18n): add English translations for enhanceHtml namespace"
```

---

### Task 3: i18n — Thai Translations

**Files:**
- Create: `src/core/i18n/locales/th/enhanceHtml.json`

**Step 1: Create Thai translation file**

```json
{
  "header": {
    "logo": "BrandName",
    "nav": {
      "home": "หน้าแรก",
      "product": "ผลิตภัณฑ์",
      "aboutUs": "เกี่ยวกับเรา",
      "contactUs": "ติดต่อเรา"
    }
  },
  "products": {
    "sectionTitle": "สินค้าแนะนำ"
  },
  "services": {
    "sectionTitle": "บริการของเรา",
    "learnMore": "เรียนรู้เพิ่มเติม"
  },
  "footer": {
    "copyright": "© 2026 BrandName สงวนลิขสิทธิ์"
  }
}
```

**Step 2: Commit**

```bash
git add src/core/i18n/locales/th/enhanceHtml.json
git commit -m "feat(i18n): add Thai translations for enhanceHtml namespace"
```

---

### Task 4: Register i18n Namespace

**Files:**
- Modify: `src/core/i18n/index.ts`

**Step 1: Add imports and register the new namespace**

Add these imports after the existing `thAuth` import:

```typescript
import enEnhanceHtml from "./locales/en/enhanceHtml.json";
import thEnhanceHtml from "./locales/th/enhanceHtml.json";
```

Add to the `resources` object inside `init()`:

```typescript
resources: {
  en: {
    common: unwrap(enCommon),
    auth: unwrap(enAuth),
    enhanceHtml: unwrap(enEnhanceHtml),  // ADD
  },
  th: {
    common: unwrap(thCommon),
    auth: unwrap(thAuth),
    enhanceHtml: unwrap(thEnhanceHtml),  // ADD
  },
},
```

**Step 2: Commit**

```bash
git add src/core/i18n/index.ts
git commit -m "feat(i18n): register enhanceHtml namespace"
```

---

### Task 5: GraphQL Queries

**Files:**
- Create: `src/features/enhanceHtmlAssignment/services/queries.ts`

**Step 1: Create GraphQL query definitions**

```typescript
import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      title
      description
      imageUrl
    }
  }
`;

export const GET_SERVICES = gql`
  query GetServices {
    services {
      id
      title
      description
      imageUrl
    }
  }
`;
```

**Step 2: Commit**

```bash
git add src/features/enhanceHtmlAssignment/services/queries.ts
git commit -m "feat(enhanceHtml): add GraphQL queries for products and services"
```

---

### Task 6: MSW Handlers

**Files:**
- Create: `src/core/data/mocks/handlers/enhanceHtmlAssignment.ts`
- Modify: `src/core/data/mocks/handlers/index.ts`

**Step 1: Create mock handlers with data from guideline**

```typescript
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
```

**Step 2: Register handlers in index.ts**

In `src/core/data/mocks/handlers/index.ts`, add the import and spread (existing handlers already include `authHandlers` and `homeHandlers`):

```typescript
import { authHandlers } from "./auth";
import { homeHandlers } from "./home";
import { enhanceHtmlAssignmentHandlers } from "./enhanceHtmlAssignment";

export const handlers = [...authHandlers, ...homeHandlers, ...enhanceHtmlAssignmentHandlers];
```

**Step 3: Commit**

```bash
git add src/core/data/mocks/handlers/enhanceHtmlAssignment.ts src/core/data/mocks/handlers/index.ts
git commit -m "feat(msw): add mock handlers for products and services queries"
```

---

### Task 7: Controller Hook

**Files:**
- Create: `src/features/enhanceHtmlAssignment/hooks/controller.ts`

**Step 1: Write the controller hook test**

Create `src/features/enhanceHtmlAssignment/hooks/controller.test.ts`:

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { useEnhanceHtmlAssignment } from "./controller";
import { GET_PRODUCTS, GET_SERVICES } from "../services/queries";
import type { ReactNode } from "react";

const mockProducts = [
  { id: "1", title: "Widget", description: "Desc", imageUrl: null },
];
const mockServices = [
  { id: "1", title: "Consulting", description: "Desc", imageUrl: null },
];

const mocks = [
  {
    request: { query: GET_PRODUCTS },
    result: { data: { products: mockProducts } },
  },
  {
    request: { query: GET_SERVICES },
    result: { data: { services: mockServices } },
  },
];

const wrapper = ({ children }: { children: ReactNode }) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    {children}
  </MockedProvider>
);

describe("useEnhanceHtmlAssignment", () => {
  it("returns products and services after loading", async () => {
    const { result } = renderHook(() => useEnhanceHtmlAssignment(), { wrapper });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.services).toEqual(mockServices);
    expect(result.current.error).toBeUndefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="enhanceHtmlAssignment/hooks/controller" --no-coverage`
Expected: FAIL — module not found

**Step 3: Implement the controller hook**

```typescript
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS, GET_SERVICES } from "../services/queries";
import type { Product, Service, EnhanceHtmlAssignmentState } from "../interface";

export const useEnhanceHtmlAssignment = (): EnhanceHtmlAssignmentState => {
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useQuery<{ products: Product[] }>(GET_PRODUCTS);

  const {
    data: servicesData,
    loading: servicesLoading,
    error: servicesError,
  } = useQuery<{ services: Service[] }>(GET_SERVICES);

  const loading = productsLoading || servicesLoading;
  const error = productsError?.message ?? servicesError?.message;

  return {
    products: productsData?.products ?? [],
    services: servicesData?.services ?? [],
    loading,
    error,
  };
};
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="enhanceHtmlAssignment/hooks/controller" --no-coverage`
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/enhanceHtmlAssignment/hooks/controller.ts src/features/enhanceHtmlAssignment/hooks/controller.test.ts
git commit -m "feat(enhanceHtml): add controller hook with useQuery for products and services"
```

---

### Task 8: Footer Component

**Files:**
- Create: `src/features/enhanceHtmlAssignment/views/Footer.tsx`

**Step 1: Write the test**

Create `src/features/enhanceHtmlAssignment/views/Footer.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "footer.copyright": "© 2026 BrandName. All rights reserved.",
      };
      return map[key] ?? key;
    },
  }),
}));

describe("Footer", () => {
  it("renders copyright text", () => {
    render(<Footer />);
    expect(
      screen.getByText("© 2026 BrandName. All rights reserved.")
    ).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="views/Footer" --no-coverage`
Expected: FAIL

**Step 3: Implement Footer**

```tsx
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation("enhanceHtml");

  return (
    <footer className="bg-slate-900 text-slate-400 text-center py-8 px-6 text-sm font-medium">
      {t("footer.copyright")}
    </footer>
  );
};
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="views/Footer" --no-coverage`
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/enhanceHtmlAssignment/views/Footer.tsx src/features/enhanceHtmlAssignment/views/Footer.test.tsx
git commit -m "feat(enhanceHtml): add Footer view component"
```

---

### Task 9: Header Component

**Files:**
- Create: `src/features/enhanceHtmlAssignment/views/Header.tsx`

**Step 1: Write the test**

Create `src/features/enhanceHtmlAssignment/views/Header.test.tsx`:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "header.logo": "BrandName",
        "header.nav.home": "Home",
        "header.nav.product": "Product",
        "header.nav.aboutUs": "About Us",
        "header.nav.contactUs": "Contact Us",
      };
      return map[key] ?? key;
    },
  }),
}));

describe("Header", () => {
  it("renders the logo", () => {
    render(<Header />);
    expect(screen.getByText("BrandName")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Header />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  it("toggles mobile menu on hamburger click", () => {
    render(<Header />);
    const menuButton = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(menuButton);
    // After click, mobile nav should be visible
    const nav = screen.getAllByRole("navigation");
    expect(nav.length).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="views/Header" --no-coverage`
Expected: FAIL

**Step 3: Implement Header**

```tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const navKeys = ["home", "product", "aboutUs", "contactUs"] as const;

export const Header = () => {
  const { t } = useTranslation("enhanceHtml");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
        <span className="text-xl font-extrabold uppercase tracking-wide bg-gradient-to-br from-blue-600 to-violet-500 bg-clip-text text-transparent">
          {t("header.logo")}
        </span>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden text-slate-800"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8">
          {navKeys.map((key) => (
            <a
              key={key}
              href="#"
              className="text-slate-500 text-sm font-semibold uppercase tracking-wide hover:text-blue-600 transition-colors"
            >
              {t(`header.nav.${key}`)}
            </a>
          ))}
        </nav>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <nav className="md:hidden border-t border-slate-200 px-6 pb-4">
          {navKeys.map((key) => (
            <a
              key={key}
              href="#"
              className="block py-2 text-slate-500 text-sm font-semibold uppercase tracking-wide hover:text-blue-600 transition-colors"
            >
              {t(`header.nav.${key}`)}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="views/Header" --no-coverage`
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/enhanceHtmlAssignment/views/Header.tsx src/features/enhanceHtmlAssignment/views/Header.test.tsx
git commit -m "feat(enhanceHtml): add Header view component with mobile menu toggle"
```

---

### Task 10: HeroSection Component

**Files:**
- Create: `src/features/enhanceHtmlAssignment/views/HeroSection.tsx`

**Step 1: Write the test**

Create `src/features/enhanceHtmlAssignment/views/HeroSection.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { HeroSection } from "./HeroSection";

describe("HeroSection", () => {
  it("renders the hero section with image placeholder", () => {
    const { container } = render(<HeroSection />);
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    // Has the placeholder SVG
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="views/HeroSection" --no-coverage`
Expected: FAIL

**Step 3: Implement HeroSection**

```tsx
export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-24 px-6 flex flex-col items-center justify-center text-center">
      {/* Decorative radial gradient */}
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_60%)] z-0" />

      <div className="relative z-10 w-full max-w-[800px]">
        <div className="mx-auto w-full max-w-[600px] h-80 md:h-80 bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center">
          <svg className="w-16 h-16 fill-slate-400" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
        </div>
      </div>
    </section>
  );
};
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="views/HeroSection" --no-coverage`
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/enhanceHtmlAssignment/views/HeroSection.tsx src/features/enhanceHtmlAssignment/views/HeroSection.test.tsx
git commit -m "feat(enhanceHtml): add HeroSection view component"
```

---

### Task 11: ProductsSection Component

**Files:**
- Create: `src/features/enhanceHtmlAssignment/views/ProductsSection.tsx`

**Step 1: Write the test**

Create `src/features/enhanceHtmlAssignment/views/ProductsSection.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { ProductsSection } from "./ProductsSection";
import type { Product } from "../interface";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "products.sectionTitle": "Featured Products",
      };
      return map[key] ?? key;
    },
  }),
}));

const products: Product[] = [
  { id: "1", title: "Widget A", description: "Desc A" },
  { id: "2", title: "Widget B", description: "Desc B" },
];

describe("ProductsSection", () => {
  it("renders section title", () => {
    render(<ProductsSection products={products} />);
    expect(screen.getByText("Featured Products")).toBeInTheDocument();
  });

  it("renders all product cards", () => {
    render(<ProductsSection products={products} />);
    expect(screen.getByText("Widget A")).toBeInTheDocument();
    expect(screen.getByText("Widget B")).toBeInTheDocument();
    expect(screen.getByText("Desc A")).toBeInTheDocument();
    expect(screen.getByText("Desc B")).toBeInTheDocument();
  });

  it("renders nothing when products is empty", () => {
    const { container } = render(<ProductsSection products={[]} />);
    expect(screen.getByText("Featured Products")).toBeInTheDocument();
    // No product cards
    expect(container.querySelectorAll("[data-testid='product-card']")).toHaveLength(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="views/ProductsSection" --no-coverage`
Expected: FAIL

**Step 3: Implement ProductsSection**

```tsx
import { useTranslation } from "react-i18next";
import type { Product } from "../interface";

interface ProductsSectionProps {
  products: Product[];
}

export const ProductsSection = ({ products }: ProductsSectionProps) => {
  const { t } = useTranslation("enhanceHtml");

  return (
    <section className="max-w-[1248px] mx-auto px-6 pb-16">
      <h2 className="text-center text-3xl font-extrabold text-slate-800 mt-20 mb-10 relative after:content-[''] after:block after:w-[60px] after:h-1 after:bg-blue-600 after:mx-auto after:mt-3 after:rounded">
        {t("products.sectionTitle")}
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            data-testid="product-card"
            className="bg-white rounded-xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[220px] shadow-sm border border-slate-200 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:border-slate-300"
          >
            {/* Image area */}
            <div className="w-full md:w-[45%] h-[180px] md:h-full bg-slate-100 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
              <svg
                className="w-12 h-12 fill-slate-400 transition-all duration-300 group-hover:fill-blue-600 group-hover:scale-110"
                viewBox="0 0 24 24"
              >
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </div>

            {/* Info area */}
            <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {product.title}
              </h3>
              <p className="text-[15px] text-slate-500">{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="views/ProductsSection" --no-coverage`
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/enhanceHtmlAssignment/views/ProductsSection.tsx src/features/enhanceHtmlAssignment/views/ProductsSection.test.tsx
git commit -m "feat(enhanceHtml): add ProductsSection view component with responsive grid"
```

---

### Task 12: ServicesSection Component

**Files:**
- Create: `src/features/enhanceHtmlAssignment/views/ServicesSection.tsx`

**Step 1: Write the test**

Create `src/features/enhanceHtmlAssignment/views/ServicesSection.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { ServicesSection } from "./ServicesSection";
import type { Service } from "../interface";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "services.sectionTitle": "Our Services",
        "services.learnMore": "Learn More",
      };
      return map[key] ?? key;
    },
  }),
}));

jest.mock("@/components/ui/Button", () => ({
  Button: ({ children, ...props }: React.ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));

const services: Service[] = [
  { id: "1", title: "Consulting", description: "Expert advice." },
  { id: "2", title: "Development", description: "Custom solutions." },
];

describe("ServicesSection", () => {
  it("renders section title", () => {
    render(<ServicesSection services={services} />);
    expect(screen.getByText("Our Services")).toBeInTheDocument();
  });

  it("renders all service cards with Learn More buttons", () => {
    render(<ServicesSection services={services} />);
    expect(screen.getByText("Consulting")).toBeInTheDocument();
    expect(screen.getByText("Development")).toBeInTheDocument();
    const buttons = screen.getAllByText("Learn More");
    expect(buttons).toHaveLength(2);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="views/ServicesSection" --no-coverage`
Expected: FAIL

**Step 3: Implement ServicesSection**

```tsx
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import type { Service } from "../interface";

interface ServicesSectionProps {
  services: Service[];
}

export const ServicesSection = ({ services }: ServicesSectionProps) => {
  const { t } = useTranslation("enhanceHtml");

  return (
    <section className="bg-white border-t border-slate-200 py-20 px-6">
      <div className="max-w-[1248px] mx-auto">
        <h2 className="text-center text-3xl font-extrabold text-slate-800 mb-10 relative after:content-[''] after:block after:w-[60px] after:h-1 after:bg-blue-600 after:mx-auto after:mt-3 after:rounded">
          {t("services.sectionTitle")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              data-testid="service-card"
              className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Image area */}
              <div className="h-[200px] bg-slate-100 flex items-center justify-center border-b border-slate-200">
                <svg
                  className="w-12 h-12 fill-slate-400 transition-all duration-300 group-hover:fill-blue-600 group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>

              {/* Info area */}
              <div className="p-6 flex-grow">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  {service.description}
                </p>
                <Button
                  variant="outlined"
                  fullWidth
                  className="uppercase tracking-wide text-sm font-semibold group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300"
                >
                  {t("services.learnMore")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="views/ServicesSection" --no-coverage`
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/enhanceHtmlAssignment/views/ServicesSection.tsx src/features/enhanceHtmlAssignment/views/ServicesSection.test.tsx
git commit -m "feat(enhanceHtml): add ServicesSection view component with responsive grid"
```

---

### Task 13: Page Component

**Files:**
- Create: `src/features/enhanceHtmlAssignment/EnhanceHtmlAssignmentPage.tsx`

**Step 1: Write the test**

Create `src/features/enhanceHtmlAssignment/EnhanceHtmlAssignmentPage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { EnhanceHtmlAssignmentPage } from "./EnhanceHtmlAssignmentPage";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("./hooks/controller", () => ({
  useEnhanceHtmlAssignment: () => ({
    products: [{ id: "1", title: "Widget", description: "Desc" }],
    services: [{ id: "1", title: "Consulting", description: "Desc" }],
    loading: false,
    error: undefined,
  }),
}));

jest.mock("@/components/ui/Button", () => ({
  Button: ({ children, ...props }: React.ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));

describe("EnhanceHtmlAssignmentPage", () => {
  it("renders all page sections", () => {
    const { container } = render(<EnhanceHtmlAssignmentPage />);
    // Header, Hero, Products, Services, Footer should all render
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelectorAll("section").length).toBeGreaterThanOrEqual(3);
    expect(container.querySelector("footer")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    jest.resetModules();
    jest.doMock("./hooks/controller", () => ({
      useEnhanceHtmlAssignment: () => ({
        products: [],
        services: [],
        loading: true,
        error: undefined,
      }),
    }));

    // Re-require to pick up new mock
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { EnhanceHtmlAssignmentPage: Page } = require("./EnhanceHtmlAssignmentPage");
    render(<Page />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="EnhanceHtmlAssignmentPage" --no-coverage`
Expected: FAIL

**Step 3: Implement the page component**

```tsx
import { useTranslation } from "react-i18next";
import { useEnhanceHtmlAssignment } from "./hooks/controller";
import { Header } from "./views/Header";
import { HeroSection } from "./views/HeroSection";
import { ProductsSection } from "./views/ProductsSection";
import { ServicesSection } from "./views/ServicesSection";
import { Footer } from "./views/Footer";

export const EnhanceHtmlAssignmentPage = () => {
  const { t } = useTranslation("common");
  const { products, services, loading, error } = useEnhanceHtmlAssignment();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500 text-lg">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">{t("error")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <HeroSection />
      <ProductsSection products={products} />
      <ServicesSection services={services} />
      <Footer />
    </div>
  );
};
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="EnhanceHtmlAssignmentPage" --no-coverage`
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/enhanceHtmlAssignment/EnhanceHtmlAssignmentPage.tsx src/features/enhanceHtmlAssignment/EnhanceHtmlAssignmentPage.test.tsx
git commit -m "feat(enhanceHtml): add page component assembling all sections"
```

---

### Task 14: Register Route

**Files:**
- Modify: `src/core/router/routes.ts`
- Modify: `src/core/router/index.tsx`

**Step 1: Add route constant**

In `src/core/router/routes.ts`, add to the `ROUTES` object:

```typescript
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  ENHANCE_HTML_ASSIGNMENT: "/enhance-html-assignment",
} as const;
```

**Step 2: Register the route in the router**

In `src/core/router/index.tsx`, add the import:

```typescript
import { EnhanceHtmlAssignmentPage } from "@/features/enhanceHtmlAssignment/EnhanceHtmlAssignmentPage";
```

Add the route as a public route (before the RequireAuth block):

```typescript
{ path: ROUTES.ENHANCE_HTML_ASSIGNMENT, element: <EnhanceHtmlAssignmentPage /> },
```

The full children array should look like:

```typescript
children: [
  { path: ROUTES.HOME, element: <HomePage /> },
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.REGISTER, element: <RegisterPage /> },
  { path: ROUTES.ENHANCE_HTML_ASSIGNMENT, element: <EnhanceHtmlAssignmentPage /> },
  {
    element: <RequireAuth />,
    children: [
      { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
      { path: ROUTES.PROFILE, element: <ProfilePage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
],
```

**Step 3: Commit**

```bash
git add src/core/router/routes.ts src/core/router/index.tsx
git commit -m "feat(router): register /enhance-html-assignment as public route"
```

---

### Task 15: Run All Tests & Verify Build

**Step 1: Run the full test suite**

Run: `npm test -- --no-coverage`
Expected: All tests pass (existing + new)

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Run lint**

Run: `npm run lint`
Expected: No lint errors (or fix any that appear)

**Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix(enhanceHtml): address lint/type issues from full verification"
```
