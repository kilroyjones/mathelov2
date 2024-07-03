import Pocketbase from "pocketbase";

let pocketbase: Pocketbase | undefined = undefined;

const PUBLIC_DATABASE_URL: string | undefined = process.env.PUBLIC_DATABASE_URL;
const PRIVATE_DATABASE_USERNAME: string | undefined = process.env.PRIVATE_DATABASE_USERNAME;
const PRIVATE_DATABASE_PASSWORD: string | undefined = process.env.PRIVATE_DATABASE_PASSWORD;

/**
 *
 * @returns
 */
async function getInstance(): Promise<Pocketbase | undefined> {
  if (pocketbase) {
    return pocketbase;
  }
}

/**
 *
 * @returns
 */
async function initializePocketbase() {
  let success = true;

  if (PUBLIC_DATABASE_URL == undefined) {
    console.error("PUBLIC_DATABASE_URL is undefined");
    success = false;
  }
  pocketbase = new Pocketbase(PUBLIC_DATABASE_URL);
  pocketbase.autoCancellation(false);

  if (PRIVATE_DATABASE_USERNAME && PRIVATE_DATABASE_PASSWORD) {
    await pocketbase.admins.authWithPassword(PRIVATE_DATABASE_USERNAME, PRIVATE_DATABASE_PASSWORD, {
      autoRefreshThreshold: 30 * 60,
    });
  }
  return success;
}

/**
 *
 */
(async () => {
  const success = await initializePocketbase();
  if (success) {
    console.info("[Pocketbase:service] - Started");
  } else {
    console.error("[Pocketbase:service] - Failed to start");
  }
})();

export const PocketBaseService = {
  getInstance,
};
