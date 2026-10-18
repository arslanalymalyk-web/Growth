import { L } from './ui.mjs';

/** Saudi Readiness Scorecard: 24 statements, 6 dimensions, 4 answers each (0 to 3) plus "not sure". Scoring runs in the browser. */

export const SC_VERSION = 'sc-2026-1';

export const SC_PAGE = {
  meta: { title: L('Saudi Readiness Scorecard | Growth Blueprint', 'مقياس الجاهزية للسوق السعودي | غروث بلوبرينت'), description: L('A free 10-minute diagnostic. Answer 24 questions and get a personal readiness report with your strengths, your gaps and what to do first.', 'تشخيص مجاني في 10 دقائق. أجب عن 24 سؤالًا واحصل على تقرير جاهزية شخصي بنقاط قوتك وفجواتك وما تبدأ به أولًا.') },
  hero: { eyebrow: L('Free diagnostic · about 10 minutes', 'تشخيص مجاني · نحو 10 دقائق'), title: L('How ready are you for Saudi Arabia?', 'ما مدى جاهزيتك للسوق السعودي؟'),
    lead: L('Most businesses find out what they missed after they have started. This scorecard helps you find out before. Twenty-four honest questions, a score you can trust, and a report written for your situation.', 'تكتشف أغلب الشركات ما فاتها بعد أن تبدأ. هذا المقياس يساعدك على اكتشافه قبل ذلك. أربعة وعشرون سؤالًا بصدق، ونتيجة يمكنك الوثوق بها، وتقرير مكتوب لحالتك أنت.'), img: 'ck-hero-night' },
  start: L('Start the scorecard', 'ابدأ المقياس'), resume: L('Pick up where you left off', 'أكمل من حيث توقفت'),
  get: { eyebrow: L('What you get', 'ما الذي تحصل عليه'), title: L('A report you can actually use on Monday morning', 'تقرير يمكنك استخدامه فعلًا صباح الأحد'),
    items: [
      { icon: 'target', t: L('A clear score', 'نتيجة واضحة'), d: L('An overall readiness score and a score for each of six areas, so you can see at a glance where you are strong and where you are exposed.', 'درجة جاهزية إجمالية ودرجة لكل مجال من ستة مجالات، لترى بنظرة واحدة أين أنت قوي وأين أنت مكشوف.') },
      { icon: 'doc', t: L('A report written for you', 'تقرير مكتوب لك'), d: L('Not a generic PDF. What you read depends on your sector, your stage and the way you answered, including the questions you flagged as not sure.', 'ليس ملفًا عامًا. ما تقرؤه يعتمد على قطاعك ومرحلتك وطريقة إجابتك، بما فيها الأسئلة التي لم تكن متأكدًا منها.') },
      { icon: 'route', t: L('What to do first', 'ما تبدأ به أولًا'), d: L('Your three biggest gaps, a short list of actions for each, and a simple 30-day plan, so the result turns into movement.', 'أكبر ثلاث فجوات لديك، وقائمة قصيرة بالإجراءات لكل منها، وخطة بسيطة لثلاثين يومًا، لتتحول النتيجة إلى حركة.') }
    ] },
  how: { eyebrow: L('How it works', 'كيف يعمل'), title: L('Three steps, no sign-up', 'ثلاث خطوات دون تسجيل'),
    steps: [
      { n: '1', t: L('Tell us a little about you', 'عرّفنا بنفسك قليلًا'), d: L('Your sector, your stage and the size of your business. Nothing else, and none of it is required.', 'قطاعك ومرحلتك وحجم أعمالك. لا شيء غير ذلك، ولا شيء منه إلزامي.') },
      { n: '2', t: L('Answer 24 short statements', 'أجب عن 24 عبارة قصيرة'), d: L('Six areas, four statements each. Say how true each one is for you today. “Not sure” is a perfectly good answer.', 'ستة مجالات وأربع عبارات لكل منها. قل مدى انطباق كل عبارة عليك اليوم. “لست متأكدًا” إجابة مقبولة تمامًا.') },
      { n: '3', t: L('Read your report', 'اقرأ تقريرك'), d: L('See it on screen straight away, print it or save it as a PDF. If you want it emailed to you, we will ask, and only then.', 'اطلع عليه على الشاشة فورًا، واطبعه أو احفظه بصيغة PDF. وإن أردته على بريدك فسنسألك، وعندها فقط.') }
    ] },
  privacy: { title: L('Your answers stay with you', 'إجاباتك تبقى معك'), body: L('The scorecard runs in your browser. Your answers are saved on your own device so you can pause and come back, and they are not sent to us unless you choose to receive your report by email or ask us to get in touch. If you do, we use your details only for that, as explained in our Privacy Notice.', 'يعمل المقياس داخل متصفحك. تُحفظ إجاباتك على جهازك أنت لتتمكن من التوقف والعودة، ولا تُرسل إلينا إلا إذا اخترت استلام التقرير بالبريد أو طلبت أن نتواصل معك. وفي هذه الحالة نستخدم بياناتك لهذا الغرض فقط، كما يوضح إشعار الخصوصية لدينا.'), link: L('Read the Privacy Notice', 'اقرأ إشعار الخصوصية') },
  note: L('The scorecard is a guide to help you think and plan. It is not legal, tax or investment advice.', 'المقياس دليل يساعدك على التفكير والتخطيط. وليس مشورة قانونية أو ضريبية أو استثمارية.')
};

