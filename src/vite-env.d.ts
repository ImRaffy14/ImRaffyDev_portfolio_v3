/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string
  readonly VITE_STRIP_UI_MOTION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
