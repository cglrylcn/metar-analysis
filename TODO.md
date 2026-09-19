# 📋 METAR Rüzgar Tahmin Sistemi — Geliştirme Yol Haritası (Roadmap)

Bu dosya, sistemin rüzgar tahmin doğruluğunu ve meteorolojik güvenilirliğini artırmak için belirlenen bilimsel ve teknik iyileştirme adımlarını içerir.

---

## 🚀 Durum Özeti

| No | Geliştirme Maddesi | Durum | Öncelik |
|---|---|---|---|
| 1 | Sayısal Hava Tahmin Modelleri (NWP: GFS / ECMWF) Hibrit Entegrasyonu | ⏳ Planlanan | Yüksek |
| 2 | TAF (Terminal Sahası Tahmini) Matematiksel Harmanlama (Ensemble Blend) | ✅ Tamamlandı | Çok Yüksek |
| 3 | Barometrik Basınç Eğilimi (QNH $dP/dt$) Dinamik Katsayısı | ✅ Tamamlandı | Yüksek |
| 4 | Sıcaklık & Çiy Noktası ($T - T_d$) Termal Karışım / Momentum Transferi | ✅ Tamamlandı | Yüksek |
| 5 | Meydan Topoğrafyası ve Vadi Kanalize Olma (Channelling Effect) Kısıtı | ⏳ Planlanan | Orta |
| 6 | Makine Öğrenimi ile MOS (Model Output Statistics) Düzeltmesi | ⏳ Planlanan | Uzun Vadeli |

---

## 🛠️ Detaylı Açıklamalar

### [x] Madde 2: TAF (Terminal Sahası Tahmini) Matematiksel Harmanlama (Ensemble Blend)
- **Açıklama:** TAF raporları havalimanı meteoroloji ofisi tarafından radar, uydu ve sayısal modellerle hazırlanır. Sistem, hedef saat için geçerli olan TAF rüzgarını (`Ana Tahmin`, `FM`, `BECMG` veya `TEMPO` bloklarından) matematiksel olarak ayrıştırır.
- **Uygulanan Yöntem:** 72 saatlik istatistiksel METAR regresyonu (%45) ile TAF öngörüsü (%55) dairesel ağırlıklı ortalama (circular mean) formülüyle birleştirilerek hibrit bir tahmin üretilir.

### [x] Madde 3: Barometrik Basınç Eğilimi (QNH $dP/dt$)
- **Açıklama:** METAR bültenlerindeki `Qxxxx` (hPa) ve `Axxxx` (inHg) basınç verileri son 3-6 saat boyunca taranarak barometrik basınç değişim hızı ($dP/dt$) hesaplanır.
- **Uygulanan Yöntem:** Basınçta hızlı bir düşüş ($<-1.5\text{ hPa} / 3\text{s}$) tespit edilirse, yaklaşan alçak basınç/cephesel gradyan nedeniyle rüzgar hızı çarpanı $+%5-15$ artırılır ve hamle (gust) olasılığı uyarısı verilir.

### [x] Madde 4: Sıcaklık & Çiy Noktası ($T - T_d$) Termal Karışım
- **Açıklama:** METAR'daki sıcaklık ve çiy noktası yayılımı (spread: $T - T_d$) atmosferin sınır tabakasındaki dikey kararlılığı gösterir.
- **Uygulanan Yöntem:** Gündüz konvektif saatlerinde büyük sıcaklık-çiy noktası farkı ($>10^\circ\text{C}$), üst seviye rüzgarlarının yere inmesini (momentum transferi) tetiklediğinden rüzgar hızında ve hamlesinde artış faktörü modele dinamik olarak eklenir.

---

### [ ] Madde 1: Sayısal Hava Tahmin Modelleri (NWP: GFS / ECMWF) Hibrit Entegrasyonu
- **Hedef:** NOAA GFS veya ECMWF açık veri modellerinden (örn. Open-Meteo API aracılığıyla ücretsiz olarak) koordinat bazlı 850 hPa ve 10m rüzgar vektörlerini çekip 3'lü ensemble (METAR + TAF + NWP) modeli kurmak.

### [ ] Madde 5: Meydan Topoğrafyası ve Vadi Kanalize Olma (Channelling Effect) Kısıtı
- **Hedef:** Özellikle dağlık veya vadi meydanlarında (örn: Şırnak LTCP, Erzincan LTCD) rüzgarın sadece vadi ekseninde akabilmesi kısıtını sayısal olarak modele tanımlamak.

### [ ] Madde 6: Makine Öğrenimi ile MOS (Model Output Statistics) Düzeltmesi
- **Hedef:** XGBoost / Random Forest tabanlı hafif bir regresyon modeliyle o meydana özel geçmiş tahmin hatalarını öğrenip sistematik sapmaları (bias) otomatik düzeltmek.