export const SC_UI = {
  ctx: { title: L('First, a little about you', 'أولًا، نبذة عنك'), body: L('This helps us tailor your report. You can skip any of it.', 'هذا يساعدنا على تفصيل تقريرك لك. ويمكنك تخطي أي سؤال.'),
    sector: L('Your sector', 'قطاعك'), stage: L('Where are you today?', 'أين أنت اليوم؟'), size: L('How big is your business?', 'ما حجم أعمالك؟'), choose: L('Choose one', 'اختر'), other: L('Another sector', 'قطاع آخر'),
    stages: [L('Exploring the idea', 'أستكشف الفكرة'), L('Decided, planning the entry', 'قررت وأخطط للدخول'), L('Setting up right now', 'أؤسس الآن'), L('Already operating, planning to grow', 'أعمل بالفعل وأخطط للنمو')],
    sizes: [L('1 to 10 people', 'من 1 إلى 10 أفراد'), L('11 to 50 people', 'من 11 إلى 50 فردًا'), L('51 to 250 people', 'من 51 إلى 250 فردًا'), L('More than 250 people', 'أكثر من 250 فردًا')] },
  scale: [L('Not yet', 'ليس بعد'), L('Partly', 'جزئيًا'), L('Mostly', 'في الغالب'), L('Fully', 'بالكامل')],
  unsure: L('Not sure', 'لست متأكدًا'),
  q: L('How true is this for you today?', 'ما مدى انطباق هذا عليك اليوم؟'),
  step: L('Part', 'الجزء'), of: L('of', 'من'), min: L('About', 'نحو'), minutes: L('min left', 'دقائق متبقية'),
  back: L('Back', 'رجوع'), next: L('Next', 'التالي'), finish: L('See my report', 'اعرض تقريري'),
  saved: L('Your progress is saved on this device.', 'تقدّمك محفوظ على هذا الجهاز.'),
  answerAll: L('Please answer every statement in this part to continue. “Not sure” counts.', 'يرجى الإجابة عن كل عبارة في هذا الجزء للمتابعة. و“لست متأكدًا” إجابة صالحة.'),
  noJs: L('The scorecard needs JavaScript. Please turn it on, or book a call and we will walk through it with you.', 'يحتاج المقياس إلى تفعيل جافاسكربت. يرجى تفعيله، أو احجز مكالمة وسنراجعه معك.')
};

