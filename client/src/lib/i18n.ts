
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to CivicConnect',
      events: 'Events',
      forums: 'Forums',
      leaders: 'Leaders',
      profile: 'Profile',
      emergency: 'Emergency Services'
    }
  },
  sw: {
    translation: {
      welcome: 'Karibu CivicConnect',
      events: 'Matukio',
      forums: 'Majadiliano',
      leaders: 'Viongozi',
      profile: 'Wasifu',
      emergency: 'Huduma za Dharura'
    }
  }
};

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18next;
