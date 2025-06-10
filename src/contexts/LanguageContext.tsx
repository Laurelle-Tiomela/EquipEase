import React, { createContext, useContext, useState, useEffect } from "react";

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Translation dictionaries
const translations = {
  en: {
    // Navigation
    "nav.admin_home": "Admin Home",
    "nav.website": "Website",
    "nav.equipment": "Equipment",
    "nav.chat": "Chat",
    "nav.gps_tracking": "GPS Tracking",
    "nav.dashboard": "Dashboard",
    "nav.reports": "Reports",
    "nav.database": "Database",
    "nav.ai_assistant": "AI Assistant",
    "nav.settings": "Settings",
    "nav.sign_out": "Sign Out",

    // Dashboard
    "dashboard.title": "Business Dashboard",
    "dashboard.subtitle":
      "Real-time insights into your equipment rental business performance",
    "dashboard.total_revenue": "Total Revenue",
    "dashboard.total_bookings": "Total Bookings",
    "dashboard.equipment_fleet": "Equipment Fleet",
    "dashboard.active_clients": "Active Clients",
    "dashboard.revenue_trends": "Revenue Trends",
    "dashboard.equipment_usage": "Equipment Usage",

    // Settings
    "settings.business": "Business",
    "settings.appearance": "Appearance",
    "settings.localization": "Localization",
    "settings.notifications": "Notifications",
    "settings.working_hours": "Working Hours",
    "settings.business_info": "Business Information",
    "settings.business_name": "Business Name",
    "settings.business_email": "Business Email",
    "settings.business_phone": "Business Phone",
    "settings.currency": "Currency",
    "settings.business_address": "Business Address",
    "settings.theme_mode": "Theme Mode",
    "settings.light": "Light",
    "settings.dark": "Dark",
    "settings.language": "Language",
    "settings.timezone": "Timezone",
    "settings.save_settings": "Save Settings",

    // Chat
    "chat.title": "Client Communication",
    "chat.subtitle":
      "Real-time chat with your clients. Send messages, share files, and coordinate projects instantly.",
    "chat.clients": "Clients",
    "chat.online": "Online",
    "chat.offline": "Offline",
    "chat.message_placeholder": "Type your message...",
    "chat.send": "Send",

    // Equipment
    "equipment.available": "Available",
    "equipment.rented": "Rented",
    "equipment.maintenance": "Maintenance",
    "equipment.daily_rate": "Daily Rate",
    "equipment.weekly_rate": "Weekly Rate",
    "equipment.monthly_rate": "Monthly Rate",

    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.refresh": "Refresh",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.status": "Status",
    "common.actions": "Actions",
  },

  fr: {
    // Navigation
    "nav.admin_home": "Accueil Admin",
    "nav.website": "Site Web",
    "nav.equipment": "Équipement",
    "nav.chat": "Chat",
    "nav.gps_tracking": "Suivi GPS",
    "nav.dashboard": "Tableau de Bord",
    "nav.reports": "Rapports",
    "nav.database": "Base de Données",
    "nav.ai_assistant": "Assistant IA",
    "nav.settings": "Paramètres",
    "nav.sign_out": "Se Déconnecter",

    // Dashboard
    "dashboard.title": "Tableau de Bord Business",
    "dashboard.subtitle":
      "Aperçus en temps réel de votre performance de location d'équipement",
    "dashboard.total_revenue": "Revenus Totaux",
    "dashboard.total_bookings": "Réservations Totales",
    "dashboard.equipment_fleet": "Flotte d'Équipement",
    "dashboard.active_clients": "Clients Actifs",
    "dashboard.revenue_trends": "Tendances des Revenus",
    "dashboard.equipment_usage": "Utilisation de l'Équipement",

    // Settings
    "settings.business": "Business",
    "settings.appearance": "Apparence",
    "settings.localization": "Localisation",
    "settings.notifications": "Notifications",
    "settings.working_hours": "Heures de Travail",
    "settings.business_info": "Informations Business",
    "settings.business_name": "Nom de l'Entreprise",
    "settings.business_email": "Email Business",
    "settings.business_phone": "Téléphone Business",
    "settings.currency": "Devise",
    "settings.business_address": "Adresse Business",
    "settings.theme_mode": "Mode Thème",
    "settings.light": "Clair",
    "settings.dark": "Sombre",
    "settings.language": "Langue",
    "settings.timezone": "Fuseau Horaire",
    "settings.save_settings": "Sauvegarder les Paramètres",

    // Chat
    "chat.title": "Communication Client",
    "chat.subtitle":
      "Chat en temps réel avec vos clients. Envoyez des messages, partagez des fichiers et coordonnez les projets instantanément.",
    "chat.clients": "Clients",
    "chat.online": "En Ligne",
    "chat.offline": "Hors Ligne",
    "chat.message_placeholder": "Tapez votre message...",
    "chat.send": "Envoyer",

    // Equipment
    "equipment.available": "Disponible",
    "equipment.rented": "Loué",
    "equipment.maintenance": "Maintenance",
    "equipment.daily_rate": "Tarif Journalier",
    "equipment.weekly_rate": "Tarif Hebdomadaire",
    "equipment.monthly_rate": "Tarif Mensuel",

    // Common
    "common.loading": "Chargement...",
    "common.save": "Sauvegarder",
    "common.cancel": "Annuler",
    "common.edit": "Modifier",
    "common.delete": "Supprimer",
    "common.refresh": "Actualiser",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.status": "Statut",
    "common.actions": "Actions",
  },

  es: {
    // Navigation
    "nav.admin_home": "Inicio Admin",
    "nav.website": "Sitio Web",
    "nav.equipment": "Equipo",
    "nav.chat": "Chat",
    "nav.gps_tracking": "Seguimiento GPS",
    "nav.dashboard": "Panel de Control",
    "nav.reports": "Informes",
    "nav.database": "Base de Datos",
    "nav.ai_assistant": "Asistente IA",
    "nav.settings": "Configuración",
    "nav.sign_out": "Cerrar Sesión",

    // Dashboard
    "dashboard.title": "Panel de Control del Negocio",
    "dashboard.subtitle":
      "Información en tiempo real sobre el rendimiento de su negocio de alquiler de equipos",
    "dashboard.total_revenue": "Ingresos Totales",
    "dashboard.total_bookings": "Reservas Totales",
    "dashboard.equipment_fleet": "Flota de Equipos",
    "dashboard.active_clients": "Clientes Activos",
    "dashboard.revenue_trends": "Tendencias de Ingresos",
    "dashboard.equipment_usage": "Uso del Equipo",

    // Settings
    "settings.business": "Negocio",
    "settings.appearance": "Apariencia",
    "settings.localization": "Localización",
    "settings.notifications": "Notificaciones",
    "settings.working_hours": "Horario de Trabajo",
    "settings.business_info": "Información del Negocio",
    "settings.business_name": "Nombre del Negocio",
    "settings.business_email": "Email del Negocio",
    "settings.business_phone": "Teléfono del Negocio",
    "settings.currency": "Moneda",
    "settings.business_address": "Dirección del Negocio",
    "settings.theme_mode": "Modo Tema",
    "settings.light": "Claro",
    "settings.dark": "Oscuro",
    "settings.language": "Idioma",
    "settings.timezone": "Zona Horaria",
    "settings.save_settings": "Guardar Configuración",

    // Chat
    "chat.title": "Comunicación con Clientes",
    "chat.subtitle":
      "Chat en tiempo real con sus clientes. Envíe mensajes, comparta archivos y coordine proyectos al instante.",
    "chat.clients": "Clientes",
    "chat.online": "En Línea",
    "chat.offline": "Fuera de Línea",
    "chat.message_placeholder": "Escriba su mensaje...",
    "chat.send": "Enviar",

    // Equipment
    "equipment.available": "Disponible",
    "equipment.rented": "Alquilado",
    "equipment.maintenance": "Mantenimiento",
    "equipment.daily_rate": "Tarifa Diaria",
    "equipment.weekly_rate": "Tarifa Semanal",
    "equipment.monthly_rate": "Tarifa Mensual",

    // Common
    "common.loading": "Cargando...",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.edit": "Editar",
    "common.delete": "Eliminar",
    "common.refresh": "Actualizar",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.status": "Estado",
    "common.actions": "Acciones",
  },

  de: {
    // Navigation
    "nav.admin_home": "Admin Startseite",
    "nav.website": "Webseite",
    "nav.equipment": "Ausrüstung",
    "nav.chat": "Chat",
    "nav.gps_tracking": "GPS-Verfolgung",
    "nav.dashboard": "Dashboard",
    "nav.reports": "Berichte",
    "nav.database": "Datenbank",
    "nav.ai_assistant": "KI-Assistent",
    "nav.settings": "Einstellungen",
    "nav.sign_out": "Abmelden",

    // Dashboard
    "dashboard.title": "Business Dashboard",
    "dashboard.subtitle":
      "Echtzeiteinblicke in die Leistung Ihres Gerätevermietungsgeschäfts",
    "dashboard.total_revenue": "Gesamtumsatz",
    "dashboard.total_bookings": "Gesamtbuchungen",
    "dashboard.equipment_fleet": "Geräteflotte",
    "dashboard.active_clients": "Aktive Kunden",
    "dashboard.revenue_trends": "Umsatztrends",
    "dashboard.equipment_usage": "Gerätenutzung",

    // Settings
    "settings.business": "Geschäft",
    "settings.appearance": "Erscheinungsbild",
    "settings.localization": "Lokalisierung",
    "settings.notifications": "Benachrichtigungen",
    "settings.working_hours": "Arbeitszeiten",
    "settings.business_info": "Geschäftsinformationen",
    "settings.business_name": "Firmenname",
    "settings.business_email": "Geschäfts-E-Mail",
    "settings.business_phone": "Geschäftstelefon",
    "settings.currency": "Währung",
    "settings.business_address": "Geschäftsadresse",
    "settings.theme_mode": "Theme-Modus",
    "settings.light": "Hell",
    "settings.dark": "Dunkel",
    "settings.language": "Sprache",
    "settings.timezone": "Zeitzone",
    "settings.save_settings": "Einstellungen Speichern",

    // Chat
    "chat.title": "Kundenkommunikation",
    "chat.subtitle":
      "Echtzeit-Chat mit Ihren Kunden. Senden Sie Nachrichten, teilen Sie Dateien und koordinieren Sie Projekte sofort.",
    "chat.clients": "Kunden",
    "chat.online": "Online",
    "chat.offline": "Offline",
    "chat.message_placeholder": "Geben Sie Ihre Nachricht ein...",
    "chat.send": "Senden",

    // Equipment
    "equipment.available": "Verfügbar",
    "equipment.rented": "Vermietet",
    "equipment.maintenance": "Wartung",
    "equipment.daily_rate": "Tagesrate",
    "equipment.weekly_rate": "Wochenrate",
    "equipment.monthly_rate": "Monatsrate",

    // Common
    "common.loading": "Laden...",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.edit": "Bearbeiten",
    "common.delete": "Löschen",
    "common.refresh": "Aktualisieren",
    "common.search": "Suchen",
    "common.filter": "Filtern",
    "common.status": "Status",
    "common.actions": "Aktionen",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState(() => {
    // Check for saved language preference or default to English
    const savedLanguage = localStorage.getItem("equipease-language");
    return savedLanguage || "en";
  });

  useEffect(() => {
    // Save language preference
    localStorage.setItem("equipease-language", language);
  }, [language]);

  const t = (key: string): string => {
    const languageTranslations =
      translations[language as keyof typeof translations] || translations.en;
    return (
      languageTranslations[key as keyof typeof languageTranslations] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