export const SC_DIMS = [
  { id: 'strategy', icon: 'chess', t: L('Strategy & ambition', 'الاستراتيجية والطموح'), d: L('Why Saudi Arabia, why now, and what you are really signing up for.', 'لماذا السعودية، ولماذا الآن، وما الذي تلتزم به فعلًا.'), svc: ['market-intelligence'],
    q: [
      L('We can explain, in a couple of sentences, why we want to be in Saudi Arabia and what success looks like in three years.', 'نستطيع أن نشرح في جملتين لماذا نريد التواجد في السعودية وكيف يبدو النجاح بعد ثلاث سنوات.'),
      L('We have studied the Saudi market for our product or service, including who is already serving it.', 'درسنا السوق السعودي لمنتجنا أو خدمتنا، بما في ذلك من يخدمه بالفعل.'),
      L('Our offer has been adapted for Saudi customers rather than copied across from another market.', 'كيّفنا عرضنا للعميل السعودي ولم ننقله كما هو من سوق آخر.'),
      L('Our leadership is committed to Saudi Arabia for the long haul, not just a quick test.', 'قيادتنا ملتزمة بالسوق السعودي على المدى الطويل، وليس مجرد تجربة سريعة.')] },
  { id: 'customers', icon: 'users', t: L('Customers & demand', 'العملاء والطلب'), d: L('Who will buy, why they will choose you, and how you will reach them.', 'من سيشتري، ولماذا سيختارك، وكيف ستصل إليهم.'), svc: ['cultural-business-advisory', 'market-intelligence'],
    q: [
      L('We know which type of customer we want to win first, and which ones we are not chasing yet.', 'نعرف نوع العميل الذي نريد كسبه أولًا، ومن لا نلاحقهم بعد.'),
      L('We have spoken to real potential Saudi customers, and what they told us shaped our plans.', 'تحدثنا مع عملاء سعوديين محتملين حقيقيين، وما قالوه أثّر في خططنا.'),
      L('We understand how customers in our sector actually buy here: who decides, how long it takes, how they pay.', 'نفهم كيف يشتري العملاء في قطاعنا هنا فعلًا: من يقرر، وكم يستغرق الأمر، وكيف يدفعون.'),
      L('We have a first-year plan for finding customers, with channels, partners and a realistic sales cycle.', 'لدينا خطة للسنة الأولى لإيجاد العملاء، بقنواتها وشركائها ودورة مبيعات واقعية.')] },
  { id: 'setup', icon: 'building', t: L('Setup & compliance', 'التأسيس والامتثال'), d: L('The legal entity, the licences and the practical business of opening your doors.', 'الكيان القانوني والتراخيص والجانب العملي لافتتاح أعمالك.'), svc: ['market-entry-guidance'],
    q: [
      L('We know which legal structure suits us (for example a branch, a subsidiary or a joint venture) and why.', 'نعرف الهيكل القانوني الأنسب لنا (فرع أو شركة تابعة أو مشروع مشترك مثلًا) ولماذا.'),
      L('We know which licences and approvals apply to our activity, and roughly how long they take.', 'نعرف التراخيص والموافقات التي ينطبق علينا، وكم تستغرق تقريبًا.'),
      L('We have thought about where we will work (office, site, warehouse, shared space) and what it costs.', 'فكرنا في مكان عملنا (مكتب أو موقع أو مستودع أو مساحة مشتركة) وكلفته.'),
      L('Our setup timeline is realistic, with some room built in for delays.', 'جدولنا الزمني للتأسيس واقعي، وفيه هامش للتأخير.')] },
  { id: 'people', icon: 'person', t: L('People & leadership', 'الكفاءات والقيادة'), d: L('Who runs it, who joins them, and how Saudisation fits in.', 'من يديرها، ومن ينضم إليه، وأين يندرج التوطين.'), svc: ['cultural-business-advisory'],
    q: [
      L('We know who will lead our Saudi operation, and they have the authority to decide quickly.', 'نعرف من سيقود عملياتنا في السعودية، ولديه الصلاحية ليقرر بسرعة.'),
      L('We understand Saudisation (Nitaqat) expectations for a business like ours and have a plan for them.', 'نفهم متطلبات التوطين (نطاقات) لأعمال مثل أعمالنا ولدينا خطة لها.'),
      L('We know which roles we need to hire first and how we will find the right people.', 'نعرف الأدوار التي نحتاج توظيفها أولًا وكيف سنجد الأشخاص المناسبين.'),
      L('We have a plan for relocating or hosting people from our team, including visas and family needs.', 'لدينا خطة لانتقال أفراد من فريقنا أو استضافتهم، بما فيها التأشيرات واحتياجات الأسرة.')] },
  { id: 'partners', icon: 'handshake', t: L('Partners & ecosystem', 'الشركاء والمنظومة'), d: L('Who can open doors, who you can rely on, and who you should be careful with.', 'من يفتح لك الأبواب، ومن تعتمد عليه، ومن تحتاج الحذر معه.'), svc: ['strategic-introductions'],
    q: [
      L('We have a clear idea of what we need a local partner for, or why we do not need one.', 'لدينا تصور واضح لحاجتنا إلى شريك محلي، أو لماذا لا نحتاج إليه.'),
      L('We have a shortlist of possible partners, distributors or suppliers, and we know how we would check them out.', 'لدينا قائمة مختصرة بشركاء أو موزعين أو موردين محتملين، ونعرف كيف سنتحقق منهم.'),
      L('We have talked to at least one organisation that has already done what we are about to do.', 'تحدثنا مع جهة واحدة على الأقل سبق أن فعلت ما نوشك أن نفعله.'),
      L('We know how a partnership would be structured: who decides, who earns what, and how either side could exit.', 'نعرف كيف ستُهيكل الشراكة: من يقرر، ومن يكسب ماذا، وكيف يمكن لأي طرف الخروج.')] },
  { id: 'finance', icon: 'coins', t: L('Finance & governance', 'المالية والحوكمة'), d: L('Money, tax, decision-making and what happens when things do not go to plan.', 'المال والضرائب واتخاذ القرار، وما يحدث حين لا تسير الأمور وفق الخطة.'), svc: ['market-entry-guidance'],
    q: [
      L('We have a budget for the first 18 to 24 months that covers setup costs and the time before revenue arrives.', 'لدينا ميزانية لأول 18 إلى 24 شهرًا تغطي تكاليف التأسيس والفترة التي تسبق وصول الإيرادات.'),
      L('We understand the basics of our Saudi tax obligations (VAT, zakat or corporate income tax, withholding tax).', 'نفهم أساسيات التزاماتنا الضريبية في السعودية (ضريبة القيمة المضافة، والزكاة أو ضريبة الدخل، وضريبة الاستقطاع).'),
      L('We know how decisions, reporting and approvals between head office and Saudi will work.', 'نعرف كيف ستسير القرارات والتقارير والموافقات بين المقر الرئيسي والسعودية.'),
      L('We have thought through what could go wrong (delays, partner problems, regulation, currency) and what we would do.', 'فكرنا فيما قد يسوء (تأخيرات أو مشكلات شركاء أو أنظمة أو عملة) وماذا سنفعل.')] }
];

