interface IStorageValue {
  // the value to store, 1 character to minimize cache size
  v: any;
  // the expiration, as a UTC timestamp
  e: number;
}
  
/**
 * Useful defaults for cache expiration minutes.
 */
export enum CacheExpiry {
  NEVER = -1,
  ONE_HOUR = 60,
  ONE_DAY = ONE_HOUR * 24,
  ONE_WEEK = ONE_DAY * 7,
}
  
/**
 * The list of cache keys used in the app.
 *
 * To avoid weird bugs due to duplicate keys,
 * hardcoding keys should be avoided, always 
 * add the cache key here.
 */
export enum CacheKeys {
  PRIVATE_KEY = 'pk',
  USERNAME_TO_ADDRESS = 'u2a',
  ADDRESS_TO_USERNAME = 'a2u',
  FRIENDS = 'fr',
  INSTALL_PROMPT_SHOWN = 'ips',
  ALLOW_FAUCET = 'af'
}
  
/**
 * Cache default values.
 *
 * Cache keys are not required to have a default value.
 */
export const CACHE_DEFAULTS: { [key: string]: any; } = {
  [CacheKeys.FRIENDS.toString()]: [{
    address: '0x8E2695650D09FD940516d6e050D0Ba87d8deF032', // it me
    weight: 1
  }],
  [CacheKeys.INSTALL_PROMPT_SHOWN.toString()]: false,
  [CacheKeys.ALLOW_FAUCET.toString()]: true
};

function keyInternal(key: string): string {
  return 'tboard' + key;
}

/**
 * Sets a cached value.
 * 
 * The default expiration is 1 week. Use CacheExpiry.NEVER to keep
 * the value cached indefinitely.
 *
 * All JSON parsing is done internally, you should only need to pass
 * the value, array, or object you would like to cache.
 */
export const setValue = (
  key: string,
  value: any,
  expirationMinutes: number
): void => {
  if (typeof window === 'undefined') return

  const val: IStorageValue = {
    v: value,
    e: expirationMinutes === CacheExpiry.NEVER
      ? CacheExpiry.NEVER
      : Date.now() + expirationMinutes * 60000
  };
  localStorage.setItem(keyInternal(key), JSON.stringify(val));
};

/**
 * Gets a cached value, or its default if none is cached.
 */
export const getValue = (key: string): any => {
  if (typeof window === 'undefined') return
  
  const rawVal = localStorage.getItem(keyInternal(key));
  if (rawVal) {
    const parsed: IStorageValue = JSON.parse(rawVal);
    if (parsed.e === CacheExpiry.NEVER) {
      return parsed.v;
    } else {
      if (parsed.e < Date.now()) {
        localStorage.removeItem(keyInternal(key));
        return undefined;
      } else {
        return parsed.v;
      }
    }
  } else if (CACHE_DEFAULTS[key]) {
    return CACHE_DEFAULTS[key];
  } else {
    return undefined;
  }
};