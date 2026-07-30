// Server half of the storefront shell.
//
// Every page already wraps itself in <StorefrontShell>, so resolving the chrome
// content here means the footer, promo bar and contact details are fetched in
// one place instead of once per page — and through the `use cache` readers in
// lib/api/cms.ts, so it costs nothing per request.
//
// The interactive parts live in StorefrontShellClient. Keeping this file's name
// means no page had to change its import.

import type { ReactNode } from 'react';
import StorefrontShellClient from './StorefrontShellClient';
import {
  getAnnouncements,
  getBranches,
  getContactDetails,
  getFooter,
  getNav,
  getPaymentMethods,
} from '@/lib/api/cms';
import { pageHref } from '@/lib/api/page-routes';

export default async function StorefrontShell({ children }: { children: ReactNode }) {
  const [promo, footer, paymentMethods, contact, branches, nav] = await Promise.all([
    getAnnouncements('promo'),
    getFooter(),
    getPaymentMethods(),
    getContactDetails(),
    getBranches(),
    getNav(),
  ]);

  return (
    <StorefrontShellClient
      promoMessages={promo.map((row) => row.content)}
      footer={footer}
      // The footer already nests payment methods, but they are also editable on
      // their own page — prefer the standalone list when it has rows.
      paymentMethods={
        paymentMethods.length ? paymentMethods : footer?.section3_payment_methods ?? []
      }
      contact={contact}
      branch={branches[0] ?? null}
      navGroupIds={nav?.groups_display?.map((group) => group.id) ?? []}
      navPages={nav?.pages_display?.map((page) => ({
        label: page.title,
        href: pageHref(page.slug),
      })) ?? []}
    >
      {children}
    </StorefrontShellClient>
  );
}