export const SC_BANDS = [
  { min: 0, id: 'early', t: L('Just getting started', 'في البداية'), c: '#b8944d',
    p: L('You are at the very start, and that is a perfectly good place to be, because every decision is still cheap to change. The biggest risk right now is not a wrong answer. It is moving ahead on assumptions nobody has tested. Use this report as a list of questions to answer before you spend serious money.', 'أنت في البداية تمامًا، وهذا مكان جيد، لأن تغيير أي قرار ما زال رخيصًا. وأكبر خطر الآن ليس إجابة خاطئة، بل المضي على افتراضات لم يختبرها أحد. استخدم هذا التقرير قائمةً بأسئلة تجيب عنها قبل أن تنفق مبالغ جدية.') },
  { min: 30, id: 'foundations', t: L('Building your foundations', 'تبني أساساتك'),  c: '#b8944d',
    p: L('You have done real thinking, and some of the pieces are in place. But there are gaps that tend to be expensive when they are found late. The good news is that most of them can be closed in weeks, not months, if you pick the right ones first.', 'لقد فكرت جيدًا، وبعض القطع في مكانها. لكن هناك فجوات يكلّف اكتشافها متأخرًا الكثير. والخبر الجيد أن أغلبها يُغلق في أسابيع لا أشهر، إن اخترت الأهم منها أولًا.') },
  { min: 55, id: 'nearly', t: L('Nearly there', 'على وشك الجاهزية'), c: '#7a5c22',
    p: L('You are well prepared. Most of the big questions have an answer, and a few of them have a good one. What is left is mostly detail and sequencing, and a couple of areas that deserve a second look before you commit.', 'أنت مستعد جيدًا. أغلب الأسئلة الكبيرة لها جواب، وبعضها جوابه ممتاز. ما تبقى تفاصيل وترتيب، ومجالان أو ثلاثة تستحق نظرة ثانية قبل أن تلتزم.') },
  { min: 80, id: 'ready', t: L('Ready to move', 'جاهز للانطلاق'), c: '#1d3760',
    p: L('This is a strong result. You have thought it through, tested it, and planned for things going wrong. The job now is execution: keeping the momentum, not letting a lower-scoring area slow you down, and checking your assumptions again as the market answers back.', 'هذه نتيجة قوية. فكّرت ودقّقت وخططت لاحتمال تعثر الأمور. المهمة الآن هي التنفيذ: حافظ على الزخم، ولا تدع مجالًا أقل درجة يبطئك، وراجع افتراضاتك مجددًا كلما ردّ عليك السوق.') }
];

