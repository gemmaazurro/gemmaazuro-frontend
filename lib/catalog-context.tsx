'use client';

// Catalog context.
//
// Nav taxonomy and a product sample are needed by client components that render
// on every page (Header's mega-menu, MobileNav, SearchOverlay). Threading them
// as props through StorefrontShell and every page would touch every route, so
// they are fetched ONCE server-side in app/layout.tsx and hydrated here.
//
// This holds anonymous catalog data only — never anything user-scoped.

import { createContext, useContext, type ReactNode } from 'react';
import type { Product } from './data';
import type { NavGroup, SubGroupSummary } from './products-cache';

export interface CatalogValue {
  navGroups: NavGroup[];
  subgroups: SubGroupSummary[];
  /** A small sample used for mega-menu cards and search suggestions. */
  products: Product[];
}

const EMPTY: CatalogValue = { navGroups: [], subgroups: [], products: [] };

const CatalogContext = createContext<CatalogValue>(EMPTY);

export function CatalogProvider({
  value,
  children,
}: {
  value: CatalogValue;
  children: ReactNode;
}) {
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogValue {
  return useContext(CatalogContext);
}

/** Category names for filter chips and mobile nav. */
export function useCategories(): string[] {
  const { subgroups } = useCatalog();
  return ['All', ...subgroups.map((subgroup) => subgroup.name)];
}
