// Paid advisory sessions: one session, or a bundle of three. Shared by the server (rules, prices) and the build (copy).
// PRICES ARE PLACEHOLDERS: confirm them, then set SESSION_PRICE_SINGLE / SESSION_PRICE_BUNDLE on the server.
import { L } from './ui.mjs';

export const SESS = {
  tzOffsetMin: 180, tzName: 'AST (UTC+3)', days: [0, 1, 2, 3, 4], times: ['09:30', '11:00', '12:30', '14:00', '15:30'], minutes: 60,
  leadHours: 24, horizonDays: 28, holdMin: 15, bundleValidDays: 120, rescheduleHours: 24, vat: 0.15, cur: 'SAR',
  plans: { single: { n: 1, price: 1500 }, bundle: { n: 3, price: 3900 } }
};

/** UTC start instants (ISO) of the bookable slots on one Saudi calendar date (YYYY-MM-DD). Empty on weekends and blackout dates. */
export function slotsForDate(date, blackout = [], cfg = SESS) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date); if (!m) return [];
  const [y, mo, d] = [+m[1], +m[2], +m[3]]; if (!cfg.days.includes(new Date(Date.UTC(y, mo - 1, d)).getUTCDay()) || blackout.includes(date)) return [];
  return cfg.times.map((t) => { const [h, mi] = t.split(':').map(Number); return new Date(Date.UTC(y, mo - 1, d, h, mi) - cfg.tzOffsetMin * 60000).toISOString(); });
}
export const localDate = (iso, cfg = SESS) => new Date(new Date(iso).getTime() + cfg.tzOffsetMin * 60000).toISOString().slice(0, 10);