/** Per area: what the level means, and what to do. levels: low (<40), mid (40-69), high (70+) */
export const SC_REPORT = {
  strategy: {
    low: { m: L('The case for Saudi Arabia is still more instinct than plan. That is common and fixable, but it is the area that most often decides whether the rest of the effort is pointed in the right direction.', 'الحجة للسوق السعودي ما زالت حدسًا أكثر منها خطة. وهذا شائع وقابل للإصلاح، لكنه المجال الذي يقرر غالبًا إن كان باقي الجهد موجّهًا في الاتجاه الصحيح.'),
      a: [L('Write your “why Saudi, why now” in half a page and show it to someone who will disagree with it.', 'اكتب “لماذا السعودية ولماذا الآن” في نصف صفحة وأرِها لمن سيخالفك الرأي.'), L('Map three competitors already selling to your target customers and note how they win.', 'ارسم خريطة لثلاثة منافسين يبيعون بالفعل لعملائك المستهدفين، ودوّن كيف يفوزون.'), L('Decide what you would need to see in 12 months to call this a success, or to stop.', 'حدّد ما تحتاج رؤيته بعد 12 شهرًا لتعدّ التجربة ناجحة، أو لتتوقف.')] },
    mid: { m: L('You have a reasonable thesis and some evidence behind it. The next step is to stress-test it, especially the parts that rely on your experience in other markets.', 'لديك فرضية معقولة وبعض الأدلة خلفها. الخطوة التالية اختبارها بجدية، خاصة الأجزاء التي تعتمد على تجربتك في أسواق أخرى.'),
      a: [L('List your three biggest assumptions and find one way to test each before you commit money.', 'دوّن أكبر ثلاثة افتراضات لديك وابحث عن طريقة لاختبار كل منها قبل الالتزام بالمال.'), L('Check what in your offer needs to change for Saudi customers, from pricing to language to service levels.', 'راجع ما يحتاج التغيير في عرضك للعميل السعودي، من التسعير إلى اللغة إلى مستويات الخدمة.')] },
    high: { m: L('Your strategy is clear and grounded. You know why you are here and what you are trying to achieve.', 'استراتيجيتك واضحة ومبنية على أسس. تعرف لماذا أنت هنا وما الذي تريد تحقيقه.'),
      a: [L('Turn it into a one-page plan with owners and dates, so the whole team is pulling the same way.', 'حوّلها إلى خطة من صفحة واحدة بأصحاب ومواعيد، ليشدّ الفريق كله في اتجاه واحد.')] } },
  customers: {
    low: { m: L('You do not yet have a sharp picture of who will buy from you, or why. Without it, marketing and sales spend tends to be scattered and slow to show results.', 'ليست لديك بعد صورة حادة عمّن سيشتري منك ولماذا. ودون ذلك يميل الإنفاق التسويقي والبيعي إلى التشتت والبطء في إظهار النتائج.'),
      a: [L('Pick one customer type to win first and describe them in detail: who they are, what they need, how they buy.', 'اختر نوع عميل واحدًا لتكسبه أولًا ووصفه بالتفصيل: من هو، وماذا يحتاج، وكيف يشتري.'), L('Have five conversations with people like them, before you build anything.', 'أجرِ خمسة حوارات مع أشخاص يشبهونه قبل أن تبني أي شيء.'), L('Find out how long a typical sale takes in your sector and plan your cash around it.', 'اعرف كم يستغرق البيع المعتاد في قطاعك وابنِ سيولتك على أساسه.')] },
    mid: { m: L('You know your market in outline. What is missing is detail: how decisions get made, how long they take, and what it costs to win the first few customers.', 'تعرف سوقك بخطوطه العامة. الناقص هو التفاصيل: كيف تُتخذ القرارات، وكم تستغرق، وكم يكلّف كسب أول العملاء.'),
      a: [L('Map the buying journey for your top customer type, step by step, including who has to say yes.', 'ارسم رحلة الشراء لأهم نوع عملاء لديك خطوة بخطوة، بمن فيهم من يجب أن يوافق.'), L('Turn your first-year customer plan into numbers: leads, meetings, proposals, wins.', 'حوّل خطة عملاء السنة الأولى إلى أرقام: عملاء محتملون واجتماعات وعروض وصفقات.')] },
    high: { m: L('You understand your Saudi customers well and have a plan to reach them. That is a real advantage, and many businesses never get here.', 'تفهم عملاءك السعوديين جيدًا ولديك خطة للوصول إليهم. وهذه ميزة حقيقية، وكثير من الشركات لا تصلها أبدًا.'),
      a: [L('Start a small pilot with two or three customers and let the results update your plan.', 'ابدأ تجربة صغيرة مع عميلين أو ثلاثة ودع النتائج تحدّث خطتك.')] } },
  setup: {
    low: { m: L('The practical side of setting up is still a blur. Entity choice, licences and premises all affect each other, and getting the order wrong is how projects lose months.', 'الجانب العملي للتأسيس ما زال ضبابيًا. اختيار الكيان والتراخيص والمقر تؤثر في بعضها، وخطأ الترتيب هو ما يضيّع الأشهر على المشاريع.'),
      a: [L('List every activity you will carry out in Saudi Arabia. Licensing follows activity, so this comes first.', 'دوّن كل نشاط ستمارسه في السعودية. فالترخيص يتبع النشاط، ولذلك يأتي هذا أولًا.'), L('Compare two or three entity options on control, cost, speed and liability, with your adviser.', 'قارن بين خيارين أو ثلاثة للكيان من حيث التحكم والتكلفة والسرعة والمسؤولية، مع مستشارك.'), L('Ask what you could do while approvals are pending, so you are not waiting idle.', 'اسأل عمّا يمكنك فعله أثناء انتظار الموافقات حتى لا تنتظر دون عمل.')] },
    mid: { m: L('You understand the main steps and have probably started. The risks now are sequencing, hidden dependencies and optimistic timelines.', 'تفهم الخطوات الرئيسية وربما بدأت. المخاطر الآن هي الترتيب والاعتماديات الخفية والجداول المتفائلة.'),
      a: [L('Build a dependency map: which approval needs which document, and which step waits on which.', 'ابنِ خريطة اعتماديات: أي موافقة تحتاج أي مستند، وأي خطوة تنتظر أي خطوة.'), L('Add a 25 to 30 percent buffer to every timeline you were given. Then check what it does to your launch date.', 'أضف هامشًا بنسبة 25 إلى 30 بالمئة لكل جدول أُعطيته. ثم انظر أثره على موعد الإطلاق.')] },
    high: { m: L('Your setup is well thought through, with a realistic timeline.', 'تأسيسك مدروس جيدًا وبجدول زمني واقعي.'),
      a: [L('Keep a living checklist of approvals and renewals so nothing quietly expires after launch.', 'احتفظ بقائمة حيّة للموافقات والتجديدات حتى لا ينتهي شيء بصمت بعد الإطلاق.')] } },
  people: {
    low: { m: L('Nobody has clear ownership of the Saudi operation yet, and the hiring and localisation picture is still open. Strong local leadership is the single biggest predictor of how fast things move.', 'لا يملك أحد بعد المسؤولية الواضحة عن العمليات في السعودية، وصورة التوظيف والتوطين ما زالت مفتوحة. والقيادة المحلية القوية هي أكبر عامل منفرد في سرعة تقدم الأمور.'),
      a: [L('Name one accountable leader for Saudi Arabia, even if the role is part-time at first.', 'سمِّ قائدًا واحدًا مسؤولًا عن السعودية، حتى لو كان الدور بدوام جزئي في البداية.'), L('Find out what Saudisation means for a business of your size and sector, before you design the team.', 'اعرف ما يعنيه التوطين لأعمال بحجمك وقطاعك، قبل أن تصمم الفريق.'), L('Write the first three roles you need, in the order you need them.', 'اكتب أول ثلاثة أدوار تحتاجها بالترتيب الذي تحتاجه.')] },
    mid: { m: L('You have thought about people, but not everything is settled. The usual gaps are decision-making authority on the ground and a realistic hiring plan.', 'فكرت في الكفاءات لكن ليس كل شيء محسومًا. والفجوات المعتادة هي صلاحية اتخاذ القرار على الأرض وخطة توظيف واقعية.'),
      a: [L('Agree what your Saudi leader can decide alone, and what needs head-office approval. Write it down.', 'اتفقوا على ما يقرره قائدكم في السعودية وحده وما يحتاج موافقة المقر الرئيسي. واكتبوه.'), L('Check salary expectations for your first hires against the local market before you make offers.', 'تحقق من توقعات الرواتب لأول موظفيك مقارنة بالسوق المحلي قبل تقديم العروض.')] },
    high: { m: L('Your people plan is strong: clear leadership, a view on localisation and a way to find talent.', 'خطتك للكفاءات قوية: قيادة واضحة ورؤية للتوطين وطريقة لإيجاد المواهب.'),
      a: [L('Plan how you will keep your first hires engaged and growing. Early departures are expensive.', 'خطط لكيفية إبقاء أول موظفيك متحمسين ونامين. فالمغادرة المبكرة مكلفة.')] } },
  partners: {
    low: { m: L('You have not yet worked out whether you need partners, or how you would find and test them. In Saudi Arabia, relationships often decide the pace, so this matters more than it first appears.', 'لم تحدد بعد إن كنت تحتاج شركاء ولا كيف ستجدهم وتختبرهم. وفي السعودية تحدد العلاقات غالبًا الوتيرة، فالأمر أهم مما يبدو أول وهلة.'),
      a: [L('Write down what you would want from a partner: access, licences, distribution, capital, credibility.', 'دوّن ما تريده من الشريك: الوصول أو التراخيص أو التوزيع أو رأس المال أو المصداقية.'), L('Ask three people who have entered the market who they would recommend, and who they would not.', 'اسأل ثلاثة ممن دخلوا السوق عمّن يوصون به وعمّن لا يوصون به.'), L('Do not sign anything exclusive until you have compared at least three options.', 'لا توقّع على أي حصرية قبل أن تقارن ثلاثة خيارات على الأقل.')] },
    mid: { m: L('You have some partner ideas and conversations under way. The risk is falling for the first friendly option instead of the best one.', 'لديك بعض أفكار الشركاء وحوارات قائمة. والخطر أن تنجذب إلى أول خيار ودود بدل أفضل خيار.'),
      a: [L('Score each candidate against the same criteria: capability, reputation, financial standing, fit.', 'قيّم كل مرشح بنفس المعايير: القدرة والسمعة والمركز المالي والتوافق.'), L('Agree the exit terms early, while everyone still likes each other.', 'اتفقوا على شروط الخروج مبكرًا، ما دام الجميع ما زال على وفاق.')] },
    high: { m: L('You know what you need from partners and how to evaluate them, which puts you ahead of most.', 'تعرف ما تحتاجه من الشركاء وكيف تقيّمهم، وهذا يضعك أمام أغلب الشركات.'),
      a: [L('Set up a simple way to review the partnership every quarter, against the goals you agreed.', 'ضع طريقة بسيطة لمراجعة الشراكة كل ربع سنة مقابل الأهداف المتفق عليها.')] } },
  finance: {
    low: { m: L('The financial picture and the governance around it are not yet in place. Businesses rarely fail in Saudi Arabia because the idea was wrong. More often they run out of runway, or discover a tax or control issue late.', 'الصورة المالية والحوكمة حولها ليستا جاهزتين بعد. وقلّما تفشل الشركات في السعودية لأن الفكرة كانت خاطئة، بل لأن السيولة تنفد، أو لأنها تكتشف مشكلة ضريبية أو رقابية متأخرًا.'),
      a: [L('Build a simple 24-month cash plan, with setup costs, running costs and a realistic date for first revenue.', 'ابنِ خطة نقدية بسيطة لأربعة وعشرين شهرًا، بتكاليف التأسيس والتشغيل وموعد واقعي لأول إيراد.'), L('Speak to a licensed tax adviser early about VAT, zakat or corporate tax, and withholding tax.', 'تحدث مبكرًا مع مستشار ضريبي مرخّص عن ضريبة القيمة المضافة والزكاة أو ضريبة الدخل وضريبة الاستقطاع.'), L('Decide who signs off spending in Saudi Arabia, and up to what amount.', 'حدّد من يعتمد الإنفاق في السعودية وبأي سقف.')] },
    mid: { m: L('You have a financial plan and some controls. The common weak spots are the time before revenue, the tax detail, and what happens if a plan slips.', 'لديك خطة مالية وبعض الضوابط. ونقاط الضعف الشائعة هي الفترة قبل الإيراد، وتفاصيل الضرائب، وما يحدث إن تعثرت خطة.'),
      a: [L('Stress-test your cash plan with a six-month delay in revenue. Is it still survivable?', 'اختبر خطتك النقدية بتأخر الإيراد ستة أشهر. هل ما زالت محتملة؟'), L('Write a short risk register with the five things most likely to go wrong, and an owner for each.', 'اكتب سجل مخاطر قصيرًا بأكثر خمسة أمور احتمالًا للتعثر، ولكل منها مسؤول.')] },
    high: { m: L('Your finances and governance are in good shape: a realistic budget, clear tax thinking and defined decision rights.', 'ماليتك وحوكمتك في حال جيدة: ميزانية واقعية وتفكير ضريبي واضح وصلاحيات قرار محددة.'),
      a: [L('Schedule a review every quarter, so the plan keeps up with what you learn.', 'حدّد مراجعة كل ربع سنة لتواكب الخطة ما تتعلمه.')] } }
};

