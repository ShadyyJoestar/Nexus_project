export type Locale = 'id' | 'en'

export const translations = {
  id: {
    members: 'Members',
    projects: 'Projects',
    login: 'Login',
    logout: 'Logout',
    join: 'Gabung',
    dashboard: 'Dashboard',
    theme: 'Tema',
    language: 'Bahasa',
    light: 'Terang',
    dark: 'Gelap',
    system: 'Sistem',
    saveProfile: 'Simpan profil',
    addProject: 'Tambah project',
    searchUsers: 'Cari username atau nama...',
    allRoles: 'Semua role',
    noUsers: 'Tidak ada user yang cocok.',
    community: 'Community',
    communityDesc: 'Lihat member CodeClass dan project mereka.',
    roleClient: 'Role: client',
    seeProfile: 'Lihat profil →',
    noMembers: 'Belum ada member.',
    noProjects: 'Belum ada project.',
    tryAgain: 'Coba lagi',
    home: 'Ke beranda',
    pageError: 'Halaman mengalami error',
    pageErrorDesc:
      'Terjadi kesalahan saat memuat halaman ini. Coba muat ulang, atau kembali ke beranda.',
    notFound: 'Halaman tidak ditemukan',
    notFoundDesc: 'URL yang kamu buka tidak ada atau sudah dipindahkan.',
  },
  en: {
    members: 'Members',
    projects: 'Projects',
    login: 'Login',
    logout: 'Logout',
    join: 'Join',
    dashboard: 'Dashboard',
    theme: 'Theme',
    language: 'Language',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    saveProfile: 'Save profile',
    addProject: 'Add project',
    searchUsers: 'Search username or name...',
    allRoles: 'All roles',
    noUsers: 'No matching users.',
    community: 'Community',
    communityDesc: 'Browse CodeClass members and their projects.',
    roleClient: 'Role: client',
    seeProfile: 'View profile →',
    noMembers: 'No members yet.',
    noProjects: 'No projects yet.',
    tryAgain: 'Try again',
    home: 'Go home',
    pageError: 'Something went wrong',
    pageErrorDesc:
      'An error occurred while loading this page. Try again or go back home.',
    notFound: 'Page not found',
    notFoundDesc: 'The URL you opened does not exist or has been moved.',
  },
} as const

export type TranslationKey = keyof typeof translations.id

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] ?? translations.id[key] ?? key
}
