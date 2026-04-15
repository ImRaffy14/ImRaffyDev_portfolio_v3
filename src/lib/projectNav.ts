export type ProjectOrigin = 'featured' | 'archive'

export const projectNavState = {
  featured: { projectOrigin: 'featured' as const },
  archive: { projectOrigin: 'archive' as const },
}
