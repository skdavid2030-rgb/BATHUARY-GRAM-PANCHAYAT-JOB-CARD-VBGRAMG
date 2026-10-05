import { BeneficiaryRow } from '../types';

const DB_NAME = 'BathuaryGP_Database_v2';
const DB_VERSION = 1;
const STORE_BENEFICIARIES = 'beneficiaries_data';
const STORE_META = 'sync_metadata';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not supported in this environment'));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_BENEFICIARIES)) {
          db.createObjectStore(STORE_BENEFICIARIES);
        }
        if (!db.objectStoreNames.contains(STORE_META)) {
          db.createObjectStore(STORE_META);
        }
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        dbPromise = null;
        reject((event.target as IDBOpenDBRequest).error);
      };
    } catch (e) {
      dbPromise = null;
      reject(e);
    }
  });

  return dbPromise;
}

// In-memory cache fallback for private/sandboxed mode
let inMemoryBeneficiaries: BeneficiaryRow[] | null = null;
let inMemoryMeta: Record<string, any> | null = null;

export async function loadCachedBeneficiaries(): Promise<BeneficiaryRow[] | null> {
  if (inMemoryBeneficiaries && inMemoryBeneficiaries.length > 0) {
    return inMemoryBeneficiaries;
  }

  try {
    const db = await getDb();
    return await new Promise<BeneficiaryRow[] | null>((resolve) => {
      const tx = db.transaction(STORE_BENEFICIARIES, 'readonly');
      const store = tx.objectStore(STORE_BENEFICIARIES);
      const req = store.get('all_beneficiaries');

      req.onsuccess = () => {
        const data = req.result;
        if (Array.isArray(data) && data.length > 0) {
          inMemoryBeneficiaries = data;
          resolve(data);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => resolve(null);
    });
  } catch {
    return inMemoryBeneficiaries;
  }
}

export async function saveCachedBeneficiaries(records: BeneficiaryRow[]): Promise<void> {
  if (!Array.isArray(records) || records.length === 0) return;
  inMemoryBeneficiaries = records;

  try {
    const db = await getDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_BENEFICIARIES, 'readwrite');
      const store = tx.objectStore(STORE_BENEFICIARIES);
      const req = store.put(records, 'all_beneficiaries');

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[Storage] IndexedDB write notice (using memory fallback):', err);
  }
}

export interface SyncMetadata {
  lastSyncTime: string;
  totalRecords: number;
  fingerprint: string;
  source: string;
}

export async function loadSyncMetadata(): Promise<SyncMetadata | null> {
  if (inMemoryMeta) return inMemoryMeta as SyncMetadata;

  try {
    const db = await getDb();
    return await new Promise<SyncMetadata | null>((resolve) => {
      const tx = db.transaction(STORE_META, 'readonly');
      const store = tx.objectStore(STORE_META);
      const req = store.get('current_sync_meta');

      req.onsuccess = () => {
        if (req.result) {
          inMemoryMeta = req.result;
          resolve(req.result);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => resolve(null);
    });
  } catch {
    return inMemoryMeta as SyncMetadata | null;
  }
}

export async function saveSyncMetadata(meta: SyncMetadata): Promise<void> {
  inMemoryMeta = meta;
  try {
    const db = await getDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_META, 'readwrite');
      const store = tx.objectStore(STORE_META);
      const req = store.put(meta, 'current_sync_meta');

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // ignore
  }
}

export async function clearCachedBeneficiaries(): Promise<void> {
  inMemoryBeneficiaries = null;
  inMemoryMeta = null;
  try {
    const db = await getDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_BENEFICIARIES, STORE_META], 'readwrite');
      tx.objectStore(STORE_BENEFICIARIES).clear();
      tx.objectStore(STORE_META).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}
