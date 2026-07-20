import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { ITEMS_PAGE, SOLITAIRE_DETAIL, PENDANT, STORE_CONFIG } from './fixtures/items';

const BACKEND = 'http://localhost:8000';

/** Records every request MSW sees, so tests can assert on headers sent. */
export const requestLog: Array<{ url: string; headers: Headers }> = [];

export const handlers = [
  http.get(`${BACKEND}/products/prouduct/items/`, ({ request }) => {
    requestLog.push({ url: request.url, headers: request.headers });

    const url = new URL(request.url);
    const subgroup = url.searchParams.get('subgroup');

    let results = ITEMS_PAGE.results;
    if (subgroup) {
      results = results.filter((item) => item.subgroups.includes(Number(subgroup)));
    }

    const search = url.searchParams.get('search');
    if (search) {
      results = results.filter((item) =>
        item.translations_.en.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return HttpResponse.json({ count: results.length, next: null, previous: null, results });
  }),

  http.get(`${BACKEND}/products/prouduct/items/:id/`, ({ params, request }) => {
    requestLog.push({ url: request.url, headers: request.headers });

    const item = [SOLITAIRE_DETAIL, PENDANT].find((candidate) => String(candidate.id) === params.id);
    if (!item) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    return HttpResponse.json(item);
  }),

  http.get(`${BACKEND}/products/prouduct/store-config/`, ({ request }) => {
    requestLog.push({ url: request.url, headers: request.headers });
    return HttpResponse.json(STORE_CONFIG);
  }),
];

export const server = setupServer(...handlers);
