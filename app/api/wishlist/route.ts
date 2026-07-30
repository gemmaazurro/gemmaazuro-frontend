import { NextResponse } from 'next/server';
import { apiFetch, apiFetchPaginated } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { errorResponse } from '@/lib/auth/handlers';
import { getSessionToken } from '@/lib/auth/session';

/**
 * The signed-in shopper's wishlisted item ids.
 *
 * Only ids: the client store needs them to fill in hearts across the catalog,
 * and the wishlist page already has the full product data from the catalog
 * cache. Returns [] when signed out so the caller can fall back to
 * localStorage instead of branching on an error.
 */
export async function GET() {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ signedIn: false, ids: [] });

  try {
    const page = await apiFetchPaginated<{ id: number }>(ENDPOINTS.WISHLIST, {
      token,
      cache: 'no-store',
    });

    return NextResponse.json({
      signedIn: true,
      ids: page.results.map((item) => String(item.id)),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

/** Toggle one item. Django decides add vs remove and tells us which happened. */
export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: 'Please sign in to save favourites.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const itemId = Number(body?.itemId);

  if (!Number.isFinite(itemId)) {
    return NextResponse.json({ error: 'A valid item id is required.' }, { status: 400 });
  }

  try {
    const result = await apiFetch<{ success: boolean; added: boolean }>(
      ENDPOINTS.WISHLIST_TOGGLE,
      { method: 'POST', body: { item_id: itemId }, token, cache: 'no-store' },
    );

    return NextResponse.json({ added: result.added });
  } catch (error) {
    return errorResponse(error);
  }
}
