# CHANGELOG

## [2026-09-07 16:00] — Etkinlik Galerisi Okları: Saf Kalın Chevron

- **`src/app/events/page.tsx` güncellendi** (`EventMedia` galeri önceki/sonraki butonları): Yuvarlak zeminli buton tasarımı (`bg-white/80 rounded-full shadow`, kenarlık/arka plan) tamamen kaldırıldı.
  - Butonlar artık `bg-transparent p-0` ve yalnız saf SVG chevron ikonlarından oluşuyor (kutu/border/yok).
  - Oklar: kalın keskin açılı chevron, `strokeWidth="3.5"`, `strokeLinecap/Linejoin="round"`, boyut `h-8 w-8 sm:h-10 sm:w-10`, `drop-shadow-sm`; sol `<` (`points="15 18 9 12 15 6"`), sağ `>` (`points="9 18 15 12 9 6"`). Renk `text-slate-800`, hover’da mercan `hover:text-brand-pink transition-colors`.
  - Konum: görselin sol/sağ kenarında dikeyde tam ortalı `absolute top-1/2 left-2/right-2 -translate-y-1/2`; alt rozet noktaları ve `index/total` sayacı korundu.
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz.

## [2026-09-07 15:58] — Events: Çoklu Görsel (images[]) Veri Modeli + Mini Galeri

- **`src/app/events/page.tsx` yeniden düzenlendi**: İleride eklenecek Admin Paneli / dinamik içerik girişine zemin hazırlayacak şekilde veri modeli ve arayüz güncellendi.
  - **Yeni veri modeli** `EventItem`: `id`, `title{en,el}`, `date{en,el}`, `location{en,el}`, `themeColor`, `images: string[]` (1..n), `col1{en,el}`, `col2{en,el}`. `EVENTS` dizisi bu arayüze göre yeniden yazıldı (5 etkinlik; biri tek görsel, gerisi 2 görsel).
  - **`EventMedia` bileşeni**: Görsel sayısına göre otomatik uyum — tek görselse sade vitrin; birden fazlaysa kaydırılabilir mini galeri (prev/next ok butonları, `index/total` sayaç rozeti sağ üstte, altta rozet noktaları). `next/image` ile çapraz-fade geçiş (`opacity`), `useState` ile aktif görsel.
  - **Zig-zag ritmi korundu**: Açık zeminli başlık/görsel alanı `index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'` ile değişiyor; sol tarafta başlık/tarih/konum, sağda görsel/galeri.
  - **Sınır hatları**: Renkli bloğun üst girişindeki açılı SVG dalga korundu; alt çıkıştaki ters `rotate-180` SVG kaldırıldı — blok altı düz `pb-16 md:pb-20` ile kapanıyor.
  - **Bağlam rozeti**: Renkli gövdenin sol üstünde `Highlights & Impact • {title}` / `Στιγμιότυπα & Αντίκτυπος • {title}` (`bg-white/10 text-white/90 border-white/20 rounded-full uppercase tracking-widest`); altında iki sütunlu `col1`/`col2` metni.
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz (kullanılmayan `Lang` import’u temizlendi).
> Not: `EventItem` yapısı admin panelinden gelecek veriyle birebir eşleşecek şekilde hazırlandı; tema rengi ve görsel listesi dinamik olarak SVG fill/arka plana ve galeriye bağlanıyor.

## [2026-09-07 15:51] — Events: Etkinlik Sınırları & Düz Alt Çıkış + Bağlam Rozeti

- **`src/app/events/page.tsx` güncellendi** (`EventStory`): Çift taraflı açılı SVG belirsizliği giderildi.
  - **Giriş açılı kaldı**: Üstten renkli bloğa giren SVG dalga (`-mb-px`, fill=themeColor) korundu.
  - **Alt çıkış düzleştirildi**: Renkli bloğun altındaki ters/`rotate-180` çıkış SVG’si tamamen kaldırıldı; `isLast` koşulu ve ilgili prop da silindi. Her renkli blok altı `pb-16 md:pb-20` ile düz bir taban olarak bitiyor; altından doğrudan sonraki etkinliğin açık zemini başlıyor. Son etkinlik düz tabanla koyu Footer’a bağlanıyor.
  - **Bağlam rozeti**: Renkli gövdenin en üstüne, iki sütunlu metnin hemen üzerine küçük bir aidiyet rozeti eklendi (`max-w-5xl mx-auto mb-6` içinde `text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/20`): EN `Highlights & Impact • {title}` / EL `Στιγμιότυπα & Αντίκτυπος • {title}` — kaydırırken metnin hangi etkinliğe ait olduğu net.
  - **Bölümler arası mesafe**: Açık zeminli başlık/görsel alanı `pt-16 md:pt-24` ile ferah bir boşluk bırakacak şekilde ayarlandı (zig-zag yön mantığı korundu).
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz.

## [2026-09-07 15:49] — Events: Zig-Zag Görsel Ritmi + Footer Öncesi Geçiş Düzeltmesi

- **`src/app/events/page.tsx` güncellendi** (`EventStory` bileşeni):
  - **Zig-zag (alternating) yerleşim**: Açık zeminli üst başlık/görsel alanı artık dizideki index’e göre yön değiştiriyor: `index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'`. Böylece 1. etkinlikte başlık solda/görsel sağda, 2.’de görsel solda/başlık sağda, 3.’te tekrar başlık solda... şeklinde akıcı bir görsel ritim sağlandı. `EventStory` props’larına `index` eklendi.
  - **Footer öncesi hatalı alt geçiş**: En alttaki son etkinlik için `isLast = index === EVENTS.length - 1` koşulu eklendi. Son etkinlikten çıkarken ters tepe SVG artık render edilmiyor (`{!isLast && <...>}`); bunun yerine son renk bloğunun alt dolgusu `pb-20 md:pb-28` yapıldı ve alt kısım düz bırakıldı. Böylece araya beyaz açılı üçgen girmedi; son etkinliğin rengi koyu yeşil Footer ile organik biçimde buluşuyor.
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz.

## [2026-09-07 15:43] — Events: Tam Ekran Akışkan Hikaye Şeridi (Full-Bleed Story Flow)

- **`src/app/events/page.tsx` yeniden yazıldı**: Tüm kutu/kart bileşenleri (border/shadow’lu kartlar), vitrin zig-zag kartları, featured kart ve ayrı zaman tüneli TAMAMEN kaldırıldı. Yerine her etkinliğin iki aşamalı tam ekran bloklar halinde aktığı editoryal hikaye akışı kuruldu.
- **Veri (`EVENTS` dizisi)**: Her öğe `id`, `themeColor`, görsel, EN/EL içerik (başlık, tarih, konum, 2 paragraf). `themeColor` SVG fill ve alt gövde arkaplanına dinamik bağlandı. Etkinlikler kronolojik sırada:
  1. ELA Launching & Annual GA — derin doğa yeşili `#165823`
  2. Kickstarter 2020 & Leadership Masterclass — derin petrol/teal `#1E4E5F`
  3. Inquiry-Based Learning & 100mentors — zengin mor `#4B164C`
  4. 1st TED-ed #WEME — sıcak kiremit/terracotta `#8C2D19`
  5. Students at Shakespeare's Globe — derin bordo/vişne `#4A151B`
- **1. Aşama (açık zemin)**: `max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-between gap-12`; solda büyük başlık `text-4xl sm:text-5xl font-black text-slate-900 leading-tight`, tarih `text-slate-500 font-semibold`, konum `inline SVG pin + text-slate-700`; sağda görsel `rounded-2xl overflow-hidden shadow-lg aspect-4/3 w-full lg:w-125 relative` (`next/image`).
- **Kesintisiz geçiş**: `w-full overflow-hidden leading-none -mb-px` içinde `preserveAspectRatio="none"` SVG (`M0,0 L600,80 L1200,0 L1200,120 L0,120 Z`, `h-12 md:h-20`), `style={{fill: themeColor}}` ile rengi alt bloğa eşit.
- **2. Aşama (tam genişlik renk bloğu)**: `w-full py-16 px-6 text-white`, `style={{backgroundColor: themeColor}}`; içerik `max-w-5xl mx-auto grid md:grid-cols-2 gap-8 text-white/90 text-base leading-relaxed` (EN/EL iki paragraf).
- **Alt çıkış (ters tepe)**: `w-full rotate-180 overflow-hidden leading-none -mt-px` + aynı SVG (fill theme) ile sonraki açık zemine geçiş.
- **Yapı**: `EventStory` bileşeni her blok için 4 parçayı (açık üst, giriş dalgası, renk gövdesi, çıkış dalgası) üretir; `EventStory` içi `useLanguage()` ile EN/EL geçişi; sayfa üstüne küçük bir başlık/rozet eklendi.
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz (`-mb-px`/`-mt-px`/`lg:w-125` standarda çevrildi).