export const SC_STAGE_PLAN = {
  0: [L('Write your Saudi thesis in half a page and test it with two people who know the market.', 'اكتب فرضيتك للسوق السعودي في نصف صفحة واختبرها مع شخصين يعرفان السوق.'), L('Talk to five potential customers. Listen more than you pitch.', 'تحدث مع خمسة عملاء محتملين. استمع أكثر مما تعرض.'), L('Do not spend on legal setup until the thesis survives these conversations.', 'لا تنفق على التأسيس القانوني قبل أن تصمد الفرضية أمام هذه الحوارات.')],
  1: [L('Choose your entity option with your advisers and list the licences it needs.', 'اختر خيار الكيان مع مستشاريك وحدّد التراخيص التي يحتاجها.'), L('Name your Saudi leader and agree what they can decide alone.', 'سمِّ قائدك في السعودية واتفق على ما يقرره وحده.'), L('Draw up a 24-month cash plan and a realistic launch timeline with a buffer.', 'ضع خطة نقدية لأربعة وعشرين شهرًا وجدول إطلاق واقعيًا بهامش.')],
  2: [L('Build a dependency map of your approvals and chase the one on the critical path first.', 'ابنِ خريطة اعتماديات لموافقاتك وتابع أولًا التي على المسار الحرج.'), L('Use the waiting time to start partner conversations and customer pilots.', 'استثمر وقت الانتظار في بدء حوارات الشركاء وتجارب العملاء.'), L('Put governance in place now: who approves what, and how head office hears about it.', 'ضع الحوكمة الآن: من يعتمد ماذا، وكيف يعلم المقر الرئيسي.')],
  3: [L('Pick the one growth bet that matters most this year and give it an owner and a number.', 'اختر رهان النمو الأهم هذا العام وأعطه مسؤولًا ورقمًا.'), L('Review your partners against what you agreed. Fix or replace the ones that are not delivering.', 'راجع شركاءك مقابل ما اتفقتم عليه. أصلح أو استبدل من لا يحقق.'), L('Check your localisation and succession plans before you scale the team.', 'راجع خطط التوطين والتعاقب قبل توسيع الفريق.')]
};

