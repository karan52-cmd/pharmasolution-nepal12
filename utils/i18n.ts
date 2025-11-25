import { User } from "../types";

const translations: Record<string, Record<string, string>> = {
  'Dashboard': { np: 'ड्यासबोर्ड' },
  'Learning Materials': { np: 'अध्ययन सामग्री' },
  'Quizzes': { np: 'हाजिरीजवाफ' },
  'Practice Mode': { np: 'अभ्यास मोड' },
  'Doubt Forum': { np: 'प्रश्न फोरम' },
  'AI Tutor': { np: 'AI शिक्षक' },
  'Upload Content': { np: 'सामग्री अपलोड' },
  'Quiz Manager': { np: 'क्विज व्यवस्थापक' },
  'Practice Builder': { np: 'अभ्यास निर्माण' },
  'Student Doubts': { np: 'विद्यार्थी प्रश्नहरू' },
  'Overview': { np: 'सिंहावलोकन' },
  'Approvals': { np: 'अनुमोदनहरू' },
  'User Management': { np: 'प्रयोगकर्ता व्यवस्थापन' },
  'Sign Out': { np: 'लग आउट' },
  'Settings': { np: 'सेटिङहरू' },
  'Drug Index': { np: 'औषधि सूची' },
  'Career Hub': { np: 'रोजगार केन्द्र' },
  'Clinical Tools': { np: 'क्लिनिकल उपकरण' },
  'Calendar': { np: 'पात्रो' },
  'Ad Manager': { np: 'विज्ञापन प्रबन्धक' },
  'Exam Results': { np: 'परीक्षा नतिजा' }
};

export const t = (key: string, user?: User) => {
  if (user?.language === 'np' && translations[key]) {
    return translations[key].np;
  }
  return key;
};