import type { Store } from '@/types'

const IMG = (id: string, w = 800, h = 533) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=85`

const GALLERY_IMG = (id: string) => IMG(id, 1200, 800)

/* ── Shared image pools by category ─────────────────────────── */
const FASHION_IMAGES = [
  GALLERY_IMG('1441986300917-64674bd600d8'),
  GALLERY_IMG('1490481651871-ab68de25d43d'),
  GALLERY_IMG('1558618666-fcd25c85cd64'),
  GALLERY_IMG('1489987707025-afc232f7ea0f'),
]

const FASHION_IMAGES_B = [
  GALLERY_IMG('1483985988355-763728e1935b'),
  GALLERY_IMG('1558769132-cb1aea458c5e'),
  GALLERY_IMG('1445205170230-053b83016050'),
  GALLERY_IMG('1469334031218-e382a71b716b'),
]

const BEAUTY_IMAGES = [
  GALLERY_IMG('1522335789203-aabd1fc54bc9'),
  GALLERY_IMG('1570172619644-dfd03ed5d881'),
  GALLERY_IMG('1487412912498-0447578fcca8'),
  GALLERY_IMG('1596462502278-27bfdc403348'),
]

const ELECTRONICS_IMAGES = [
  GALLERY_IMG('1491933382434-500287f9b54b'),
  GALLERY_IMG('1519389950473-47ba0277781c'),
  GALLERY_IMG('1496181133206-80ce9b88a853'),
  GALLERY_IMG('1518770660439-4636190af475'),
]

const FOOD_IMAGES = [
  GALLERY_IMG('1414235077428-338989a2e8c0'),
  GALLERY_IMG('1517248135467-4c7edcad34c4'),
  GALLERY_IMG('1461023058943-07fcbe16d735'),
  GALLERY_IMG('1551218808-94e220e084d2'),
]

const SPORTS_IMAGES = [
  GALLERY_IMG('1542291026-7eec264c27ff'),
  GALLERY_IMG('1571019613454-1cb2f99b2d8b'),
  GALLERY_IMG('1576566588028-4147f3842f27'),
  GALLERY_IMG('1556906781-9a412961a28f'),
]

const KIDS_IMAGES = [
  GALLERY_IMG('1558618047-3c8c76ca7d13'),
  GALLERY_IMG('1516627145497-ae6968895b74'),
  GALLERY_IMG('1611010344444-38f4d28a6c6c'),
  GALLERY_IMG('1558618666-fcd25c85cd64'),
]

const ENTERTAINMENT_IMAGES = [
  GALLERY_IMG('1507842217343-583bb7270b66'),
  GALLERY_IMG('1481627834876-b7833e8f5570'),
  GALLERY_IMG('1524995997946-a1c2e315a42f'),
  GALLERY_IMG('1512820790803-83ca734da794'),
]

/* ── All Stores ─────────────────────────────────────────────── */
export const allStores: Store[] = [
  {
    id: 'store-zara',
    slug: 'zara',
    name: 'Zara',
    cover_image: IMG('1441986300917-64674bd600d8'),
    images: FASHION_IMAGES,
    category: 'fashion',
    floor: '1f',
    description:
      'Zara, Inditex grubunun amiral gemisi markasıdır. Pist trendlerini hızla sokak modası hâline getiren Zara, her sezon yenilikçi koleksiyonları ve uygun fiyatlarıyla milyonların tercihi olmaktadır. Metrogarden\'daki geniş mağazamızda kadın, erkek ve çocuk koleksiyonlarının tamamını bulabilirsiniz.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 01 10',
    website: 'https://www.zara.com/tr',
    social_links: {
      instagram: 'https://instagram.com/zara',
      facebook: 'https://facebook.com/zara',
    },
    is_featured: true,
    is_active: true,
    meta: { title: 'Zara — Metrogarden AVM', description: 'Zara mağazası Metrogarden AVM 1. Katta hizmetinizde.' },
  },
  {
    id: 'store-apple',
    slug: 'apple',
    name: 'Apple',
    cover_image: IMG('1491933382434-500287f9b54b'),
    images: ELECTRONICS_IMAGES,
    category: 'electronics',
    floor: 'ground',
    description:
      'Apple Store, tüm Apple ürünlerini birebir deneyimlemenizi sağlar. iPhone, Mac, iPad, Apple Watch ve AirPods\'u uzman personelimizin rehberliğinde keşfedin. Teknik destek, ürün eğitimleri ve özel workshop etkinlikleri için mağazamızı ziyaret edin.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 01 20',
    website: 'https://www.apple.com/tr',
    social_links: {
      instagram: 'https://instagram.com/apple',
      twitter: 'https://twitter.com/apple',
      youtube: 'https://youtube.com/apple',
    },
    is_featured: true,
    is_active: true,
    meta: { title: 'Apple — Metrogarden AVM', description: 'Apple Store Metrogarden AVM Zemin Katta.' },
  },
  {
    id: 'store-mango',
    slug: 'mango',
    name: 'Mango',
    cover_image: IMG('1490481651871-ab68de25d43d'),
    images: FASHION_IMAGES_B,
    category: 'fashion',
    floor: '1f',
    description:
      'Mango, Barselona kökenli uluslararası moda markasıdır. Zarif ve sofistike koleksiyonları ile çalışan kadınların vazgeçilmezi olan Mango, her sezon güncel trendleri kaliteli kumaşlarla buluşturmaktadır. Ofis şıklığından akşam elegansına kadar eksiksiz bir moda deneyimi sunar.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 01 30',
    website: 'https://www.mango.com/tr',
    social_links: {
      instagram: 'https://instagram.com/mango',
      facebook: 'https://facebook.com/mango',
    },
    is_featured: true,
    is_active: true,
  },
  {
    id: 'store-vakko',
    slug: 'vakko',
    name: 'Vakko',
    cover_image: IMG('1558769132-cb1aea458c5e'),
    images: [
      GALLERY_IMG('1558769132-cb1aea458c5e'),
      GALLERY_IMG('1469334031218-e382a71b716b'),
      GALLERY_IMG('1445205170230-053b83016050'),
      GALLERY_IMG('1483985988355-763728e1935b'),
    ],
    category: 'fashion',
    floor: '2f',
    description:
      'Türkiye\'nin önde gelen lüks moda markası Vakko, 1934\'ten bu yana eşsiz tasarımlar ve kaliteli kumaşlar sunmaktadır. İpek ürünleri, haute couture koleksiyonları ve özel siparişleriyle Vakko, zarafet ve Türk tekstil geleneğini en üst düzeyde temsil etmektedir.',
    working_hours: 'Pazartesi – Cumartesi: 10:00 – 21:30, Pazar: 11:00 – 21:00',
    phone: '+90 216 555 01 40',
    website: 'https://www.vakko.com',
    social_links: {
      instagram: 'https://instagram.com/vakko',
      facebook: 'https://facebook.com/vakko',
    },
    is_featured: true,
    is_active: true,
  },
  {
    id: 'store-sephora',
    slug: 'sephora',
    name: 'Sephora',
    cover_image: IMG('1522335789203-aabd1fc54bc9'),
    images: BEAUTY_IMAGES,
    category: 'beauty',
    floor: '1f',
    description:
      'Sephora, dünyanın en büyük güzellik perakendecilerinden biridir. 300\'den fazla markanın binlerce ürününü tek bir çatı altında sunan Sephora, parfüm, makyaj, cilt bakımı ve saç bakımı kategorilerinde geniş seçenekler sunmaktadır. Uzman güzellik danışmanları kişiselleştirilmiş öneriler için daima yanınızda.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 01 50',
    website: 'https://www.sephora.com.tr',
    social_links: {
      instagram: 'https://instagram.com/sephoratukey',
      facebook: 'https://facebook.com/sephoraturkey',
      youtube: 'https://youtube.com/sephora',
    },
    is_featured: true,
    is_active: true,
  },
  {
    id: 'store-nike',
    slug: 'nike',
    name: 'Nike',
    cover_image: IMG('1542291026-7eec264c27ff'),
    images: SPORTS_IMAGES,
    category: 'sports',
    floor: '2f',
    description:
      'Nike, sporun ruhunu ve sınırları zorlamanın tutkusunu her ürününe yansıtır. Koşu, basketbol, futbol ve yaşam tarzı kategorilerinde en yeni koleksiyonları deneyimleyin. Nike Metrogarden mağazamızda ayakkabı, giyim ve aksesuar ürünlerinin yanı sıra kişiselleştirme hizmetinden de yararlanabilirsiniz.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 01 60',
    website: 'https://www.nike.com/tr',
    social_links: {
      instagram: 'https://instagram.com/nike',
      twitter: 'https://twitter.com/nike',
      youtube: 'https://youtube.com/nike',
    },
    is_featured: true,
    is_active: true,
  },
  {
    id: 'store-lego',
    slug: 'lego',
    name: 'LEGO',
    cover_image: IMG('1558618047-3c8c76ca7d13'),
    images: KIDS_IMAGES,
    category: 'kids',
    floor: '3f',
    description:
      'LEGO Store, hayal gücünün sınırlarını zorlayan yaratıcı oyun deneyimleri sunar. Klasik setlerden tematik koleksiyonlara, LEGO Technic\'ten LEGO Architecture\'a kadar binlerce ürün sizi bekliyor. Mağazamızdaki interaktif oluşturma istasyonlarında çocuklarınızla birlikte yaratıcılığınızı keşfedin.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 01 70',
    website: 'https://www.lego.com/tr-tr',
    social_links: {
      instagram: 'https://instagram.com/lego',
      youtube: 'https://youtube.com/lego',
    },
    is_featured: true,
    is_active: true,
  },
  {
    id: 'store-starbucks',
    slug: 'starbucks',
    name: 'Starbucks',
    cover_image: IMG('1461023058943-07fcbe16d735'),
    images: FOOD_IMAGES,
    category: 'food-and-beverage',
    floor: 'ground',
    description:
      'Starbucks, dünyanın her köşesinde aynı kalite ve lezzeti sunan global kahve markasıdır. Özenle seçilmiş kahve çekirdeklerinden hazırlanan içeceklerimiz, taze fırın ürünlerimiz ve rahat atmosferimizle alışveriş aranızda nefes alın. Mobil uygulamamız ile sipariş vererek sıra beklemeden ürünlerinizi teslim alabilirsiniz.',
    working_hours: 'Pazartesi – Pazar: 09:00 – 22:30',
    phone: '+90 216 555 01 80',
    website: 'https://www.starbucks.com.tr',
    social_links: {
      instagram: 'https://instagram.com/starbucksturkiye',
      facebook: 'https://facebook.com/starbucksturkiye',
    },
    is_featured: false,
    is_active: true,
  },
  {
    id: 'store-mavi',
    slug: 'mavi',
    name: 'Mavi',
    cover_image: IMG('1558618666-fcd25c85cd64'),
    images: [
      GALLERY_IMG('1558618666-fcd25c85cd64'),
      GALLERY_IMG('1441986300917-64674bd600d8'),
      GALLERY_IMG('1489987707025-afc232f7ea0f'),
      GALLERY_IMG('1490481651871-ab68de25d43d'),
    ],
    category: 'fashion',
    floor: '2f',
    description:
      'Mavi, 1991\'de İstanbul\'da kurulan Türkiye\'nin global denim markasıdır. Premium denim kalitesi ve Akdeniz esintili tasarımıyla dünyada 35 ülkede faaliyet gösteren Mavi, genç ve dinamik bir yaşam tarzını yansıtmaktadır. Mağazamızda kadın, erkek ve çocuk koleksiyonlarını bulabilirsiniz.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 01 90',
    website: 'https://www.mavi.com',
    social_links: {
      instagram: 'https://instagram.com/mavi',
      facebook: 'https://facebook.com/mavi',
    },
    is_featured: false,
    is_active: true,
  },
  {
    id: 'store-lc-waikiki',
    slug: 'lc-waikiki',
    name: 'LC Waikiki',
    cover_image: IMG('1489987707025-afc232f7ea0f'),
    images: [
      GALLERY_IMG('1489987707025-afc232f7ea0f'),
      GALLERY_IMG('1483985988355-763728e1935b'),
      GALLERY_IMG('1558618666-fcd25c85cd64'),
      GALLERY_IMG('1441986300917-64674bd600d8'),
    ],
    category: 'fashion',
    floor: '3f',
    description:
      'LC Waikiki, Türkiye\'nin en büyük hazır giyim perakende zinciridir. Uygun fiyatlı, kaliteli ve moda koleksiyonları ile tüm aile bireylerinin ihtiyacına cevap verir. Bebek, çocuk, genç ve yetişkin kategorilerinde geniş ürün yelpazesiyle hizmet veren mağazamız, ailenizin her ferdini düşünüyor.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 02 00',
    website: 'https://www.lcw.com',
    social_links: {
      instagram: 'https://instagram.com/lcwaikiki',
      facebook: 'https://facebook.com/lcwaikiki',
      youtube: 'https://youtube.com/lcwaikiki',
    },
    is_featured: false,
    is_active: true,
  },
  {
    id: 'store-koton',
    slug: 'koton',
    name: 'Koton',
    cover_image: IMG('1445205170230-053b83016050'),
    images: [
      GALLERY_IMG('1445205170230-053b83016050'),
      GALLERY_IMG('1441986300917-64674bd600d8'),
      GALLERY_IMG('1558618666-fcd25c85cd64'),
      GALLERY_IMG('1490481651871-ab68de25d43d'),
    ],
    category: 'fashion',
    floor: '3f',
    description:
      'Koton, 1988\'de İstanbul\'da kurulan Türk moda markasıdır. Trendy tasarımları, uygun fiyatları ve geniş koleksiyonlarıyla her mevsime uygun giyim seçenekleri sunan Koton, günlük yaşamdan özel günlere kadar tüm ihtiyaçları karşılar. Kadın, erkek ve çocuk bölümleriyle tam anlamıyla bir aile mağazasıdır.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 02 10',
    website: 'https://www.koton.com',
    social_links: {
      instagram: 'https://instagram.com/koton',
      facebook: 'https://facebook.com/koton',
    },
    is_featured: false,
    is_active: true,
  },
  {
    id: 'store-network',
    slug: 'network',
    name: 'Network',
    cover_image: IMG('1469334031218-e382a71b716b'),
    images: [
      GALLERY_IMG('1469334031218-e382a71b716b'),
      GALLERY_IMG('1558769132-cb1aea458c5e'),
      GALLERY_IMG('1490481651871-ab68de25d43d'),
      GALLERY_IMG('1483985988355-763728e1935b'),
    ],
    category: 'fashion',
    floor: '2f',
    description:
      'Network, uluslararası kalite standartlarında Türk tasarımı giyim ürünleri sunan köklü bir moda markasıdır. Özellikle iş yaşamı ve özel davet koleksiyonlarıyla öne çıkan Network, zarafet ve kaliteyi bir araya getirerek profesyonel imajı güçlendirir. Hem klasik hem de modern çizgilerde zengin seçenekler sunar.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 02 20',
    website: 'https://www.network.com.tr',
    social_links: {
      instagram: 'https://instagram.com/networkturkiye',
      facebook: 'https://facebook.com/networkturkiye',
    },
    is_featured: false,
    is_active: true,
  },
  {
    id: 'store-boyner',
    slug: 'boyner',
    name: 'Boyner',
    cover_image: IMG('1483985988355-763728e1935b'),
    images: FASHION_IMAGES_B,
    category: 'fashion',
    floor: 'ground',
    description:
      'Boyner, Türkiye\'nin en köklü mağazacılık gruplarından biri olup giyimden aksesuvara, kozmetikten ev ürünlerine kadar geniş bir yelpazede hizmet sunar. Çatısı altında barındırdığı ulusal ve uluslararası markalarla tek adımda alışverişin ayrıcalığını yaşatır. Metrogarden şubemiz, şehrin en büyük Boyner mağazalarından biridir.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 02 30',
    website: 'https://www.boyner.com.tr',
    social_links: {
      instagram: 'https://instagram.com/boyner',
      facebook: 'https://facebook.com/boyner',
    },
    is_featured: false,
    is_active: true,
  },
  {
    id: 'store-watsons',
    slug: 'watsons',
    name: 'Watsons',
    cover_image: IMG('1570172619644-dfd03ed5d881'),
    images: [
      GALLERY_IMG('1570172619644-dfd03ed5d881'),
      GALLERY_IMG('1522335789203-aabd1fc54bc9'),
      GALLERY_IMG('1487412912498-0447578fcca8'),
      GALLERY_IMG('1596462502278-27bfdc403348'),
    ],
    category: 'beauty',
    floor: 'ground',
    description:
      'Watsons, Asya\'nın önde gelen sağlık ve güzellik perakendecisidir. Kişisel bakım, sağlık, makyaj ve güzellik ürünlerinde binlerce seçenek sunan Watsons, kendi markası ürünleri ve dünyaca ünlü markaları bir arada bulundurur. Eczacı danışmanlığı ve ücretsiz güzellik testleri mağazamızda sizi bekliyor.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 02 40',
    website: 'https://www.watsons.com.tr',
    social_links: {
      instagram: 'https://instagram.com/watsonsturkiye',
      facebook: 'https://facebook.com/watsonsturkiye',
    },
    is_featured: false,
    is_active: true,
  },
  {
    id: 'store-mediamarkt',
    slug: 'mediamarkt',
    name: 'MediaMarkt',
    cover_image: IMG('1519389950473-47ba0277781c'),
    images: [
      GALLERY_IMG('1519389950473-47ba0277781c'),
      GALLERY_IMG('1491933382434-500287f9b54b'),
      GALLERY_IMG('1496181133206-80ce9b88a853'),
      GALLERY_IMG('1518770660439-4636190af475'),
    ],
    category: 'electronics',
    floor: 'b1',
    description:
      'MediaMarkt, Avrupa\'nın en büyük tüketici elektroniği perakendecisidir. Televizyon, beyaz eşya, bilgisayar, cep telefonu ve aksesuarlar dahil binlerce ürünü rekabetçi fiyatlarla sunar. Uzman satış danışmanları, teknik servis ve kurulum hizmetleri ile alışverişinizi kolaylaştıran MediaMarkt\'ta en yeni teknoloji sizi bekliyor.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 02 50',
    website: 'https://www.mediamarkt.com.tr',
    social_links: {
      instagram: 'https://instagram.com/mediamarktturkiye',
      youtube: 'https://youtube.com/mediamarkt',
    },
    is_featured: false,
    is_active: true,
  },
  {
    id: 'store-teknosa',
    slug: 'teknosa',
    name: 'Teknosa',
    cover_image: IMG('1496181133206-80ce9b88a853'),
    images: [
      GALLERY_IMG('1496181133206-80ce9b88a853'),
      GALLERY_IMG('1519389950473-47ba0277781c'),
      GALLERY_IMG('1518770660439-4636190af475'),
      GALLERY_IMG('1491933382434-500287f9b54b'),
    ],
    category: 'electronics',
    floor: 'b1',
    description:
      'Teknosa, Türkiye\'nin köklü tüketici elektroniği zinciridir. Sabancı Grubu\'na bağlı olan Teknosa, cep telefonundan dizüstü bilgisayara, televizyondan küçük ev aletlerine kadar geniş bir ürün yelpazesi sunar. Uygun taksit seçenekleri, garantili ürünler ve teknik destek hizmetleriyle alışverişlerinizde güvende kalın.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 02 60',
    website: 'https://www.teknosa.com',
    social_links: {
      instagram: 'https://instagram.com/teknosa',
      facebook: 'https://facebook.com/teknosa',
    },
    is_featured: false,
    is_active: true,
  },
  {
    id: 'store-hd-iskender',
    slug: 'hd-iskender',
    name: 'HD İskender',
    cover_image: IMG('1517248135467-4c7edcad34c4'),
    images: [
      GALLERY_IMG('1517248135467-4c7edcad34c4'),
      GALLERY_IMG('1414235077428-338989a2e8c0'),
      GALLERY_IMG('1551218808-94e220e084d2'),
      GALLERY_IMG('1461023058943-07fcbe16d735'),
    ],
    category: 'food-and-beverage',
    floor: '3f',
    description:
      'HD İskender, Bursa\'nın efsanevi İskender kebabını modern bir sunum anlayışıyla buluşturuyor. 1867\'den bu yana süregelen geleneksel tarifleri ve el yapımı lahmacun hamurunu kullanan HD İskender, Türk mutfağının en sevilen lezzetlerini gurme bir deneyime dönüştürüyor. Yemek katımızdaki en popüler mekanlardan biri.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 02 70',
    website: 'https://www.hdiskender.com.tr',
    social_links: {
      instagram: 'https://instagram.com/hdiskender',
    },
    is_featured: false,
    is_active: true,
  },
  {
    id: 'store-cookshop',
    slug: 'cookshop',
    name: 'Cookshop',
    cover_image: IMG('1414235077428-338989a2e8c0'),
    images: FOOD_IMAGES,
    category: 'food-and-beverage',
    floor: '3f',
    description:
      'Cookshop, taze ve sağlıklı malzemelerle hazırlanan uluslararası mutfak lezzetlerini sevenlerle buluşturuyor. Kahvaltıdan akşam yemeğine kadar sürekli değişen menüsü ve şef spesiyalleriyle Cookshop, her ziyarette yeni bir lezzet keşfi sunuyor. Geniş açık büfesi ve bireysel porsiyonlarıyla her damak tadına uygun seçenekler mevcut.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 02 80',
    website: 'https://www.cookshop.com.tr',
    social_links: {
      instagram: 'https://instagram.com/cookshoprestaurant',
    },
    is_featured: false,
    is_active: true,
  },
  {
    id: 'store-skechers',
    slug: 'skechers',
    name: 'Skechers',
    cover_image: IMG('1576566588028-4147f3842f27'),
    images: [
      GALLERY_IMG('1576566588028-4147f3842f27'),
      GALLERY_IMG('1556906781-9a412961a28f'),
      GALLERY_IMG('1542291026-7eec264c27ff'),
      GALLERY_IMG('1571019613454-1cb2f99b2d8b'),
    ],
    category: 'sports',
    floor: '2f',
    description:
      'Skechers, konfor ve stilin mükemmel dengesini sunan küresel ayakkabı markasıdır. Spor, günlük kullanım ve çocuk kategorilerinde binlerce model barındıran Skechers, özellikle Memory Foam teknolojisiyle donatılmış modelleriyle uzun yürüyüşlerde dahi konfor sağlar. Erkek, kadın ve çocuk bölümlerimizde ilgilendiğiniz modeli deneyimleyebilirsiniz.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 02 90',
    website: 'https://www.skechers.com.tr',
    social_links: {
      instagram: 'https://instagram.com/skechersturkiye',
      facebook: 'https://facebook.com/skechers',
    },
    is_featured: false,
    is_active: true,
  },
  {
    id: 'store-dr',
    slug: 'd-r',
    name: 'D&R',
    cover_image: IMG('1507842217343-583bb7270b66'),
    images: ENTERTAINMENT_IMAGES,
    category: 'entertainment',
    floor: '1f',
    description:
      'D&R, Türkiye\'nin en köklü kültür ve eğlence perakende zinciridir. Kitap, müzik, film, oyun ve teknoloji aksesuar kategorilerinde on binlerce ürünü bünyesinde barındıran D&R, kültür tutkunlarının buluşma noktasıdır. Düzenli imza günleri, kitap kulübü etkinlikleri ve müzik dinletileriyle yaşayan bir kültür mekanına dönüşmüştür.',
    working_hours: 'Pazartesi – Pazar: 10:00 – 22:00',
    phone: '+90 216 555 03 00',
    website: 'https://www.dr.com.tr',
    social_links: {
      instagram: 'https://instagram.com/drcom',
      facebook: 'https://facebook.com/drcom',
    },
    is_featured: false,
    is_active: true,
  },
]

export const featuredStores = allStores.filter((s) => s.is_featured)