export const SX = {
  meta: { title: L('Book an Advisory Session | Growth Blueprint', 'احجز جلسة استشارية | غروث بلوبرينت'), description: L('Book a paid one-to-one advisory session, or a bundle of three, and pay online by card.', 'احجز جلسة استشارية فردية مدفوعة أو حزمة من ثلاث جلسات وادفع عبر الإنترنت بالبطاقة.') },
  hero: { eyebrow: L('Advisory sessions', 'الجلسات الاستشارية'), title: L('Book an advisory session', 'احجز جلسة استشارية'), lead: L('Sixty focused minutes with our team on the question that matters most to you. Choose one session or a bundle of three, pick a time and pay online by card.', 'ستون دقيقة مركّزة مع فريقنا حول السؤال الأهم لك. اختر جلسة واحدة أو حزمة من ثلاث جلسات، وحدّد موعدًا وادفع عبر الإنترنت بالبطاقة.'), img: 'hero-man-skyline' },
  free: L('Not sure yet? Start with a free 30-minute consultation.', 'لست متأكدًا بعد؟ ابدأ باستشارة مجانية مدتها 30 دقيقة.'),
  steps: [L('Choose', 'اختر'), L('Pick a time', 'حدّد الموعد'), L('Your details', 'بياناتك'), L('Pay', 'ادفع')],
  plans: {
    single: { t: L('Single session', 'جلسة واحدة'), d: L('One 60-minute session with a written summary afterwards.', 'جلسة واحدة مدتها 60 دقيقة مع ملخص مكتوب بعدها.'), pts: [L('60 minutes, online or in Jeddah', '60 دقيقة، عبر الإنترنت أو في جدة'), L('Written summary and next steps', 'ملخص مكتوب وخطوات تالية'), L('Free rescheduling up to 24 hours before', 'إعادة جدولة مجانية حتى 24 ساعة قبل الموعد')] },
    bundle: { t: L('Three-session bundle', 'حزمة ثلاث جلسات'), d: L('Three 60-minute sessions at a lower price per session. Book the first now and schedule the others when you are ready.', 'ثلاث جلسات مدة كل منها 60 دقيقة بسعر أقل للجلسة. احجز الأولى الآن وحدّد موعد الباقيتين متى شئت.'), pts: [L('Three sessions, each with a written summary', 'ثلاث جلسات، لكل منها ملخص مكتوب'), L('Schedule the other two within 120 days', 'حدّد موعد الجلستين الأخريين خلال 120 يومًا'), L('Same team across all three', 'الفريق نفسه في الجلسات الثلاث')], badge: L('Best value', 'الأوفر') }
  },
  ui: {
    perSession: L('per session', 'للجلسة'), exVat: L('excl. VAT', 'قبل الضريبة'), choose: L('Choose', 'اختر'), selected: L('Selected', 'محدد'),
    pickDay: L('Pick a day', 'اختر يومًا'), pickTime: L('Pick a time', 'اختر وقتًا'), tzNote: L('Times are shown in Saudi Arabia time (AST, UTC+3).', 'الأوقات بتوقيت المملكة العربية السعودية (AST، UTC+3).'), yourTime: L('Your local time', 'توقيتك المحلي'),
    loading: L('Loading available times…', 'جارٍ تحميل الأوقات المتاحة…'), none: L('No times left on this day. Please pick another.', 'لا توجد أوقات متاحة في هذا اليوم. اختر يومًا آخر.'), noneAll: L('No times are available right now. Please try again later or contact us.', 'لا توجد أوقات متاحة حاليًا. حاول لاحقًا أو تواصل معنا.'),
    mode: L('How would you like to meet?', 'كيف تفضّل اللقاء؟'), online: L('Online (video call)', 'عبر الإنترنت (مكالمة فيديو)'), person: L('In person (Jeddah office)', 'حضوريًا (مكتب جدة)'),
    name: L('Full name *', 'الاسم الكامل *'), email: L('Email address *', 'البريد الإلكتروني *'), company: L('Company name', 'اسم الشركة'), phone: L('Phone number', 'رقم الهاتف'), vatNo: L('VAT number (for the invoice)', 'الرقم الضريبي (للفاتورة)'), topic: L('What would you like to cover? *', 'ما الذي تود مناقشته؟ *'), topicHint: L('A few lines are enough. It helps us prepare.', 'تكفي بضعة أسطر. فهي تساعدنا على التحضير.'),
    terms: L('I have read the session terms: free rescheduling up to 24 hours before, and the cancellation and refund rules.', 'قرأت شروط الجلسات: إعادة جدولة مجانية حتى 24 ساعة قبل الموعد، وقواعد الإلغاء والاسترداد.'),
    privacy: L('I have read the Privacy Notice and agree that you may use my details to arrange and deliver my session. *', 'قرأت إشعار الخصوصية وأوافق على استخدام بياناتي لترتيب جلستي وتقديمها. *'),
    marketing: L('Yes, send me the monthly brief. (Optional. You can unsubscribe at any time.)', 'نعم، أرسلوا لي الموجز الشهري. (اختياري، ويمكنك إلغاء الاشتراك في أي وقت.)'),
    summary: L('Your booking', 'حجزك'), subtotal: L('Subtotal', 'المجموع قبل الضريبة'), vat: L('VAT (15%)', 'ضريبة القيمة المضافة (15%)'), total: L('Total', 'الإجمالي'), session: L('Session', 'الجلسة'),
    payDemo: L('Pay (simulated)', 'ادفع (محاكاة)'), pay: L('Pay by card', 'ادفع بالبطاقة'), payNote: L('You will be taken to our payment provider’s secure page. We never see or store your card number.', 'سننقلك إلى صفحة الدفع الآمنة لدى مزوّد الدفع. لا نطّلع على رقم بطاقتك ولا نخزّنه.'),
    demoNote: L('Demonstration mode: no card is charged and no real booking is made.', 'وضع العرض: لا يُخصم أي مبلغ ولا يُسجَّل حجز حقيقي.'),
    errName: L('Please enter your name.', 'يرجى إدخال اسمك.'), errEmail: L('Please enter a valid email address.', 'يرجى إدخال بريد إلكتروني صالح.'), errTopic: L('Please tell us briefly what you would like to cover.', 'يرجى إخبارنا باختصار بما تود مناقشته.'), errSlot: L('Please pick a day and time.', 'يرجى اختيار يوم ووقت.'), errPrivacy: L('Please accept the Privacy Notice to continue.', 'يرجى الموافقة على إشعار الخصوصية للمتابعة.'), errTerms: L('Please confirm you have read the session terms.', 'يرجى تأكيد أنك قرأت شروط الجلسات.'),
    taken: L('Sorry, that time was just taken. Please pick another.', 'عذرًا، تم حجز هذا الوقت للتو. اختر وقتًا آخر.'), failed: L('Something went wrong. Nothing was charged. Please try again or contact us.', 'حدث خطأ. لم يُخصم أي مبلغ. حاول مجددًا أو تواصل معنا.'), working: L('Working…', 'جارٍ التنفيذ…')
  },
  conf: {
    title: L('Your session', 'جلستك'), lead: L('Keep this page: it is your link to your sessions, your receipt and your invoice.', 'احتفظ بهذه الصفحة: فهي رابطك إلى جلساتك وإيصالك وفاتورتك.'),
    pending: L('Waiting for payment confirmation…', 'بانتظار تأكيد الدفع…'), pendingBody: L('If you have just paid, this page updates in a moment.', 'إن كنت قد دفعت للتو فستتحدّث الصفحة بعد لحظات.'), unpaid: L('We could not confirm a payment for this booking. Nothing has been confirmed.', 'تعذّر تأكيد دفع لهذا الحجز. لم يتم تأكيد أي شيء.'),
    confirmed: L('Booking confirmed', 'تم تأكيد الحجز'), ref: L('Reference', 'المرجع'), booked: L('Booked', 'محجوزة'), toSchedule: L('Not yet scheduled', 'لم تُجدول بعد'), done: L('Completed', 'مكتملة'),
    addCal: L('Add to calendar', 'أضف إلى التقويم'), reschedule: L('Reschedule', 'إعادة الجدولة'), schedule: L('Schedule this session', 'حدّد موعد هذه الجلسة'), invoice: L('Open invoice', 'افتح الفاتورة'), print: L('Print', 'طباعة'),
    left: L('sessions left to schedule', 'جلسات متبقية للجدولة'), validUntil: L('Schedule them before', 'حدّد موعدها قبل'), tooLate: L('This session is less than 24 hours away, so it can no longer be rescheduled online. Please contact us.', 'تبقّى على هذه الجلسة أقل من 24 ساعة، فلا يمكن إعادة جدولتها عبر الموقع. يرجى التواصل معنا.'),
    saved: L('Saved. We have emailed you the new time.', 'تم الحفظ. أرسلنا إليك الموعد الجديد بالبريد.'), notFound: L('We could not find this booking. Please open the link from your confirmation email.', 'تعذّر العثور على هذا الحجز. افتح الرابط من رسالة التأكيد.'), emailNote: L('A confirmation email is on its way. In demonstration mode it is only written to a local outbox.', 'رسالة التأكيد في الطريق. في وضع العرض تُحفظ في صندوق محلي فقط.')
  }
};
