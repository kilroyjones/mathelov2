import Pocketbase from "pocketbase";

let pocketbase: Pocketbase | undefined = undefined;

const PUBLIC_DATABASE_URL: string | undefined = process.env.PUBLIC_DATABASE_URL;

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
  if (PUBLIC_DATABASE_URL == undefined) {
    console.error("PUBLIC_DATABASE_URL is undefined");
    return false;
  }
  pocketbase = new Pocketbase(PUBLIC_DATABASE_URL);
  return true;
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
