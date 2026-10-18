// Shared bilingual strings. L(en, ar) returns a pair that render.mjs resolves by language.
export const L = (en, ar) => ({ en, ar });

export const SITE = {
  name: L('Growth Blueprint Advisory', 'غروث بلوبرنت للاستشارات'),
  email: 'info@growthblueprint.sa',
  phone: '+966 11 123 4567',
  phoneHref: '+966111234567',
  address: L('Riyadh, Kingdom of Saudi Arabia', 'الرياض، المملكة العربية السعودية'),
  year: 2026
};

export const NAV = [
  { id: 'home', path: '', label: L('Home', 'الرئيسية') },
  { id: 'services', path: 'services/', label: L('Services', 'خدماتنا') },
  { id: 'industries', path: 'industries/', label: L('Industries', 'القطاعات') },
  { id: 'approach', path: 'our-approach/', label: L('Our Approach', 'منهجنا') },
  { id: 'about', path: 'about/', label: L('About', 'من نحن') },
  { id: 'insights', path: 'insights/', label: L('Insights', 'رؤى') },
  { id: 'shop', path: 'shop/', label: L('Briefs', 'الموجزات') }
];

export const UI = {
  book: L('Book a Consultation', 'احجز استشارة'),
  bookShort: L('Book a Consultation', 'احجز استشارة'),
  explore: L('Explore service', 'استكشف الخدمة'),
  exploreSector: L('Explore sector', 'استكشف القطاع'),
  learnMore: L('Learn more', 'اعرف المزيد'),
  readArticle: L('Read the article', 'اقرأ المقال'),
  readMore: L('Read more', 'اقرأ المزيد'),
  viewAll: L('View all', 'عرض الكل'),
  viewAllServices: L('View all services', 'عرض جميع الخدمات'),
  viewAllIndustries: L('View all industries', 'عرض جميع القطاعات'),
  viewAllInsights: L('View all insights', 'عرض جميع الرؤى'),
  exploreServices: L('Explore Our Services', 'استكشف خدماتنا'),
  skipToContent: L('Skip to main content', 'انتقل إلى المحتوى الرئيسي'),
  menu: L('Menu', 'القائمة'),
  closeMenu: L('Close menu', 'إغلاق القائمة'),
  language: L('Language', 'اللغة'),
  breadcrumbHome: L('Home', 'الرئيسية'),
  quickLinks: L('Quick Links', 'روابط سريعة'),
  ourServices: L('Our Services', 'خدماتنا'),
  getInTouch: L('Get in touch', 'تواصل معنا'),
  followUs: L('Follow us', 'تابعنا'),
  privacy: L('Privacy Policy', 'سياسة الخصوصية'),
  terms: L('Terms of Use', 'شروط الاستخدام'),
  cookies: L('Cookie Policy', 'سياسة ملفات الارتباط'),
  rights: L('All rights reserved.', 'جميع الحقوق محفوظة.'),
  footerTag: L('Strategic advisory for ambitious businesses to enter, establish and grow in Saudi Arabia.', 'استشارات استراتيجية للشركات الطموحة للدخول والتأسيس والنمو في المملكة العربية السعودية.'),
  demoNote: L('Demonstration website. Contact details and sample content are illustrative placeholders.', 'موقع تجريبي. بيانات التواصل والمحتوى النموذجي أمثلة توضيحية.'),
  cookieText: L('We use essential cookies to make this website work. With your consent we would also use analytics cookies to improve it.', 'نستخدم ملفات ارتباط أساسية لتشغيل هذا الموقع. وبموافقتك سنستخدم أيضًا ملفات تحليلية لتحسينه.'),
  cookieAccept: L('Accept', 'موافق'),
  cookieDecline: L('Essential only', 'الأساسية فقط'),
  enquire: L('Make an enquiry', 'أرسل استفسارًا'),
  home: L('Home', 'الرئيسية'),
  back: L('Back', 'رجوع'),
  continue: L('Continue', 'متابعة'),
  submit: L('Submit enquiry', 'إرسال الاستفسار'),
  ideal: L('Ideal for', 'مناسبة لـ'),
  stage: L('Stage', 'المرحلة'),
  eyebrowToc: L('Contents', 'المحتويات'),
  relatedServices: L('Related services', 'خدمات ذات صلة'),
  notFoundTitle: L('Page not found', 'الصفحة غير موجودة'),
  notFoundBody: L('The page you are looking for may have moved or no longer exists.', 'ربما نُقلت الصفحة التي تبحث عنها أو لم تعد موجودة.')
};
