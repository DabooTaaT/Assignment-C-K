# Enhance HTML Assignment — Feature Design

**Date:** 2026-02-26
**Route:** `/enhance-html-assignment`
**Auth:** Public (no authentication required)
**Guideline:** `guideline-enhanced.html` (root of repo)

## Overview

Convert the static HTML guideline into a React feature page following the project's MVC conventions. The page is a landing/marketing page with 5 sections: Header, Hero, Products, Services, Footer. Product and service data comes from a GraphQL API backed by MSW mocks.

## Feature Structure

```
src/features/enhanceHtmlAssignment/
├── EnhanceHtmlAssignmentPage.tsx       # Page component, assembles all sections
├── interface.ts                         # Product, Service types
├── hooks/
│   └── controller.ts                    # useEnhanceHtmlAssignment() hook
├── services/
│   └── queries.ts                       # GraphQL queries
└── views/
    ├── Header.tsx                       # Sticky header with logo + nav
    ├── HeroSection.tsx                  # Gradient hero with image placeholder
    ├── ProductsSection.tsx              # Products grid
    ├── ServicesSection.tsx              # Services grid
    └── Footer.tsx                       # Dark footer with copyright
```

## Routing

- Add `ENHANCE_HTML_ASSIGNMENT: "/enhance-html-assignment"` to `ROUTES` in `src/core/router/routes.ts`
- Register as a public route in `src/core/router/index.tsx` (alongside HOME, LOGIN, REGISTER)

## Data Model

### Types (`interface.ts`)

```typescript
interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}
```

### GraphQL Queries (`services/queries.ts`)

- `GET_PRODUCTS` — returns `Product[]`
- `GET_SERVICES` — returns `Service[]`

### Controller Hook (`hooks/controller.ts`)

- `useEnhanceHtmlAssignment()` — uses Apollo `useQuery` for both queries
- Returns `{ products, services, loading, error }`

### MSW Handlers (`src/core/data/mocks/handlers/enhanceHtmlAssignment.ts`)

Mock GraphQL operations returning the 4 products and 4 services from the HTML guideline:

**Products:**
1. Premium Widget
2. Pro Toolset
3. Essential Kit
4. Advanced Module

**Services:**
1. Consulting
2. Development
3. Design
4. Support

## Component Design

### Styling

- **Tailwind only** — all styling via utility classes
- Use `cn()` from `@/lib/utils` for class composition
- No custom CSS files

### Header.tsx

- Sticky top bar with backdrop blur (`sticky top-0 z-50 bg-white/85 backdrop-blur-lg`)
- Logo: gradient text (`bg-gradient-to-br from-blue-600 to-violet-500 bg-clip-text text-transparent`)
- Desktop: horizontal nav links with hover color transition
- Mobile (< md): hamburger icon, nav hidden, toggle via local `useState`

### HeroSection.tsx

- Full-width gradient background (`bg-gradient-to-br from-blue-50 to-indigo-100`)
- Centered image placeholder box with rounded corners and shadow
- Radial gradient decorative overlay

### ProductsSection.tsx

- Receives `products: Product[]` as prop
- Section title with blue underline decoration
- Responsive grid: 2 columns (xl+), 1 column (mobile)
- Product card: horizontal layout — image area (45%) + info area (55%)
- Mobile: card stacks vertically (image on top, info below)
- Hover: translateY(-4px) + elevated shadow

### ServicesSection.tsx

- Receives `services: Service[]` as prop
- Section title with blue underline decoration
- Responsive grid: 4 columns (xl), 2 columns (md), 1 column (mobile)
- Service card: vertical layout — image top + info + button bottom
- Uses `Button` from `@/components/ui/Button` for "Learn More"
- Hover: translateY(-8px) + button color change

### Footer.tsx

- Dark background (`bg-slate-900`)
- Centered copyright text in muted color

### Loading & Error States

- Show loading indicator while GraphQL queries load
- Show error message if queries fail

## i18n

**Namespace:** `enhanceHtml`

### Translation Files

- `src/core/i18n/locales/en/enhanceHtml.json`
- `src/core/i18n/locales/th/enhanceHtml.json`

### Keys

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

Product/service titles and descriptions come from the API, not i18n.

## Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth | Public route | Landing/marketing page, no auth needed |
| Styling | Tailwind only | Consistency with project, no custom CSS |
| Layout | Local to feature | Header/Footer are feature-specific, no impact on other pages |
| Data | GraphQL + MSW mocks | Proper API layer matching project's Apollo setup |
| Structure | Section sub-components | Clean MVC, each section is a focused view component |
| i18n | Yes, `enhanceHtml` namespace | Matches project convention for feature-specific translations |