export const SC_SECTOR_NOTE = {
  fmcg: L('In consumer goods, shelf access and distributor relationships usually decide the pace, so partner quality and first-year working capital deserve extra attention.', 'في السلع الاستهلاكية يحدد الوصول إلى الرفوف وعلاقات الموزعين الوتيرة عادةً، لذا تستحق جودة الشريك ورأس المال العامل في السنة الأولى اهتمامًا إضافيًا.'),
  'real-estate': L('In real estate, regulation, land and the choice of delivery partners shape everything. Check approvals and contractor capacity early.', 'في العقارات تحدد الأنظمة والأراضي واختيار شركاء التنفيذ كل شيء. تحقق مبكرًا من الموافقات وقدرة المقاولين.'),
  hospitality: L('In hospitality, talent and operating standards are the hard part. Plan your hiring and training before you plan your opening date.', 'في الضيافة تكون الكفاءات ومعايير التشغيل هي الأصعب. خطط للتوظيف والتدريب قبل أن تخطط لموعد الافتتاح.'),
  manufacturing: L('In manufacturing, site, incentives and supply chain come first. Localisation targets and skilled labour can set your timeline.', 'في التصنيع يأتي الموقع والحوافز وسلسلة الإمداد أولًا. وقد تحدد أهداف التوطين والعمالة الماهرة جدولك الزمني.'),
  'technology-digital': L('In technology, who the buyer is (enterprise or government) and how they procure will shape your sales cycle. Data and hosting questions often surface early.', 'في التقنية، تحدد هوية المشتري (مؤسسة أم جهة حكومية) وطريقة شرائه دورة مبيعاتك. وغالبًا تظهر أسئلة البيانات والاستضافة مبكرًا.'),
  'construction-engineering': L('In construction, project pipelines, prequalification and partner capacity matter. Cash flow across long payment cycles is a classic pressure point.', 'في الإنشاءات تهم مسارات المشاريع والتأهيل المسبق وقدرة الشركاء. ويظل التدفق النقدي عبر دورات دفع طويلة نقطة ضغط تقليدية.'),
  'healthcare-life-sciences': L('In healthcare, regulatory approvals and clinical or product standards come first. Allow for longer lead times than in most sectors.', 'في الرعاية الصحية تأتي الموافقات التنظيمية والمعايير الطبية أو معايير المنتج أولًا. اترك مدة أطول مما تحتاجه أغلب القطاعات.'),
  'logistics-supply-chain': L('In logistics, location, customs and network partners decide your economics. Test the routes, not just the plan.', 'في اللوجستيات يحدد الموقع والجمارك وشركاء الشبكة اقتصادياتك. اختبر المسارات لا الخطة فقط.'),
  'retail-ecommerce': L('In retail and e-commerce, customer expectations on delivery, payment and Arabic experience are high. Get these right before you scale marketing.', 'في التجزئة والتجارة الإلكترونية تكون توقعات العملاء عالية في التوصيل والدفع والتجربة العربية. أحكمها قبل توسيع التسويق.'),
  'professional-business-services': L('In professional services, reputation and relationships are your product. Plan how you will build credibility before you scale the team.', 'في الخدمات المهنية تكون السمعة والعلاقات هي منتجك. خطط لكيفية بناء المصداقية قبل توسيع الفريق.'),
  'tourism-leisure': L('In tourism and leisure, seasonality, destination partners and licensing shape your plan. Pilot with a small group before you invest in scale.', 'في السياحة والترفيه تشكّل الموسمية وشركاء الوجهات والتراخيص خطتك. جرّب مع مجموعة صغيرة قبل أن تستثمر في التوسع.')
};

