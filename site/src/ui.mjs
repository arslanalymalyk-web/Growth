// Shared bilingual strings. L(en, ar) returns a pair that render.mjs resolves by language.
export const L = (en, ar) => ({ en, ar });

export const SITE = {
  name: L('Growth Blueprint', 'غروث بلوبرينت'),
  email: 'faisal@getgrowthblueprint.com',
  phone: '+966 50 662 6052',
  phoneHref: '+966506626052',
  address: L('Office #303, Optima Tower, Al-Shatie District, Jeddah, Saudi Arabia', 'مكتب 303، برج أوبتيما، حي الشاطئ، جدة، المملكة العربية السعودية'),
  linkedin: 'https://www.linkedin.com/company/105738251',
  cr: process.env.SELLER_CR_NO || '',
  vat: process.env.SELLER_VAT_NO || '',
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
  book: L('Book a Free Consultation', 'احجز استشارة مجانية'),
  bookShort: L('Free Consultation', 'استشارة مجانية'),
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
  footerTag: L('Straight talking advisory for businesses that want to enter, set up and grow in Saudi Arabia.', 'استشارات صريحة للشركات التي تريد الدخول إلى السعودية والتأسيس فيها والنمو.'),
  demoNote: L('Prototype build: payments are simulated and some sample content is illustrative.', 'نسخة تجريبية: المدفوعات محاكاة وبعض المحتوى النموذجي توضيحي.'),
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
  notFoundBody: L('We could not find that page. It may have moved, or the link may be wrong. Let us point you somewhere useful.', 'لم نجد هذه الصفحة. ربما نُقلت أو أن الرابط غير صحيح. دعنا نوجهك إلى مكان مفيد.')
};
