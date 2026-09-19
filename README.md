# ✈️ METAR Rüzgar Tahmin ve Pist Analiz Sistemi

72 saatlik METAR verilerine dayalı istatistiksel rüzgar analizi, diurnal cycle tahmini ve dinamik pist/crosswind görselleştirme web uygulaması.

---

## 🌟 Temel Özellikler

- **📡 NOAA / FAA Resmi Veri Entegrasyonu:** Dünya genelindeki tüm ICAO meydanları için son 72 saatlik ham METAR ve aktif TAF raporlarını çeker.
- **🎯 Saate Dayalı Rüzgar Tahmini:** Hedeflenen UTC saatindeki gündüz/gece termal döngüsünü (diurnal cycle) modelleyerek ağırlıklı dairesel ortalama (circular mean) ile yön ve hız tahmin eder.
- **🛬 40.000+ Havalimanı Pist Veritabanı:** Meydanın tüm pistlerini, coğrafi doğrultularını, uzunluk/genişlik ve yüzey kaplamalarını otomatik tanır.
- **🧭 Havacılık Pusula Gülü (Canvas):** Pistleri gerçek açılarıyla, eşik çizgileriyle ve uçağın iniş yönünden yaklaşacağı eşik numaralarıyla çizer.
- **💨 Pist Rüzgar Bileşenleri (Crosswind & Headwind):** Her pist başı için Karşı Rüzgar (HW), Arka Rüzgar (TW) ve Yan Rüzgar (XW) değerlerini hesaplar; en uygun iniş pistini (**⭐ EN UYGUN PİST**) belirler.
- **📊 İnteraktif 72 Saatlik Trend Grafiği:** Saatlik hız ve yön oklarını çizer; fareyle bir noktanın üzerine gelindiğinde anlık büyütme ve detaylı hız/yön kartı sunar.

---

## 🚀 Hızlı Başlangıç (Lokal Çalıştırma)

Uygulama harici hiçbir `npm` kütüphanesine ihtiyaç duymaz. Yalnızca Node.js kurulu olması yeterlidir:

```bash
# Repoyu klonlayın veya indirin
git clone https://github.com/kullaniciadi/metar-wind-forecast.git
cd metar-wind-forecast

# Sunucuyu başlatın
node server.js
```

Tarayıcınızda açın:
👉 **`http://localhost:8787`**

---

## ☁️ Ücretsiz Canlı Yayına Alma (Vercel / Render / Railway)

Uygulamayı herkesin girebileceği bir web sitesi olarak paylaşmak için en pratik yöntemler:

### Seçenek 1: Render.com (Önerilen - Ücretsiz)
1. [Render.com](https://render.com) adresine ücretsiz kaydolun.
2. **New +** -> **Web Service** seçin.
3. GitHub reponuzu bağlayın.
4. Ayarlar:
   - **Build Command:** *(boş bırakın)*
   - **Start Command:** `node server.js`
5. **Create Web Service** butonuna basın. Birkaç saniye içinde size `https://metar-wind.onrender.com` gibi canlı bir link verir.

### Seçenek 2: Vercel / Railway
- GitHub reponuzu bağlayıp tek tıkla canlıya alabilirsiniz.

---

## 📁 Proje Yapısı

```
├── index.html       # Tek sayfa modern arayüz (CSS, Canvas, İstemci Mantığı)
├── server.js        # Saf Node.js HTTP sunucusu ve METAR/Pist API proxy'si
├── runways.csv      # Dünya genelinde 40.923 havalimanının pist veritabanı
├── package.json     # Proje meta bilgisi ve start scripti
└── README.md        # Dokümantasyon
```

---

## ⚠️ Yasal Uyarı
Bu uygulama istatistiksel ve eğitim amaçlı bir modelleme aracıdır. Resmi uçuş planlamaları ve operasyonel kararlar için resmi TAF/METAR, ATIS ve NOTAM bültenlerini kullanınız.
