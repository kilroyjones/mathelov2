/**
 * This is used only in layout.ts to load the cookie.
 */
import { PUBLIC_DATABASE_URL } from '$env/static/public';

import PocketBase from 'pocketbase';

console.log(PUBLIC_DATABASE_URL);
export const pocketbase = new PocketBase(PUBLIC_DATABASE_URL);