export const SC_RESULT = {
  meta: { title: L('Your readiness report | Growth Blueprint', 'تقرير جاهزيتك | غروث بلوبرينت'), description: L('Your personal Saudi readiness report.', 'تقرير جاهزيتك الشخصي للسوق السعودي.') },
  eyebrow: L('Your Saudi readiness report', 'تقرير جاهزيتك للسوق السعودي'), overall: L('Overall readiness', 'الجاهزية الإجمالية'), outOf: L('out of 100', 'من 100'),
  by: L('Your score by area', 'نتيجتك في كل مجال'), strengths: L('Where you are strong', 'أين أنت قوي'), priorities: L('Your three biggest gaps', 'أكبر ثلاث فجوات لديك'), noStrength: L('Nothing scored above 70 yet. That is fine: it just tells you where to start.', 'لا مجال تجاوز 70 بعد. وهذا طبيعي: فهو يخبرك فقط من أين تبدأ.'),
  detail: L('Area by area', 'مجالًا بعد مجال'), whatItMeans: L('What this means', 'ماذا يعني هذا'), doNext: L('What to do next', 'ما تفعله بعد ذلك'),
  flagged: { t: L('Questions to settle first', 'أسئلة تحتاج حسمًا أولًا'), d: L('You answered “not yet” or “not sure” to these. They are the quickest way to reduce risk.', 'أجبت عنها بـ“ليس بعد” أو “لست متأكدًا”. وهي أسرع طريق لتقليل المخاطر.') },
  sector: L('A note for your sector', 'ملاحظة لقطاعك'), plan: L('Your first 30 days', 'أول 30 يومًا لك'),
  help: { t: L('Where we can help', 'أين يمكننا المساعدة'), d: L('Based on your gaps, these are the services most likely to be useful.', 'بحسب فجواتك، هذه الخدمات الأكثر احتمالًا لأن تفيدك.') },
  brief: { t: L('A sector brief for you', 'موجز قطاعي لك'), d: L('If you would like to go deeper on your sector, this brief is a good next read.', 'إن أردت التعمق في قطاعك فهذا الموجز قراءة تالية جيدة.'), cta: L('See the brief', 'اطلع على الموجز') },
  cta: { t: L('Want to talk it through?', 'تريد أن نناقشها معًا؟'), d: L('A 30-minute conversation is usually enough to turn this report into a plan. No pressure, no obligation.', 'تكفي عادةً محادثة من 30 دقيقة لتحويل هذا التقرير إلى خطة. دون ضغط ودون التزام.') },
  email: { t: L('Get this report by email', 'احصل على هذا التقرير بالبريد'), d: L('We will send you a copy and, if you tick the box, nothing else unless you ask.', 'سنرسل لك نسخة، ولن نرسل غير ذلك ما لم تطلب، إلا إن وافقت بتأشير الخانة.'),
    plink: L('Privacy Notice', 'إشعار الخصوصية'), name: L('Your name', 'اسمك'), mail: L('Email address', 'البريد الإلكتروني'), company: L('Company (optional)', 'الشركة (اختياري)'),
    consent: L('I agree that Growth Blueprint may use my details and my scorecard result to send me my report and to reply to me. I have read the', 'أوافق على أن تستخدم غروث بلوبرينت بياناتي ونتيجتي في المقياس لإرسال تقريري والرد علي. وقد قرأت'),
    marketing: L('Optional: send me the monthly Growth Blueprint brief, and occasional news. I can unsubscribe at any time.', 'اختياري: أرسلوا لي موجز غروث بلوبرينت الشهري وأخبارًا من حين لآخر. ويمكنني إلغاء الاشتراك في أي وقت.'),
    send: L('Email me my report', 'أرسلوا لي تقريري'), done: L('Thank you. Your request has been received.', 'شكرًا لك. تم استلام طلبك.'), demo: L('Demonstration mode: nothing was sent because this copy of the site is not connected to our server.', 'وضع تجريبي: لم يُرسل شيء لأن هذه النسخة من الموقع غير متصلة بخادمنا.') },
  print: L('Print or save as PDF', 'اطبع أو احفظ بصيغة PDF'), retake: L('Retake the scorecard', 'أعد المقياس'), book: L('Book a conversation', 'احجز محادثة'),
  none: L('We could not find your answers on this device. Please take the scorecard first.', 'لم نجد إجاباتك على هذا الجهاز. يرجى إجراء المقياس أولًا.'),
  disclaimer: L('This report is generated from your own answers and is meant as a starting point. It is not legal, tax or investment advice, and it does not guarantee any outcome.', 'أُعدّ هذا التقرير من إجاباتك أنت، وهو نقطة انطلاق. وليس مشورة قانونية أو ضريبية أو استثمارية، ولا يضمن أي نتيجة.'),
  levels: { low: L('Needs attention', 'يحتاج اهتمامًا'), mid: L('Taking shape', 'يتشكل'), high: L('Strong', 'قوي') },
  generated: L('Prepared by Growth Blueprint', 'أعدّته غروث بلوبرينت'), on: L('on', 'بتاريخ')
};
