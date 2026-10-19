# Getting 10 to 12 real testimonials

The site shows three client quotes today, because those are the three the firm has published. The slider is ready for 12: add real quotes and it fills automatically (controls appear, and it advances every 3 seconds, pausing on hover, focus, touch and for visitors who prefer reduced motion).

**I did not write testimonials for you.** Quotes from clients who never said them are fake reviews: they break advertising and consumer-protection rules, and one disproved quote damages every real one. Everything below makes the real thing quick.

## 1. Add a quote (one minute)
Edit `src/testimonials.json` and add an object. Then `npm run build`.

```json
{
  "name": "Client company name",
  "role": "Name, title (optional but strongly recommended)",
  "kind": { "en": "Saudi retailer", "ar": "شركة تجزئة سعودية" },
  "initials": "CC",
  "date": "2026-09",
  "quote": { "en": "…the client's own words…", "ar": "…" }
}
```
Keep the client's wording. Trim only with their approval.

## 2. Ask for it (copy, paste, send)
**Email (English)**
> Subject: Could we quote you? Two minutes
>
> Hello [Name],
> Thank you for working with us on [project in a few words]. Would you be willing to give us two or three sentences about the experience that we may publish on our website?
> If it helps, these questions might prompt it: What were you trying to do in Saudi Arabia? What was the hardest part? What difference did our help make?
> If you agree, please reply "Yes, you may publish my words" and tell us how you would like to be credited (name and title, company only, or anonymous by sector). You can withdraw permission at any time by writing to us.
> With thanks, [Your name], Growth Blueprint

**البريد (بالعربية)**
> الموضوع: هل يمكننا نشر رأيكم؟ دقيقتان فقط
>
> مرحبًا [الاسم]،
> شكرًا لتعاونكم معنا في [المشروع بإيجاز]. هل تتفضلون بكتابة جملتين أو ثلاث عن تجربتكم معنا لننشرها على موقعنا؟
> وقد تساعدكم هذه الأسئلة: ما الذي كنتم تسعون إليه في السعودية؟ ما أصعب جزء؟ وما الفرق الذي أحدثته مساعدتنا؟
> إن وافقتم فيرجى الرد بعبارة «نعم، يمكنكم نشر كلماتي» وإخبارنا كيف تودون أن نذكركم (الاسم والمنصب، أو الشركة فقط، أو بدون اسم مع ذكر القطاع). ويمكنكم سحب الموافقة في أي وقت بمراسلتنا.
> مع الشكر، [اسمكم]، غروث بلوبرينت

## 3. Keep the proof
Save each "yes" reply (it is your written permission) in a folder, with the date. If a client later asks for removal, delete the object from `src/testimonials.json`, rebuild and redeploy.

## 4. What makes a quote persuasive
- A named person and title beats a company alone; a company beats "anonymous".
- One concrete detail ("we had our licence plan agreed before the board meeting") beats praise ("great service").
- A mix of sectors and nationalities shows range. Aim for healthcare, manufacturing, real estate, technology and a founder-led business.
- Add a photo or logo only with permission; the slider shows initials by default.

## 5. Quick route to ten
Start with the clients you already have: the three named on the site, plus recent introductions, partners who referred you, and the firms in the network (law, accounting, marketing). A short call often yields a better quote than an email. Ten asks usually give five to seven quotes.
