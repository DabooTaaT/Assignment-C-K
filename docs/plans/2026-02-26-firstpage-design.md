# Firstpage (Homepage) Design

**Date:** 2026-02-26
**Route:** `/`
**Guideline:** `guideline.html`

## Overview

Landing page matching the HTML guideline layout. Features a shared Header/Footer, hero banner, product grid, and services grid. Data fetched via GraphQL with MSW mocks for development.

## Component Structure

```
src/
├── components/layout/
│   ├── AppLayout.tsx          # Update: wrap Outlet with Header + Footer
│   ├── Header.tsx             # Top bar + scroll-to-section nav
│   └── Footer.tsx             # Copyright bar
├── features/home/
│   ├── components/
│   │   ├── HeroSection.tsx    # Hero banner placeholder
│   │   ├── ProductSection.tsx # Title + grid of ProductCards
│   │   ├── ProductCard.tsx    # Horizontal card (image left, info right)
│   │   ├── ServiceSection.tsx # Title + grid of ServiceCards
│   │   └── ServiceCard.tsx    # Vertical card (image, info, MORE button)
│   ├── hooks/
│   │   └── controller.ts     # useHome() — fetches products + services
│   ├── services/
│   │   └── queries.ts        # GraphQL queries
│   ├── interface.ts           # Product & Service types
│   └── HomePage.tsx           # Composes sections, passes data
```

## Data Model

```ts
interface Product {
  id: string;
  name: string;
  detail: string;
  imageUrl: string;
}

interface Service {
  id: string;
  name: string;
  detail: string;
  imageUrl: string;
}

interface HomePageData {
  products: Product[];
  services: Service[];
}
```

## GraphQL

```graphql
query GetHomePageData {
  products { id name detail imageUrl }
  services { id name detail imageUrl }
}
```

MSW handler returns 4 products and 4 services with placeholder data.

## Layout Sections

### Header (shared — `components/layout/Header.tsx`)
- Top bar: `bg-[#4096ff]`, white text, "NAME PAGE" left, hamburger icon right (mobile only)
- Nav bar: `bg-[#3e7ced]`, links: HOME | PRODUCT | ABOUT US | CONTACT US
- Links use `scrollIntoView({ behavior: 'smooth' })` targeting section IDs
- Mobile (< 768px): hamburger shows, nav bar hides

### Hero (`HeroSection.tsx`)
- `bg-[#8c8c8c]`, h-[400px] desktop / h-[250px] mobile
- Centered image placeholder icon (SVG)

### Product Section (`ProductSection.tsx` + `ProductCard.tsx`)
- Title: "PRODUCT" — blue, centered, uppercase
- Grid: 2 columns desktop, 1 column mobile, max-w-[1200px]
- ProductCard: uses `Card` component — horizontal layout with image (50%) + info (50%)

### Service Section (`ServiceSection.tsx` + `ServiceCard.tsx`)
- Background: `bg-[#dbeafe]` (light blue)
- Title: "SERVICE" — blue, centered, uppercase
- Grid: 4 columns desktop, 2 columns mobile, max-w-[1200px]
- ServiceCard: uses `Card` + `Button` — vertical layout with image top, info middle, "MORE" button bottom
- Button: `bg-[#4096ff]`, full-width, uppercase

### Footer (shared — `components/layout/Footer.tsx`)
- `bg-[#4096ff]`, white text, centered "Copyright"

## Responsive

Single breakpoint at `md:` (768px) matching `guideline.html`:
- Header: hamburger visible, nav hidden
- Hero: reduced height
- Products: 1 column
- Services: 2 columns

## Data Flow

```
HomePage
  └── useHome() → Apollo useQuery(GET_HOME_PAGE_DATA)
        ├── products → ProductSection → ProductCard[]
        └── services → ServiceSection → ServiceCard[]
```

## Reused UI Components
- `Card` from `@/components/ui/Card`
- `Button` from `@/components/ui/Button`

## Decisions
- Header/Footer are shared layout components (in AppLayout)
- Nav links scroll to page sections (not separate routes)
- "MORE" button renders but has no action yet (placeholder)
- Data is dynamic via GraphQL + MSW mocks
