/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_CMS_PUBLIC_API_KEY: string
  readonly VITE_CMS_TENANT_ID: string
  readonly VITE_CMS_MALL_ID: string
  readonly VITE_CMS_LOCALE: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
