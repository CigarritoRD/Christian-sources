const es = {
  nav: {
    resources: 'Recursos',
    contributors: 'Colaboradores',
    becomeContributor: 'Conviértete en colaborador',
    admin: 'Admin',
    dashboard: 'Dashboard',
    library: 'Mi librería',
    profile: 'Perfil',
    login: 'Iniciar sesión',
    register: 'Crear cuenta',
    logout: 'Salir',
    openAdmin: 'Ir al panel admin',
    openDashboard: 'Ir al dashboard',
  },

  language: {
    label: 'Idioma',
    spanish: 'Español',
    english: 'English',
  },

  auth: {
    loginTitle: 'Iniciar sesión',
    loginSubtitle: 'Accede a tu cuenta para continuar',
    registerTitle: 'Crear cuenta',
    registerSubtitle: 'Únete a Toolkit Box',
    email: 'Correo',
    password: 'Contraseña',
    fullName: 'Nombre',
    signIn: 'Entrar',
    signingIn: 'Entrando...',
    signUp: 'Crear cuenta',
    signingUp: 'Creando...',
    noAccount: '¿No tienes cuenta?',
    alreadyHaveAccount: '¿Ya tienes cuenta?',
  },

  home: {
    badge: 'Toolkit Box',
    title: 'Recursos útiles para aprender, acompañar y crecer en comunidad.',
    subtitle:
      'Explora materiales compartidos por colaboradores, descubre nuevas herramientas y encuentra recursos diseñados para apoyar procesos reales de formación, bienestar y liderazgo.',
    exploreResources: 'Explorar recursos',
    viewContributors: 'Ver colaboradores',
    becomeContributor: 'Conviértete en colaborador',
    contributorCtaBadge: 'Comparte con la comunidad',
    contributorCtaTitle: '¿Quieres compartir recursos y formar parte de Toolkit Box?',
    contributorCtaSubtitle:
      'Aplica como colaborador para que nuestro equipo revise tu perfil. Si eres aprobado, podrás ser parte de la biblioteca y ayudar a otros con tus materiales.',
    contributorCtaPoint1Title: 'Perfil revisado',
    contributorCtaPoint1Body:
      'Cada solicitud se revisa para asegurar perfiles legítimos y recursos confiables.',
    contributorCtaPoint2Title: 'Mayor alcance',
    contributorCtaPoint2Body:
      'Comparte tus materiales con una comunidad que busca herramientas útiles y bien organizadas.',
  },

  resources: {
    title: 'Explora recursos',
    subtitle:
      'Encuentra materiales compartidos por colaboradores y accede a recursos útiles para formación, bienestar, liderazgo y acompañamiento.',
    filters: 'Filtros',
    filterSubtitle: 'Ajusta tu búsqueda por nombre, categoría, tipo o tags.',
    searchPlaceholder: 'Buscar por título, colaborador, categoría o tag...',
    allCategories: 'Todas las categorías',
    clear: 'Limpiar',
    activeFilters: 'Filtros activos',
    resultsFound_one: '{{count}} recurso encontrado',
    resultsFound_other: '{{count}} recursos encontrados',
    noResultsTitle: 'No encontramos resultados',
    noResultsDescription:
      'Intenta ajustar tu búsqueda o limpiar los filtros aplicados.',
    tags: 'Tags',
  },

  dashboard: {
    title: 'Dashboard',
    exploreResources: 'Explorar recursos',
    myLibrary: 'Ver mi librería',
    myDownloads: 'Mis descargas',
    myResources: 'Mis recursos',
    myAccount: 'Tu cuenta',
  },

  common: {
    loading: 'Cargando...',
    save: 'Guardar',
    saving: 'Guardando...',
    cancel: 'Cancelar',
    reset: 'Restablecer',
    viewAll: 'Ver todo',
    search: 'Buscar',
    review: 'Revisar',
    approve: 'Aprobar',
    reject: 'Rechazar',
  },
} as const

export default es