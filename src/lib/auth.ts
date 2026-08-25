import type { UserRole } from '@/types/database'

export function getRedirectPath(role: UserRole | null | undefined): string {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'member':
      return '/member'
    case 'client':
      return '/client'
    default:
      return '/client'
  }
}