## [2026-09-07 15:41] — Events: Hatalı Üçgen SVG’nin Silinmesi + Zaman Tüneli Arşivi

- **`src/app/events/page.tsx` yeniden düzenlendi**: Sayfa ortasındaki mızrak uçlu, hatalı SVG/polygon açılı ayırıcılar (üst `rotate-180` wedge + alt ters wedge ve ilgili div’ler) tamamen silindi. Sayfa temiz, iki seviyeli profesyonel bir yapıya kavuşturuldu.
  - **Vitrin (Top – Zig-Zag büyük kartlar)**: Yalnızca 2 güncel vitrin etkinlik gösteriliyor — `SHOWCASE` dizisi: 1) “1st TED-ed #WEME” (Mart 2023 / Atina Benaki), 2) “Read for Good Kampanyası” (Aralık 2020 / 27 okul, €7.590, 500+ çocuk). Her kart `rounded-3xl bg-white border-brand-pink-light p-8 md:p-12 flex lg:flex-row` + ters yön (`lg:flex-row-reverse`), `next/image` görsel, kategori rozeti, başlık, tarih/konum (SVG ikonlu), açıklama ve sponsorlar.
  - **Featured Impact Campaign kartı**: Eski tam genişlik koyu blok artık taşmayan, modern, bağımsız bir kart `my-16 rounded-3xl bg-brand-green text-white p-8 md:p-12 shadow-xl relative overflow-hidden`; kenarları temiz, içinde (kenarlıksız, `overflow-hidden`) mercan ışık küresi. İçerik 2 kolon: sol “Read for Good” açıklaması, sağ 3 metrik (27 / €7.590 / 500+). Hero/listeden bağımsız.
  - **Milestones & Past Events Timeline**: `Our Journey & Past Milestones` / `Η Πορεία & οι Δράσεις μας` başlığı (`text-3xl font-extrabold text-brand-green text-center mt-20 mb-12`). Sol çizgili dikey liste: `relative mx-auto max-w-4xl space-y-10 px-6` + ince `bg-brand-pink-light` çizgi; her satır `relative pl-10 md:pl-12`, satır hizasında mercan nokta `absolute top-6 left-0 h-4 w-4 rounded-full bg-brand-pink border-4 border-white shadow-sm`.
    - 7 gerçek tarihsel dönüm noktası kronolojik (Ocak 2019 ELA Lansmanı → Nisan 2019 1st Teacher Academy → Haziran 2019 Tzoumerka GA → Eylül 2019 1st Youth Summit/Human Rights → Ekim 2019 Extraordinary GA → Şubat 2020 Kickstarter & Leadership Masterclass → Mayıs 2020 Inquiry-Based Learning & 100mentors). Tüm metinler EN/EL.
  - **Timeline kart tasarımı**: `bg-white p-6 rounded-2xl border-slate-100 shadow-sm hover:border-brand-pink hover:shadow-md transition-all`; üstte tarih (`bg-brand-pink-light/60`) + konum (`bg-slate-100`) rozetleri yan yana; başlık `text-lg font-bold text-slate-900 mb-2`; açıklama `text-slate-600 text-sm leading-relaxed`.
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz (`left-1.75`/`w-0.5` spacing sınıflarına çevrildi).

## [2026-09-07 15:35] — Events: Açılı/Dalgalı Koyu Bölüm Geçişi (Angled Divider + Ambient Glow)

- **`src/app/events/page.tsx` güncellendi**: Hero ile etkinlik listesi arasına modernize açılı/üçgen zemin geçişli koyu yeşil bir “topluluk bandı” bölümü eklendi.
  - **Üst giriş (light → dark)**: Düz çizgi kullanılmadı; `w-full overflow-hidden leading-none rotate-180` içinde `preserveAspectRatio="none"` inline SVG wedge (`fill-current text-brand-green`, `h-12`) ile keskin değil açılı geçiş.
  - **Koyu bölüm gövdesi**: `relative overflow-hidden bg-brand-green px-6 py-16 text-white`. Arka planda nabız gibi nefes alan mercan ışık küreleri (`absolute -top-24 -right-24 h-96 w-96 animate-pulse rounded-full bg-brand-pink/20 blur-3xl` + sol altta `bg-brand-pink/10`).
  - **İçerik (2 kolon, `lg:grid-cols-2`)**:
    - Sol: çift dilli “Featured Campaign / Προτεινόμενη Καμπάνια” rozeti, “Read for Good / Διαβάζω για το Καλό” başlığı, 3 metrik (27 Schools / €7.590 / 500+ Children reached — EL karşılıklarıyla) ve açıklama metni (`text-white/90 leading-relaxed text-sm sm:text-base`).
    - Sağ: “Campaign diary / Ημερολόγιο καμπάνιας” başlığı altında tarihli adımlar (13/12 masal anlatısı, 19/12 kostüm & okuma günü, 21/12 kapanış — EN/EL) ve altında Unsplash görselleriyle 3’lü mini galeri (`rounded-xl border-white/20 overflow-hidden shadow-lg hover:scale-105 transition-transform`, `next/image` fill).
  - **Alt çıkış (dark → light)**: Koyu bandın altında SVG wedge (ters) ile açık zemine (`#FFF2F2`) pürüzsüz bağlanıyor; ardından etkinlik listesi geliyor.
- **Veri/kopya**: Kampanya örnek içeriği ve metrikler önceki referans tasarımdaki “Read for Good” içeriğine örneklendi (27 okul, 7.590€, 500+ çocuk).
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz.
> Not: Kampanya örneği gerçek bir yayın içeriği değilse metin/metrikler kolayca gerçek veriyle değiştirilebilir; galeri görselleri temsilî Unsplash kareleridir.

## [2026-09-07 15:04] — SVG Logo Entegrasyonu (Navbar & Footer)

- **`public/` varlıkları doğrulandı**: `fulllogoela.svg` (tam logo) ve `logoela.svg` (kompakt logo) mevcut; `next/image` ile entegre edildi.
- **`src/components/Navbar.tsx` güncellendi**: `next/image` import edildi. Sol logo linki artık eski dairesel “ela” rozeti + yazı yerine vektör logoları gösteriyor (`<Link href="/">`):
  - Masaüstü (`sm:block`, altında `hidden`): `<Image src="/fulllogoela.svg" ... width={180} height={48} priority className="h-10 w-auto hidden object-contain sm:block" />`.
  - Mobil (`block sm:hidden`): `<Image src="/logoela.svg" ... width={40} height={40} priority className="h-9 w-auto block object-contain sm:hidden" />`.
