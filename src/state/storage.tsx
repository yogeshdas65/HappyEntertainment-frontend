


// storage/mmkv.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';

// These IDs and keys must never change or you’ll lose access
const TOKEN_STORE_ID = 'token-storage';
const AUTH_STORE_ID  = 'Sales-auth-storage';
const ENCRYPTION_KEY = 'some_secret_key';  // exactly the same on every launch

type StorageBackend = {
  set:       (key: string, value: string)       => void | Promise<void>;
  getString: (key: string)                     => string | null | Promise<string | null>;
  delete:    (key: string)                     => void | Promise<void>;
  clearAll:  ()                                => void | Promise<void>;
};

function createStorage(id: string, key: string): StorageBackend {
  try {
    // Will throw if JSI (nativeCallSyncHook) isn’t present
    const mmkv = new MMKV({ id, encryptionKey: key });
    return {
      set:       (k, v) => mmkv.set(k, v),
      getString: (k)    => mmkv.getString(k) ?? null,
      delete:    (k)    => mmkv.delete(k),
      clearAll:  ()     => mmkv.clearAll(),
    };
  } catch {
    console.warn(`MMKV unavailable for "${id}", falling back to AsyncStorage`);
    return {
      set:       (k, v) => AsyncStorage.setItem(`${id}:${k}`, v),
      getString: (k)    => AsyncStorage.getItem(`${id}:${k}`),
      delete:    (k)    => AsyncStorage.removeItem(`${id}:${k}`),
      clearAll:  ()     => AsyncStorage.clear(),
    };
  }
}

// Export two parallel stores
export const tokenStorage = createStorage(TOKEN_STORE_ID, ENCRYPTION_KEY);
export const authStorage  = createStorage(AUTH_STORE_ID,  ENCRYPTION_KEY);

// Convenience API to match localStorage‑style async signature
export const mmkvStorage = {
  setItem:    (k: string, v: string) => authStorage.set(k, v),
  getItem:    (k: string)           => authStorage.getString(k),
  removeItem: (k: string)           => authStorage.delete(k),
  clearAll:   ()                    => authStorage.clearAll(),
};

export const tokenKV = {
  setItem:    (k: string, v: string) => tokenStorage.set(k, v),
  getItem:    (k: string)           => tokenStorage.getString(k),
  removeItem: (k: string)           => tokenStorage.delete(k),
  clearAll:   ()                    => tokenStorage.clearAll(),
};
