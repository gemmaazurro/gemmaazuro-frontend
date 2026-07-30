import AccountContent from '@/components/pages/AccountContent';
import { getSessionOrders, getSessionUser } from '@/lib/auth/session';

/**
 * The cookie-reading half of /account, isolated behind a <Suspense> boundary.
 *
 * Cache Components refuses to prerender uncached data at the route level — it
 * would block the whole page. Keeping the session read in its own component
 * lets the shell and chrome render immediately while this streams in.
 */
export default async function AccountData() {
  const [user, orders] = await Promise.all([getSessionUser(), getSessionOrders()]);

  return <AccountContent user={user} orders={orders} />;
}