- **`src/components/Footer.tsx` güncellendi**: `next/image` import edildi. Marka sütununda eski “ela” dairesi + başlık yerine tam logo eklendi (`<Link href="/" className="mb-4 inline-block">`): `<Image src="/fulllogoela.svg" alt="ELA Logo" width={160} height={44} className="h-10 w-auto object-contain brightness-0 invert" />`. Footer koyu yeşil (`bg-brand-green`, #165823) zeminde olduğundan logonun net görünmesi için `brightness-0 invert` filtreleri uygulandı; açık zeminli kullanımda bu filtreler kaldırılıp doğrudan gösterilebilir. Misyon metni logonun altında korundu.
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz.
> Not: `brightness-0 invert`, koyu arka planda logoyu tek renk (beyaz siluet) yapar; renkli logoyu olduğu gibi göstermek isterseniz filtreyi kaldırıp yeterli kontrast için uygun bir açık zemin/container kullanılabilir.

## [2026-09-07 14:44] — Announcements: Kart Grid → Yatay Editöryel Liste

- **`src/app/announcements/page.tsx` güncellendi**: Kutucuklu kart grid yapısı (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, çerçeveli kartlar) tamamen kaldırıldı; modern, ferah, yatay çizgili bir editöryel liste (horizontal editorial feed) ile değiştirildi. Filtreleme, veri ve çift dil korundu.
  - **Liste konteyneri**: `max-w-5xl mx-auto px-6 mt-10 divide-y divide-slate-200/80`.
  - **Her satır**: `group flex flex-col md:flex-row md:items-center justify-between py-6 px-4 hover:bg-white/80 rounded-2xl transition-all duration-200 cursor-pointer` (tam satır `<a>`).
    - **Sol (md:w-1/4)**: Tarih `text-sm font-semibold text-slate-500 group-hover:text-brand-green`; altında tek biçim açık pembe kategori hapı `bg-brand-pink-light/50 text-brand-green text-xs font-bold px-2.5 py-0.5 rounded-full` (official/event/article renkli farklılığı kaldırıldı).
    - **Orta (md:w-2/3)**: Başlık `text-lg sm:text-xl font-bold text-slate-900 group-hover:text-brand-pink transition-colors leading-snug`; özet `text-slate-600 text-sm mt-1 line-clamp-1 sm:line-clamp-2`; varsa yazar dipnotu `By/Aπό ...` (`text-xs text-slate-400 mt-1`).
    - **Sağ (md:w-auto flex justify-end)**: Yuvarlak ok butonu `h-10 w-10 rounded-full border border-slate-200 text-slate-400 group-hover:border-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-all` içinde arrow SVG.
  - **Temizlik**: Artık kullanılmayan `CalendarIcon`, `PenIcon`, `CATEGORY_BADGE` (kategori renk haritası) ve ilgili kart markup’ı silindi (bir ara oluşan duplike fonksiyon tanımı da giderildi).
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz.

## [2026-09-07 14:42] — Çift Dilli (EN/EL) Filtrelenebilir “Announcements & News” Sayfası

- **`src/app/announcements/page.tsx` oluşturuldu (yeni)**: Tüm duyuruların tek merkezde kart tabanlı ve kategori filtreli sunulduğu duyuru merkezi. `"use client"`, `<Navbar />`, `useLanguage()`; sade Tailwind + inline SVG, harici paket yok.
  - **State & filtre**: `selectedCategory` state’i (varsayılan `"all"`). Kategori tipleri `official | event | article`; `POSTS` dizisinde her öğe `id, date, category, author?, title{en,el}, excerpt{en,el}`.
  - **Veri (gerçek içeriklerle)**: 6 öğe — (1) Official: Annual General Assembly çağrısı; (2) Event: TED-Ed DARE 2024 programı; (3) Article: “Can AI Replace Teachers?” (Kostas Panagiotopoulos); (4) Article: “Bite-sized Learning” (Panagiotopoulos); (5) Article: “Critical Friends in Teaching” (Patritsia Andrioti); (6) Official: Board of Directors duyurusu. Hepsi EN+EL.
  - **Hero**: `max-w-6xl mx-auto pt-32 pb-8 px-6 text-center`; başlık “Announcements & Insights / Ανακοινώσεις & Άρθρα” (`text-4xl font-extrabold text-brand-green`) + alt metin.
  - **Filtre butonları (Tabs)**: “All/Όλα”, “Official Notices/Επίσημα”, “Articles & Thoughts/Άρθρα”, “Events/Εκδηλώσεις”. Aktif: `bg-brand-pink text-white font-bold shadow-sm`; inaktif: `bg-white text-slate-700 border-slate-200 hover:bg-slate-50`.
  - **Kart grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8`; kart `bg-white border-brand-pink-light hover:border-brand-pink rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300`. Kategori rozetleri renkli pastel (official yeşil / event pembe / article açık pembe), sağda takvim SVG’li tarih; başlık `text-lg font-bold line-clamp-2 my-3 group-hover:text-brand-green`; özet `text-sm line-clamp-3`; altta yazar (`By/Aπό` + kalem SVG) ya da “Official Notice/Επίσημη Ανακοίνωση” etiketi + “Read more” ok butonu. Boş kategori için uyarı satırı.
- **`src/components/Navbar.tsx` güncellendi**: Menüdeki “Announcements” ve “Ανακοινώσεις” linki `/announcements` rotasına bağlandı. Böylece Navbar’daki tüm ana linkler gerçek rotalara yöneliyor.
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz.

## [2026-09-07 14:38] — Global Footer Bileşeni & Temiz Privacy Policy Sayfası

- **`src/components/Footer.tsx` oluşturuldu (yeni)**: Kurumsal, çift dilli (`useLanguage()`) footer. Zemin koyu doğa yeşili `bg-brand-green text-white`.
  - 3 sütun: (1) dairesel “ela” logosu + “Educational Leadership Association” + tek cümlelik ilham misyonu; (2) Hızlı linkler — `/who-we-are`, `/information`, `/events`, `/erasmus` (`next/link`, `text-white/80 hover:text-brand-pink transition-colors`); (3) iletişim `mailto:press@ela.edu.gr` + Facebook/Instagram için sade inline SVG ikonlar (yuvarlak `bg-white/10 hover:bg-brand-pink` butonlar).
  - Alt çizgi: `border-t border-white/10 pt-6 mt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60`; solda “Copyright © 2026 Educational Leadership Association…” sağda `Privacy Policy / Πολιτική Απορρήτου` linki (`/privacy-policy`, `hover:text-white`).
- **`src/app/layout.tsx` güncellendi**: `<Footer />` `<LanguageProvider>` içine (children sonrasına) eklendi → tüm alt sayfalarda otomatik görünür, dil bağlamını paylaşır.
- **Per-page footer’lar kaldırıldı**: `src/app/page.tsx`, `information/page.tsx`, `events/page.tsx`, `erasmus/page.tsx` içindeki eski satır içi `<footer>` blokları ve ilgili `footer` sözlük alanları silindi (duplikeyi önlemek için). `who-we-are` zaten footer içermiyordu.
- **`src/app/privacy-policy/page.tsx` oluşturuldu (yeni)**: Sade, ferah, okunabilir hukuki metin şablonu; WordPress /wp kalıntılarından arınmış. `"use client"`, `<Navbar />`, çift dilli `useLanguage()` + EN/EL `DICT`.
  - Düzen: `max-w-4xl mx-auto pt-32 pb-20 px-6`; başlık `text-3xl font-extrabold text-brand-green` (EN “Privacy Policy” / EL “Πολιτική Απορρήτου”); rozet `Last updated: 2026 / Τελευταία ενημέρωση: 2026` (`bg-slate-100 rounded-full w-fit`); kısa giriş.
  - Bölümler (EN/EL): Data We Collect, Media & Cookies, Embedded Content, Your Data Rights, Data Security (+ Contact). Bölüm başlıkları `text-xl font-bold text-slate-900 mt-8 mb-3 border-b border-slate-100 pb-2`; paragraflar `text-slate-600 leading-relaxed text-sm sm:text-base`; iletişim satırı `mailto:press@ela.edu.gr` (pembe underline link).
- **Doğrulama**: `npx eslint` (Footer, layout, privacy-policy ve 4 düzenlenen sayfa) sıfır hata/sıfır uyarı; editör tanılamaları temiz.

## [2026-09-07 14:32] — Çift Dilli (EN/EL) Modern “Erasmus+” Vitrini

- **`src/app/erasmus/page.tsx` oluşturuldu (yeni)**: Sıkıcı metin yığını yerine resmi AB proje künyesi (case study), Avrupa ortaklık çağrısı ve net metriklerle profesyonel bir vitrin. `"use client"`, `<Navbar />`, `useLanguage()` + EN/EL `DICT`. Sade Tailwind + inline SVG; harici UI paketi yok.
  - **Hero & ortaklık alanı**: `max-w-6xl mx-auto pt-32 pb-12 px-6`; sol tarafta güçlü tipografi (rozet + `font-black` başlık + açıklama), sağ tarafta 2 interaktif soru kartı (`bg-white p-6 rounded-2xl border-brand-pink-light shadow-sm hover:border-brand-pink transition-all`).
  - **İçerik (çift dil)**: EN ve EL badge/hero/ortaklık soruları (2 callout), proje bölümü başlığı, proje 1 künyesi (başlık, proje kodu `2022-1-EL01-KA122-ADU-000071519`, aksiyon türü KA122-ADU, açıklama) ve CTA metinleri tam verildi.
  - **Featured project card**: `bg-white rounded-3xl p-8 md:p-12 border-2 border-brand-pink-light shadow-sm relative overflow-hidden` + üstte 3 renkli gradient şerit. Başta `EuBadge` (mavi `#003399` + altın yıldız SVG `Erasmus+`) ve sağda `font-mono` proje kodu etiketi (`bg-slate-100 ... rounded-lg`); başlık, yeşil aksiyon rozeti, ferah özet.
  - **Impact Highlights (3’lü)**: `grid md:grid-cols-3`; her kartta inline SVG ikon (el sıkışma/okul, küre, kıvılcım) ve EN/EL metinler (`250+ Educators Trained`, `Mobility & Upskilling`, `Sustainable Curriculum` / EL karşılıkları) — `ImpactIcon` bileşeniyle index’e göre seçim.
  - **Partner CTA**: `bg-linear-to-r from-white to-brand-bg border-brand-pink-light p-8 rounded-3xl text-center` geniş davet paneli (hands-in SVG ikonu) + mercan hap buton `bg-brand-pink ... hover:scale-105` (“Contact European Desk” / “Επικοινωνία”).
- **`src/components/Navbar.tsx` güncellendi**: Menüdeki “Erasmus+” linki `/erasmus` rotasına bağlandı (en/el). Böylece Navbar’da yalnızca “Announcements”/“Ανακοινώσεις” `#` placeholder kaldı.
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz.

## [2026-09-07 14:27] — Çift Dilli (EN/EL) Zig-Zag “Events” Sayfası

- **`next.config.ts` güncellendi**: `next/image` ile uzak Unsplash görselleri için `images.remotePatterns` (hostname: `images.unsplash.com`) eklendi.
- **`src/app/events/page.tsx` oluşturuldu (yeni)**: Fotoğraf/metinlerin her kartta çapraz yer değiştirdiği alternatif (zig-zag) düzenli, çift dilli Events sayfası. `"use client"`, `<Navbar />`, `useLanguage()`; sade Tailwind + inline SVG, harici UI paketi yok.
  - **Veri**: `EVENTS` dizisi (görsel + EN/EL içerik).
    - Etkinlik 1: Kategori “TED-Ed Club / Youth Live Event”, başlık “1st TED-ed #WEME”, Mart 2023 / Μάρτιος 2023, Atina Benaki Müzesi; tam EN + EL açıklama ve 7 sponsor (Hellenic American Union, National Geographic Learning, Burlington Books, Macmillan Education, Cambridge University Press, Ancient Greek Sandals, Coca Cola 3E).
    - Etkinlik 2: “Leadership Summit” → “Annual Educational Leadership Forum 2024” / “Ετήσιο Συνέδριο Εκπαιδευτικής Ηγεσίας 2024”, Kasım 2024 / Νοέμβριος 2024, Selanik Concert Hall; çift dilli özet.
  - **Zig-zag düzen**: `index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'`; kart `bg-white rounded-3xl p-8 md:p-12 border-brand-pink-light shadow-sm mb-16 flex flex-col lg:flex-row gap-8 md:gap-12 items-center`.
  - **İçerik**: kategori rozeti `bg-brand-pink-light/60 text-brand-green ... rounded-full w-fit`; başlık `text-3xl sm:text-4xl font-black text-brand-green`; takvim + konum pin inline SVG ikonlarıyla gri `rounded-full` meta rozetler; ferah açıklama; altta “Supported by / Υποστηρικτές” başlığı ve `bg-slate-100` minik sponsor hap etiketleri.
  - **Görsel**: `next/image` ile `aspect-4/3 lg:w-1/2 rounded-2xl overflow-hidden relative shadow-md group`; hover’da `group-hover:scale-105 transition-transform duration-500` zoom. Verilen Unsplash görselleri kullanıldı.
- **`src/components/Navbar.tsx` güncellendi**: Menüdeki “Events” ve “Εκδηλώσεις” linki `#` yerine `/events` rotasına yönlendirildi.
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı (5 dosya); editör tanılamaları temiz.
> Not: Navbar’ın “Announcements” ve “Erasmus+” linkleri hâlâ `#` placeholder.

## [2026-09-07 14:25] — Çift Dilli (EN/EL) “Information & Membership” Sayfası

- **`src/app/information/page.tsx` oluşturuldu (yeni)**: Ham tüzük metinleri blog gibi alt alta değil; interaktif rozetli gereksinim kartları ve profesyonel inline SVG ikonlarla kurgulandı. `"use client"`, `<Navbar />`, `useLanguage()` + EN/EL `DICT`. Sade Tailwind + inline SVG; harici UI paketi eklenmedi.
  - **Hero**: `max-w-5xl mx-auto pt-32 pb-10 px-6 text-center`; küçük hap rozet (EN “Legal Status & Bylaws” / EL “Καταστατικό & Πληροφορίες”), büyük koyu yeşil başlık `font-black text-4xl sm:text-5xl text-brand-green`, açık satır aralıklı özet.
  - **İçerik (çift dil)**: Badge, hero başlık, alt metin, Bölüm 1 (Purpose/Σκοπός), Bölüm 2 (Eligibility/Μέλη), Bölüm 3 (Article 6, 8 maddelik kriterler) ve sayfa sonu CTA tamamen EN/EL çevrilmiş verildi (tüzük/ΕΟΠΠΕΠ/EOPPEP metinleri dahil).
  - **Purpose & Legal kartları**: Yan yana 2 geniş beyaz blok `bg-white p-8 rounded-2xl border border-brand-pink-light shadow-sm`; başlarında inline SVG kalkan (shield) ve belge (document) ikonları (`ShieldIcon`/`DocumentIcon`, açık pembe ikon kutusu).
  - **Üyelik şartları grid**: 8 madde `grid grid-cols-1 md:grid-cols-2 gap-4` içinde interaktif onay kartları. Her kartın solunda yeşil onay SVG’si (`h-5 w-5 text-brand-green bg-brand-green/10 rounded-full p-1`), sağında net madde metni; hover’da `hover:border-brand-pink transition-colors`.
  - **Sayfa sonu CTA**: `Want to join our accredited network?` / `Θέλετε να ενταχθείτε...` başlıklı beyaz başvuru kartı ve mercan hap buton (“Apply for Membership” / “Αίτηση Εγγραφής”).
- **`src/components/Navbar.tsx` güncellendi**: Menüdeki “Information” ve “Πληροφορίες” linki `#` yerine `/information` rotasına yönlendirildi.
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz.
> Not: Navbar’ın “Events”, “Announcements”, “Erasmus+” linkleri hâlâ `#` placeholder (gerçek rota yok). Sayfa sonu “Apply” butonu da `#` placeholder.

## [2026-09-07 14:18] — Ana Sayfa Hero: Profesyonel, Vektörel (SVG) Tipografik Düzen

- **`src/app/page.tsx` güncellendi**: Kinetik “sosis harf/çubuk” denemesi (dikey saplar, halkalar, ilkel div bazlı E-L-A şekilleri) tamamen kaldırıldı. Yerine çocukça/emoji havadan arındırılmış, temiz inline SVG ikonlar + güçlü tipografi + mikro-etkileşimli profesyonel bir hero kuruldu. Çift dilli `useLanguage()` yapısı ve EN/EL `DICT` korundu.
  - **Sayfa zemini**: `#FFF2F2` (brand-bg).
  - **Üst rozet**: İçinde mercan parıltı/yıldız inline SVG ikonu olan kurumsal hap rozet `bg-white border border-brand-pink-light text-brand-green px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm inline-flex items-center gap-2`.
  - **Ana başlık**: `text-4xl sm:text-6xl lg:text-7xl font-black text-brand-green tracking-tight max-w-4xl mx-auto leading-[1.1]`; EN “Empowering **Next-Gen** Educational Leaders” / EL “Ενδυναμώνουμε τους **Ηγέτες** της Νέας Γενιάς” (vurgu `text-brand-pink`).
  - **Açıklama**: `text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto mt-6 font-normal` (gri-antrasit, ferah satır aralıklı).
  - **Vektörel etiket bulutu**: Emoji yerine 16px tek renk inline SVG ikonlar (`TagIcon` bileşeni): Erasmus+ yıldız rozeti, ampul, okul binası, kıvılcım. Etiketler `bg-white border border-brand-pink-light text-slate-800 text-xs sm:text-sm font-semibold rounded-full px-4 py-2 shadow-sm inline-flex items-center gap-2 hover:border-brand-pink hover:scale-105 transition-all duration-200 cursor-default`. Etiketler çift dilli.
  - **CTA’lar**: Birincil `bg-brand-pink hover:bg-[#ff657d] text-white px-8 py-3.5 rounded-full font-bold shadow-sm hover:shadow-md` (“Explore Programs”/“Ανακαλύψτε Προγράμματα”); ikincil beyaz `bg-white hover:bg-slate-50 text-brand-green border border-slate-200 px-8 py-3.5 rounded-full font-bold shadow-sm` + sağa kayan oklu ok SVG (“Meet Our Members”/“Γνωρίστε τα Μέλη μας”, `/who-we-are`).
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz.
> Not: Etiketlerde yıldız/ampul SVG’leri etiketle aynı `currentColor` ile tek renk; dil değişince etiketler ve tüm metinler anında çevriliyor.

## [2026-09-07 14:14] — Ana Sayfa Kinetik “E-L-A” Harf İllüstrasyonu

- **`src/app/globals.css` güncellendi**: Kinetik harfler için `sway` keyframe’i eklendi (0%→0°, 25%→8°, 50%→−6°, 75%→3°, 100%→0°).
- **`src/app/page.tsx` yeniden yazıldı**: Ana sayfa, “E-L-A” kinetik tipografi sahnesine dönüştürüldü; sayfa `"use client"` yapıldı ve çift dilli hale getirildi (`useLanguage()` + EN/EL `DICT`: karşılama, tam ad, alt başlık, CTA, footer). Önceki Türkçe “ela.edu” test içeriği kaldırıldı.
  - **Düzen**: Üstte `<Navbar />`; sayfa zemini `#FFF2F2` (brand-bg); hero alanı `max-w-7xl min-h-screen` içinde tam ortada, büyük ve ferah. Footer ince pembe çizgili beyaz.
  - **Kinetik mekanizma**: Üç harf biriminin her biri `KineticLetter` kapsayıcısında (harf başı + mafsal + sap) `origin-bottom` pivotsuz tek grupta; dönme merkezi en alt nokta.
    - Sap: `h-40 sm:h-56 w-[2px] bg-slate-800`; üstteki mafsal/halka `h-3 w-3 rounded-full border-2 border-slate-900 bg-white`.
    - Hover: `hover:[animation:sway_1.3s_ease-in-out_infinite]` → harf+sapla birlikte rüzgarda salınan başak gibi esniyor; fare çekilince dik konuma dönüyor. Mobilde `scale-75 sm:scale-100` ile taşmadan orantılı küçülüyor.
  - **Harf blokları (geometrik, SVG stroke)**:
    - **E**: yeşil dikey gövde + 3 mercan yatay kollu (yuvarlak uçlu).
    - **L**: doğa yeşili dikey gövde + yumuşak pembe (`#FFDADA`) yatay taban.
    - **A**: mercan iki çapraz bacak (kemer/üçgen) + kontrast `slate-900` çapraz kiriş.
  - **Karşılama & CTA**: Harflerin altında tam ad başlığı (`Educational Leadership Association`) + alt başlık (`Nurturing the Leaders of Tomorrow` / `Διαμορφώνοντας τους Ηγέτες του Αύριο`) ve `Explore Programs` / `Προγράμματα` CTA (`/who-we-are`’ye gider). Rozet üstte.
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz.
> Not: Hover animasyonu çıkınca kısaca dik konuma döner; istenirse kalıcı/çok küçük bir rüzgar sallantısı da eklenebilir.

## [2026-09-07 14:06] — Hero & Manifesto İyileştirme (renk uyumu + doğal animasyonlar)

- **`src/app/globals.css` güncellendi**: Yumuşak, göz yormayan bir `float-soft` keyframe’i ve `.float-slow` sınıfı eklendi (6s ease-in-out, ±9px dikey süzülme).
- **`src/app/who-we-are/page.tsx` hero bölümü sadeleştirildi / orijinal palete dönüldü**: Neo-Pop sarısı (`#FFD166`) ve çiğ 2×2 dönen/zıplayan geometrik mozaik tamamen kaldırıldı.
  - **Konteyner & arka plan**: Ana blok artık temiz `bg-white`, `border border-brand-pink-light rounded-4xl p-8 md:p-14 shadow-sm relative overflow-hidden`; sayfa zemini `#FFF2F2` (brand-bg) korunuyor. Sadece palete uygun silik pembe/yeşil `blur-3xl` renk süzmesi bırakıldı.
  - **Sol taraf**: Başlığın üstüne sade hap rozet `bg-brand-pink-light/60 text-brand-green font-bold text-xs uppercase tracking-wider rounded-full` (metin çift dilli `Welcome to ELA`/`Καλωσορίσατε στην ELA`). Başlık `text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-brand-green`; manifesto paragrafları `text-slate-700 leading-relaxed font-normal text-base md:text-lg`. CTA mercan `bg-brand-pink hover:bg-[#ff637b] text-white font-bold px-7 py-3 rounded-full shadow-sm hover:shadow-md active:scale-95` (eskiden mavi `#5B9DFE` idi).
  - **Sağ taraf — üst üste binen zarif kartlar**: 2×2 mozaik yerine modern SaaS/eğitim görünümü.
    - Ana vitrin kartı: `max-w-md rotate-1 rounded-4xl bg-white border-brand-pink-light shadow-lg hover:rotate-0 hover:shadow-xl transition-transform`; üstte ince pembe gradient şerit; içinde `rounded-2xl bg-brand-bg` özet paneli (`statsKicker` + çift dilli `stats` listesi: `30+ Member schools`, `Inspiring teachers`, `Creative youth`) ve altta yeşil “ELA / Educational Leadership Association” mini şeridi. Yer tutucu emoji yok, içerik metin bazlı.
    - Yüzen mini rozet: sol altta `-rotate-3` üst üste binen, içinde yeşil onay ikonlu `float-slow` ile çok yavaş salınan beyaz hap: `Active Across Greece & Europe` / `Δραστήριοι σε Ελλάδα & Ευρώπη`.
  - **Animasyon disiplini**: Hızlı `animate-spin`/agresif `animate-bounce` kaldırıldı; yalnızca zarif `transition-transform`, hover mikro-etkileşimleri ve `.float-slow` (pürüzsüz, yavaş) kullanıldı.
  - **Çift dil (EN/EL)**: Rozet, başlık, manifesto paragrafları, CTA, stats listesi ve yüzen rozet metinleri `useLanguage()` ile kusursuz geçiş yapıyor.
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; `page.tsx` editör tanılamaları temiz. (`globals.css`’teki `@theme` “unknown at rule” uyarısı Tailwind v4 sözdizimini tanımayan standart CSS linter’ının yanlış pozitifidir; gerçek hata değildir.)

## [2026-09-07 14:03] — Neo-Pop / Bauhaus Geometrik Animasyonlu Hero & Manifesto

- **`src/app/who-we-are/page.tsx` güncellendi**: “Who We Are” üst gövdesi (eski Hero + Manifesto) sıcak renkli devasa asimetrik blok ve sağında hareketli geometrik mozaikli yeni bir Neo-Pop/Bauhaus tasarımıyla değiştirildi. Members grid korundu.
  - **Sözlük yeniden düzenlendi (EN/EL)**: `title`, `paragraphs` (2 akıcı manifesto paragrafı) ve `cta` alanları eklendi; eski/tekrar eden hero-manifesto alanları kaldırıldı. EN başlık “Empowering Young Minds to Shape Tomorrow's World”, EL “Ενδυναμώνουμε τους Νέους να Διαμορφώσουν το Αύριο”; ELA misyon metni 2 paragraf olarak akıcı şekilde verildi.
  - **Konteyner**: Hero bölümü `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12`; kart paneli `rounded-[2.5rem] md:rounded-[3.5rem] bg-[#FFD166]` (sıcak hardal/sarı), `grid lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-sm`; üstüne yumuşak dekoratif daireler.
  - **Sol sütun (lg:col-span-7)**: Başlık `text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]`; manifesto paragrafları `text-slate-800/90 text-base sm:text-lg font-medium leading-relaxed space-y-4`; CTA mavi tam yuvarlak hap `bg-[#5B9DFE] hover:bg-[#4689EB] text-white font-bold px-8 py-4 rounded-full hover:scale-105 active:scale-95 shadow-md` (`Meet our members` / `Γνωρίστε τα μέλη μας`, `#members` çapa linki).
  - **Sağ sütun (lg:col-span-5) — 2×2 mozaik**: `aspect-square max-w-105 mx-auto grid grid-cols-2 grid-rows-2 rounded-3xl overflow-hidden shadow-xl border-4 border-slate-900/10`.
    - Hücre 1 (mavi `#3A57E8`): `animate-[spin_10s_linear_infinite]` dönen pembe halka/donut (`rounded-full border-8 border-brand-pink`) + ortada sarı çekirdek.
    - Hücre 2 (krem `#FFF2F2`): koyu lacivert çatı üçgeni (CSS `border-b-90 border-l-60 border-r-60` üçgen), `animate-pulse`.
    - Hücre 3 (mercan `#FF788D`): iç içe geçmiş konsantrik çeyrek yaylar (`rounded-tr-full` katmanlar), en içteki `animate-pulse`.
    - Hücre 4 (gök mavisi `#9CD4FF`): 4 köşeli beyaz parıldayan yıldız SVG (`animate-bounce`).
  - **Etkileşim/hareket**: Mozaik şekiller statik değil; Tailwind `animate-spin`, `animate-pulse`, `animate-bounce` ve hover (scale/active) efektleriyle sürekli oyuncu hareket veriyor. Dil toggle’ı tıklandığında başlık, paragraflar ve CTA metni `useLanguage()` ile EN/EL arasında güncelleniyor (üstteki “Members” alanı da dile göre çevriliyor).
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz (renk token’ları ve bare border utilities’a çevrilen sınıflar dahil).

## [2026-09-07 13:59] — Manifesto & Misyon Bölümü (Düzeltilmiş çift dilli metinler + modern kart)

- **`src/app/who-we-are/page.tsx` güncellendi**: Yarı Yunanca/İngilizce karışmış ve hatalı manifestonun yerine akıcı, düzeltilmiş çift dilli metinler eklendi ve modern bir manifesto kartı olarak tasarlandı.
  - **Sözlük (EN/EL)**: `Copy` sözlüğüne `quote`, `point1`, `point2`, `paragraph` alanları eklendi; hem İngilizce hem Yunanca akıcı metinler tanımlandı (EL metinler tırnak işaretli guillemet `«...»` dahil).
  - **Konum**: Manifesto kartı Hero bölümünün hemen altına, okullar (Members) grid’inin hemen üstüne yerleştirildi.
  - **Konteyner**: `max-w-5xl mx-auto my-12 p-8 md:p-12 bg-white rounded-3xl border-2 border-brand-pink-light shadow-sm relative overflow-hidden`; sol üstte dekoratif büyük açılış tırnak glyph’i (`text-[9rem] text-brand-pink-light/70`, `pointer-events-none`).
  - **Quote alanı**: `text-2xl md:text-3xl font-extrabold text-brand-green text-center italic` büyük, tırnak işaretli vurucu tipografi (`<blockquote>` içinde).
  - **2 madde**: Yan yana 2 hafif renkli kutucuk `rounded-2xl border border-brand-pink-light/60 bg-brand-bg p-5 text-slate-800 font-medium text-sm md:text-base`; her birinde küçük pembe numara (`01`/`02`) başlığı ve açıklama.
  - **Alt açıklama**: Rahat okunan, ferah satır aralıklı gövde metni `text-slate-600 text-center leading-relaxed mt-8 max-w-3xl mx-auto`.
- **Küçük temizlik**: Members kartındaki açıklama satırında `min-h-[3rem]` → Tailwind önerisiyle `min-h-12` olarak sadeleştirildi (uyarı giderildi).
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz.

## [2026-09-07 13:56] — Members / Okullar Bölümünün Modernize Edilmesi ve Animasyonlandırılması

- **`src/app/globals.css` güncellendi**: Kart girişi için özel `fade-in-up` keyframe’i ve `.reveal-up` yardımcı sınıfı eklendi (`animation-fill-mode: backwards`, kartlar aşağıdan hafifçe yukarı beliriyor).
- **`src/app/who-we-are/page.tsx` güncellendi**: Okul/üye bölümü orijinal 4 sütunlu dizi korunarak modern, dinamik, çocuk/genç odaklı bir hale getirildi.
  - **Grid & düzen**: Okullar bölümü `mx-auto max-w-7xl px-6 py-12` içinde `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6` tam sayfa genişliğinde 4 sütunlu responsive grid. Hero ve değerler bölümü korundu.
  - **Kart tasarımı**: Beyaz zemin `bg-white`, `rounded-2xl`, ince `border border-brand-pink-light/60`, hafif gölge. Logo alanı `h-36 w-full rounded-xl bg-slate-50/50 mb-4` içinde baş harf monogram kutusu (gerçek okul adları + temsili logo/monogram).
  - **Veri**: `SCHOOLS` listesi; gerçek okullar **Koryfi**, **Th. Tsiavou – Rapti**, **Varela**, **Success** (`founding: true`) ve ek olarak Partner School #5–#12 (toplam 12 kart = lg 4 sütunda 3 temiz sıra). Her okul için baş harf, şehir anahtarı ve kategori (`language`/`hub`) tanımlı.
  - **Tipografi & etiketler**: Okul adı `text-xl font-bold text-center text-brand-green`; kategori + şehir soluk gri değil şık `rounded-full bg-brand-pink-light/50 text-brand-green text-xs font-semibold` hap etiketler; FOUNDING MEMBER rozeti mercan `text-brand-pink uppercase tracking-wider`; açıklama `text-slate-600 text-sm text-center line-clamp-2` (2 satır sınırı, hizalama için min-height).
  - **Buton**: `Read more` / `Διαβάστε περισσότερα` (dile göre) mercan `font-bold text-sm flex justify-center gap-1 hover:gap-2`, sağında oku `group-hover:translate-x-1` ile hover’da sağa kayan arrow SVG.
  - **Animasyonlar / mikro etkileşimler**: Kart hover’da `hover:-translate-y-2 hover:shadow-xl hover:border-brand-pink transition-all duration-300`; logo `group-hover:scale-105 transition-transform`; kartlara `style={{ animationDelay }}` ile kademeli `.reveal-up` giriş animasyonu.
  - **Çift dil (EN/EL)**: Buton (`Read more`→`Διαβάστε περισσότερα`), founding rozeti, kategori, şehir (`Athens`→`Αθήνα` vb. `CITY` haritasından) ve açıklama metinleri `useLanguage()` diline göre otomatik değişiyor.
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz.
> Not: Gerçek okullar için temsilî/örnek şehir ve açıklamalar yerleştirildi; kesin kayıt bilgisi varsa `SCHOOLS` listesi ve `DICT.founding` açıklamaları güncellenebilir.

## [2026-09-07 13:50] — “Who We Are” Düzen & Stil Revizyonu (AI klişelerinden arındırma)

- **`src/app/who-we-are/page.tsx` güncellendi**: Tipik yapay zeka şablonu görünümü (aşırı hap/balon köşeler, ortada sıkışmış 3 kart) rafine, modern bir dile çevrildi. Çift dilli (EN/EL) içerik ve düzen korundu.
  - **Düzen & genişlik**: İçerik `max-w-6xl px-6` → tam genişlik `w-full px-6 md:px-12` + okullar bölümü `max-w-7xl` seviyesine taşındı. Hero `max-w-5xl`, okul vitrini `max-w-7xl` — sayfa yatayda nefes alıyor.
  - **Köşe geometrisi**: `rounded-3xl`/`rounded-2xl`/hap `rounded-full` köşeler kaldırıldı. Kart ve paneller `rounded-xl` (üst sınır), küçük logo alanları/rozetler `rounded-lg`/`rounded-md`. Kenarlıklar kalın `border-2` oyuncak yerine ince `border border-slate-200/90` veya `border-brand-pink-light` kullanıldı.
  - **Değerler satırı (mission)**: Döndürülmüş büyük hap balonlar yerine 3 sütunlu, ince çerçeveli `rounded-xl` kutular; ikon `font-bold text-brand-pink` küçük aksan olarak, başlık `font-bold tracking-tight text-brand-green`.
  - **Okul ağı (showcase)**: “School Network” tam genişlikte bir vitrine dönüştü; başlık üstünde küçük pembe `uppercase tracking-[0.2em]` etiket.
    - **Partner highlights (featured)**: İlk 3 gerçek okul (Papakommenou/Papademetriou/Chranioti) `lg:grid-cols-3` üzerinde geniş `p-8` öne çıkan kartlar; üstte pembe `border-t-4 border-t-brand-pink` aksan, `rounded-lg` logo alanı, okul adı, EN/EL 1 satır açıklama ve rol/şehir `rounded-md` etiketleri.
    - **Full directory**: Kalan 21 partner okul `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` düzenli envanter/dizin grid’i; kompakt `p-5` kartlar (logo kutusu + ad + rol + yeşil şehir etiketi). Hover’da `-translate-y-1` + ince pembe kenar.
  - **Tipografi**: Balon `font-extrabold tracking-wide` yerine cesur ama oturaklı `font-sans font-bold tracking-tight text-brand-green` kullanıldı; pink `#FF788D` yalnızca küçük aksanlarda (üst etiket, ikonlar, heading üst çizgisi, hover kenarlığı) tutuldu; zemin `#FFF2F2` yumuşaklığı korundu.
  - **Arka plan**: Zıplayan dairesel baloncuklar yerine çok silik `blur-3xl` renk süzmesi (ambient wash) bırakıldı — daha rafine, az gürültülü.
- **Veri**: `SCHOOLS` tek dizisi, mantıksal olarak `FEATURED` (3 gerçek okul) + `DIRECTORY` (Partner #4–#24, 21 okul) olarak bölündü; okullara çift dilli rol alanı (`Language Center` / `Κέντρο Γλωσσών`, `Educational Hub` / `Εκπαιδευτικός Κόμβος`) eklendi.
- **Doğrulama**: `npx eslint` ile sıfır hata/sıfır uyarı; editör tanılamaları temiz.

## [2026-09-07 13:46] — Rota Düzeltmesi & Link Standardizasyonu

- **`src/components/Navbar.tsx` linkleri temizlendi**: Menü linklerindeki hash içeren `#who-we-are`, `#information`, `#events` vb. hedefler kaldırıldı; URL karmaşası (örn. `/who-we-are#who-we-are`) giderildi.
  - **Logo**: `next/link` ile `href="/"` — doğrudan ana sayfaya gidiyor (eski `href="#"` kaldırıldı).
  - **“Who We Are” / “Ποιοι Είμαστε”**: Sözlükte ilk menü öğesi olarak `href="/who-we-are"` verildi; sonuna kesinlikle `#` eklenmedi → temiz rota `/who-we-are`.
  - **Henüz sayfası olmayan öğeler** (Information/Πληροφορίες, Events/Εκδηλώσεις, Announcements/Ανακοινώσεις, Erasmus+): URL’yi bozmaması için düz `href="#"` placeholder’ına çekildi (gerçek rota açıldıkça doldurulabilir).
  - **Next.js `Link` bileşeni**: Masaüstü menü, mobil panel ve CTA’daki normal `<a>` etiketleri `import Link from "next/link"` ile `<Link href="...">` bileşenine çevrildi; böylece sayfa geçişleri SPA hızında, tarayıcıyı yenilemeden akıyor. Mobil linklerde menüyü kapatan `onClick={() => setOpen(false)}` korundu.
- **`src/app/who-we-are/page.tsx`**: İncelendi; sayfa içinde `id="who-we-are"` veya gereksiz href/hash tanımı yok — URL zaten temiz `http://localhost:3000/who-we-are`. Silinecek bir şey olmadığından içerik değişmedi.
- **Doğrulama**: `npx eslint` ile `Navbar.tsx` sıfır hata/sıfır uyarı; editör tanılamaları temiz. Dil geçişi `<LanguageProvider>` (layout düzeyinde) olduğundan, `Link` ile `/who-we-are`’ye giderken seçili dil state’i de korunuyor.

## [2026-09-07 13:38] — Çocuk & Genç Odaklı, Animasyonlu, Çift Dilli “Who We Are” Sayfası

- **`src/components/language-context.tsx` oluşturuldu (yeni)**: `Lang` tipi (`"en" | "el"`), `LanguageProvider` ve `useLanguage` hook’u içeren paylaşımlı bir dil bağlamı. Dil seçiminin Navbar ve sayfa genelinde tek kaynaktan yönetilmesini sağlıyor (varsayılan `"en"`, `toggleLang()`/`setLang()`).
- **`src/app/layout.tsx` güncellendi**: Tüm uygulama `<LanguageProvider>` ile sarıldı; böylece `Navbar`’daki EN/EL düğmesi tüm sayfalarda ortak çalışıyor.
- **`src/components/Navbar.tsx` refactor edildi**: Bileşen içindeki yerel `currentLang` state’i kaldırılıp paylaşımlı `useLanguage()` bağlamına (`lang` + `toggleLang`) bağlandı; sözlük/CTA mantığı aynı kaldı. Artık dil geçişi sayfayı da senkronize güncelliyor.
- **`src/app/who-we-are/page.tsx` oluşturuldu (yeni)**: “Who We Are / Members” için eski akademik tasarım yerine çocuk & genç odaklı, animasyonlu, çift dilli sayfa.
  - **Sayfa rota**: `/who-we-are` altında `"use client"` bileşen; en üstte `<Navbar />` yer alıyor. Metinler `DICT` nesnesiyle EN/EL’e göre `useLanguage()` dilinden seçiliyor.
  - **EN içerik**: Rozet “🌟 Inspiring the Future”; başlık “Empowering Young Minds & Leaders”; alt metin ve “Our Big Mission”; ağ başlığı “Our Amazing School Network” + “Over 30 inspiring language centers…” alt metni.
  - **EL içerik**: Rozet “🌟 Εμπνέοντας το Μέλλον”; başlık “Ενδυναμώνουμε τους Νέους Ηγέτες”; “Η Μεγάλη μας Αποστολή”; “Το Δίκτυο των Σχολείων μας” + Yunanca alt metin.
  - **Hero**: Rozet `animate-bounce`; devasa yuvarlak başlık `text-5xl sm:text-7xl font-extrabold tracking-tight text-brand-green`, ikinci satır pembe vurgu; arka planda renkli süzülen baloncuklar (`animate-pulse`/`animate-bounce`, `pointer-events-none` dekoratif `aria-hidden`).
  - **Misyon balonları**: `DICT.mission` ile “Creativity/Solidarity/Leadership” (EL: “Δημιουργικότητα/Αλληλεγγύη/Ηγεσία”) hap şeklinde; sırayla `-rotate-2`/`rotate-2`, hover’da `hover:scale-105 hover:rotate-0 transition-transform duration-300`, her birinde emoji ikonu.
  - **Okul ağı (Members grid)**: Başlık pembe vurgulu, `text-brand-green`. 24 örnek okul `SCHOOLS` dizisinden dinamik render (Papakommenou School/Athens, Chranioti Education/Athens, Papademetriou School/Agrinio + Partner School #4–#24 ve çeşitli şehirler). Kart tasarımı: `rounded-3xl border-2 border-brand-pink-light bg-white`, renkli yuvarlak logo placeholder’ı (🏫/🎓, dönüşümlü `RING_COLORS`), yeşil şehir hapı (`bg-brand-green/10 text-brand-green`); hover’da `-translate-y-2 shadow-xl border-brand-pink transition-all duration-300` zıplama efekti.
- **Doğrulama**: `npx eslint` ile `who-we-are/page.tsx`, `language-context.tsx`, `Navbar.tsx`, `layout.tsx` sıfır hata/sıfır uyarı; editör tanılamaları temiz (ilk taramadaki “modül bulunamadı” uyarısı yeni dosyalar için geçici/index gecikmesiydi, yenilemede kayboldu).

## [2026-09-07 13:32] — Renk Paleti & Çocuk Dostu Canlı Tema

- **Renk paleti tanımlandı** (`src/app/globals.css`): Proje Tailwind v4 kullandığından renkler `@theme` blokunda özel token adlarıyla eklendi; böylece `bg-brand-pink`, `text-brand-green` vb. utility sınıfları kullanılabilir oldu. Tanımlanan palet:
  - `brand-pink` = `#FF788D` (Primary / canlı pembe-mercan)
  - `brand-pink-light` = `#FFDADA` (Secondary / açık pembe)
  - `brand-bg` = `#FFF2F2` (Background / yumuşak krem-pembe)
  - `brand-green` = `#165823` (Accent / koyu doğa yeşili)
- **`src/components/Navbar.tsx` güncellendi**: Child-friendly, canlı temaya uyarlandı (çift dilli mantık korundu).
  - Kapsül kenarlığı `border-slate-200` → `border-brand-pink-light` (pembemsi, yumuşak) yapıldı; beyaz-şeffaf `bg-white/95 backdrop-blur-md` arka plan korundu.
  - Yazılar tombul/yuvarlak hat için `font-bold`/`font-extrabold` + `tracking-wide` seviyesine çekildi.
  - CTA butonu (Join Us / Εγγραφή) canlı mercan `bg-brand-pink text-white` + `shadow-md hover:opacity-90` olarak güncellendi (eski mavi `bg-blue-600 hover:bg-blue-700` kaldırıldı).
  - Dil değiştiricide aktif dil (EN/EL) vurgusu `font-extrabold text-brand-green` (doğa yeşili) yapıldı; ayraç `|` açık pembeye (`text-brand-pink-light`) çevrildi.
  - Logo rozeti `bg-brand-pink`, logo/wordmark metni doğa yeşili (`text-brand-green`) + “Association” satırı pembe; hamburger simgesi `text-brand-green`, hover arka planı açık pembe.
- **`src/app/page.tsx` güncellendi**: Canlı temayla bütünlük sağlandı.
  - Sayfa arka planı `bg-slate-50` → `bg-brand-bg` (#FFF2F2); varsayılan metin rengi doğa yeşili `text-brand-green`.
  - Hero: başlık `font-extrabold text-brand-green`, ikinci kelime vurgusu pembe `text-brand-pink` (eski mavi gradient kaldırıldı); badge açık pembe kenarlıklı/yeşil metin, nokta mercan.
  - Hero CTA butonları: birincisi `rounded-full bg-brand-pink text-white shadow-lg shadow-brand-pink/30 hover:opacity-90`, ikincisi beyaz + açık pembe kenarlıklı yeşil metin (hover’da pembeye döner) — tombul `font-extrabold tracking-wide`.
  - Özellik kartları & footer: kart kenarlıkları/ikon kutuları açık pembe, kart başlıkları yeşil, kart linkleri pembe (hover’da yeşil); footer üst kenarlığı açık pembe, alt linkler hover’da pembe. Eski slate/blue/indigo tonları tema dışında kaldığından palete çevrildi.
- **Doğrulama**: `npx eslint` TypeScript dosyalarında sıfır hata/sıfır uyarı; `globals.css` için yalnızca “yapılandırma yok — dosya yoksayıldı” bilgisi döndü (beklenen). Editör tanılamaları temiz.

## [2026-09-07 13:24] — Çift Dilli (EN / EL) Floating “Pill” Navbar

- **`src/components/Navbar.tsx` güncellendi**: Navbar artık reaktif çift dilli (English/Greek). Sadece Tailwind kullanıldı, harici UI kütüphanesi kurulmadı.
  - **Client bileşen & durum**: Başta zaten var olan `"use client";` korundu. `currentLang` state'i (`"en" | "el"`, varsayılan `"en"`) eklendi; `toggleLang()` ile tıklamada anında tersine çevriliyor. `open` state'i hamburger mobil menü için.
  - **Sözlük**: `DICTIONARY: Record<Lang, Dictionary>` ile iki dil için `links` ve `cta` metinleri tanımlandı. EN: “Who We Are, Information, Events, Announcements, Erasmus+” + CTA “Join Us”. EL: “Ποιοι Είμαστε, Πληροφορίες, Εκδηλώσεις, Ανακοινώσεις, Erasmus+” + CTA “Εγγραφή”. Menü, CTA ve mobil panel metinleri `currentLang`’e göre dinamik geliyor.
  - **Dış kapsül**: `fixed inset-x-0 top-4 z-50 mx-auto w-[94%] max-w-6xl`, `rounded-full`, `bg-white/95 backdrop-blur-md`, `border border-slate-200`, `shadow-md`. İç yapı `h-16 px-6 py-3` dikey ortalı flex.
  - **Logo (sol)**: Dairesel minimalist “ela” rozeti + iki satırlı “Educational Leadership Association” başlığı.
  - **Menü (orta)**: `text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors`, `gap-6`; metinler seçili dile göre değişiyor. Masaüstünde (`lg:flex`) tam açık.
  - **Dil değiştirici (sağ)**: “EN | EL” formatında küçük şık hap buton (`rounded-full border-slate-200 bg-slate-50 px-2.5 py-1`). Aktif dil `font-bold text-blue-600`, inaktif dil `text-slate-400` (hover’da `text-slate-600`); iki parça arasında `|` ayracı.
  - **CTA (sağ)**: `bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-blue-700 transition shadow-sm`; metni dile göre “Join Us” / “Εγγραφή” olarak dinamik.
  - **Mobil menü**: `lg:hidden` hamburger butonu (menü açıkken X ikonuna döner) ve altında açılır mobil panel; panelde dile göre linkler ve CTA yer alıyor. Link rengi `font-medium` + `text-slate-700` olarak güncellendi.
- **`src/app/page.tsx`**: `<Navbar />` bileşenini önceki adımda zaten çağırıyor; bu adımda sayfa içeriğinde değişiklik gerekmedi (doğrulandı).
- **Doğrulama**: `npx eslint` ile `Navbar.tsx` ve `page.tsx` sıfır hata/sıfır uyarı; editör tanılama temiz.

## [2026-09-07 13:20] — Modern Floating “Pill” Navbar Bileşeni

- **`src/components/Navbar.tsx` oluşturuldu** (yeni dizin `src/components/`): Eski/dağınık navbar yapısının yerine modern, referanstaki gibi “yüzen hap” (floating pill) tasarımında yeniden kullanılabilir bir client bileşeni eklendi. Sadece Tailwind sınıfları kullanıldı; harici UI kütüphanesi kurulmadı.
  - **Konum/Kapsül**: `fixed inset-x-0 top-4 mx-auto w-[92%] max-w-6xl z-50` ile üstten/yandan boşluklu floating yerleşim; kapsül `rounded-full`, `bg-white/95 backdrop-blur-md`, `border border-slate-200/80`, `shadow-sm hover:shadow-md transition-shadow`. İç yapı `h-16 px-6 py-3` ile dikeyde tam ortalı flex.
  - **Logo (sol)**: Dairesel mavi “ela” rozeti + iki satırlı “Educational Leadership Association” başlığı (modern sans-serif).
  - **Menü (orta)**: “Who We Are”, “Information”, “Events”, “Announcements”, “Erasmus+” öğeleri; `text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors` ve dengeli `gap-7`.
  - **Aksiyon & dil (sağ)**: Sade “EN” etiketi + mavi, tam yuvarlak `bg-blue-500 ... rounded-full hover:bg-blue-600` CTA butonu (“Apply Now”).
  - **Responsive**: Masaüstünde (`lg:`) tüm menü tam açık; altında (`lg:hidden`) hamburger ikonuna dönüşüp (X ikonu toggle) açılır mobil panel gösteriyor; panelde menü linkleri ve “Apply Now” butonu mevcut. Sayfada tek aktif menü paneli için `useState` kullanıldı.
- **`src/app/page.tsx` güncellendi**: Eski inline `<header>`/sticky navbar bloğu kaldırıldı, bileşen `import Navbar from "@/components/Navbar"` ile çağrılarak sayfa en üstüne `<Navbar />` eklendi. Sabit floating navbar içeriği örtmesin diye Hero bölümünün üst boşluğu `pt-32 sm:pt-36` değerine çıkarıldı.
- **Doğrulama**: `npx eslint` ile `Navbar.tsx` ve `page.tsx` kontrol edildi; sıfır hata/sıfır uyarı. İki dosyada da editör tanılama (diagnostics) temiz.

## [2026-09-07 13:16] — Küçük iyileştirme & doğrulama

- **`src/app/page.tsx`**: Tailwind v4 önerisine uygun olarak `bg-gradient-to-br` ve `bg-gradient-to-r` sınıfları sırasıyla `bg-linear-to-br` ve `bg-linear-to-r` ile değiştirildi (eski sınıflar kullanımdan kaldırılma uyarısı veriyordu). Böylece dosyada hiçbir lint/derleme uyarısı kalmadı.
- **Doğrulama**: `npx eslint` çalıştırıldı; `page.tsx` ve `layout.tsx` için sıfır hata/sıfır uyarı doğrulandı. (`globals.css` için yalnızca "dosya yoksayıldı — yapılandırma eşleşmedi" bilgilendirme uyarısı döndü; bu ESLint'in CSS dosyalarını kapsamamasından kaynaklanan beklenen bir durumdur.)

## [2026-09-07 13:14] — İlk geliştirme: Kurumsal test arayüzü

- **`.rules` dosyası oluşturuldu**: Proje köküne kalıcı çalışma kuralı eklendi. Kural, her işlem sonunda yapılan tüm değişikliklerin CHANGELOG.md dosyasına tarih/saat belirtilerek en üste madde halinde kaydedilmesini zorunlu kılıyor.
- **`CHANGELOG.md` dosyası oluşturuldu**: Bu ilk geliştirmenin teknik detayları madde madde eklendi.
- **`src/app/page.tsx` sıfırdan yeniden yazıldı**: Önceki create-next-app varsayılan içeriği tamamen kaldırılarak kurumsal, modern ve temiz bir test arayüzü oluşturuldu. Sadece saf Tailwind CSS kullanıldı; harici paket eklenmedi.
  - **Sticky Navbar**: `sticky top-0` + `backdrop-blur`, beyaz/yarı saydam arka plan, gradient logo rozeti (`ela.edu`), 3 bağlantı (Özellikler, Nasıl Çalışır, İletişim) ve sağda "Giriş Yap" + "Ücretsiz Başla" butonları.
  - **Hero Bölümü**: Mavi tonlu badge rozeti, gradient vurgulu büyük başlık, açıklama metni ve 2 CTA butonu ("Hemen Deneyin" — mavi dolu, "Özellikleri Keşfedin" — çerçeveli).
  - **3'lü Kart Izgarası**: Responsive grid (`sm:grid-cols-2 lg:grid-cols-3`, üçüncü kart mobil/tablet kolonlarında `col-span` ile dengelendi), hafif gölgeli (`shadow-sm`, hover'da `shadow-lg`) bilgi kartları; her kartta ikon kutusu, başlık, açıklama ve bağlantı yer alıyor.
  - **Footer**: Kurumsal bilgi ve alt bağlantılar (Gizlilik, Şartlar, Destek).
  - Renk paleti yalnızca **slate ve mavi** tonlarından oluşuyor; sayfa `min-h-screen` ile tam ekran destekleniyor.
- **`src/app/layout.tsx` güncellendi**: `metadata` başlığı "Create Next App" yerine "ela.edu — Kurumsal Öğrenme Paneli" ve açıklaması güncellendi.
- **`src/app/globals.css` güncellendi**: `body` yazı tipi Arial yerine `--font-geist-sans` (Geist) değişkenine bağlandı; böylece arayüz yüklenen kurumsal font ile tutarlı görüntüleniyor.

> Not: `date` komutunun güncel saat çıktısını alabilmek için terminal, sistem dışı (unsandboxed) çalıştırma izniyle bir kez kullanıldı.
