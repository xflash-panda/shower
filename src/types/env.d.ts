/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly SHOWER_API_BASE_URL?: string;
  readonly SHOWER_CURRENCY_LOCALE?: string;
  readonly SHOWER_CURRENCY_UNIT?: string;
  readonly SHOWER_CURRENCY_MAX_DIGITS?: number;
  readonly SHOWER_TIMEZONE?: string;
  readonly SHOWER_COPYRIGHT_MARK?: string;
  readonly SHOWER_CRYPTO_SECRET_KEY?: string;
  readonly SHOWER_ASSET_PREFIX?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
