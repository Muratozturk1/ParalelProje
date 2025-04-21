# Paralel Matris Çarpımı Performans Analizi Web Uygulaması

Bu proje, sıralı (sequential) ve paralel matris çarpımı algoritmalarını karşılaştıran bir web uygulamasıdır. Farklı algoritmaların ve thread sayılarının performansını ölçer ve görselleştirir.

## Özellikler

- Farklı matris boyutlarıyla test yapabilme
- Dört farklı matris çarpımı algoritması:
  - Sıralı (Sequential)
  - Temel Paralel (Basic Parallel)
  - İyileştirilmiş Paralel (Collapse direktifli) 
  - Blok Tabanlı Paralel (Cache-friendly)
- İstenilen thread sayısı ile test yapabilme
- Performans metriklerini görsel grafiklerle karşılaştırma:
  - Çalışma süresi
  - Hızlanma (Speedup)
  - Verimlilik (Efficiency)
- Thread sayısına göre performans analizi

## Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn
- GCC derleyicisi 
- OpenMP kütüphanesi

## Kurulum

1. Projeyi klonlayın:
```
git clone https://github.com/kullanici/matrix-multiplication-app.git
cd matrix-multiplication-app
```

2. Backend bağımlılıklarını yükleyin:
```
cd backend
npm install
```

3. Frontend bağımlılıklarını yükleyin:
```
cd ../frontend
npm install
```

## Çalıştırma

### Geliştirme Modunda

1. Backend sunucusunu başlatın:
```
cd backend
npm run dev
```

2. Frontend uygulamasını başlatın:
```
cd frontend
npm start
```

3. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

### Üretim Modunda

1. Frontend kodunu derleyin:
```
cd frontend
npm run build
```

2. Backend sunucusunu başlatın:
```
cd ../backend
npm start
```

3. Tarayıcınızda [http://localhost:5000](http://localhost:5000) adresine gidin.

## Nasıl Kullanılır

1. Web arayüzünden matris boyutunu seçin
2. Çalıştırma modunu seçin (tek algoritma veya karşılaştırma)
3. Thread sayısını ayarlayın
4. "Hesapla ve Karşılaştır" butonuna tıklayın
5. Sonuçları grafik ve tablolarda inceleyin

## Desteklenen Algoritmalar

1. **Sıralı (Sequential)**: Klasik üç for döngüsü ile matris çarpımı
2. **Temel Paralel**: OpenMP ile ana döngünün paralelleştirilmesi
3. **İyileştirilmiş Paralel**: OpenMP collapse direktifi ile iç içe döngülerin paralelleştirilmesi
4. **Blok Tabanlı Paralel**: Önbellek optimizasyonu için matrislerin bloklar halinde işlenmesi

## Proje Yapısı

```
matrix-app/
├── backend/            # Node.js API sunucusu
│   ├── server.js       # Express API
│   └── matrix_multiplication.c  # C matris çarpımı kodu
├── frontend/           # React uygulaması
│   ├── public/         # Statik dosyalar
│   └── src/            # Kaynak kod
│       ├── components/ # React bileşenleri
│       └── App.js      # Ana uygulama bileşeni
└── README.md           # Bu dosya
```

## Lisans

MIT 