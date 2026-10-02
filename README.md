# Bird SMS Egypt
واجهة HTML على GitHub Pages + Cloudflare Worker كوسيط آمن. مفتاح Bird لا يوضع في GitHub.

## النشر
1. ارفع محتويات هذا المجلد إلى GitHub.
2. انشر `frontend` عبر GitHub Pages.
3. أنشئ Cloudflare Worker باستخدام `worker/index.js`.
4. أضف Secret باسم `BIRD_API_KEY` في Cloudflare وضع مفتاح Bird الجديد.
5. أضف Variable باسم `ALLOWED_ORIGIN` بقيمة رابط GitHub Pages، مثل `https://USERNAME.github.io`.
6. افتح الصفحة وضع رابط Worker، ثم أرسل SMS.

لا تضع مفتاح Bird داخل HTML أو GitHub. يجب إلغاء المفتاح الذي تم نشره في المحادثة وإنشاء مفتاح جديد.
