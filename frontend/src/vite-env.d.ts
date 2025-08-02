/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEST_MODE?: string
  readonly VITE_TEST_ROLE?: string
  readonly DEV: boolean
  readonly PROD: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}