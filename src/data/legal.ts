export interface LegalSection {
  id: string
  title: string
  content: string[]
}

export interface LegalDocument {
  slug: string
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
}

/* ─────────────────────────────────────────────────────────── */

export const LEGAL_DOCUMENTS: Record<string, LegalDocument> = {

  kvkk: {
    slug: 'kvkk',
    title: 'KVKK Aydınlatma Metni',
    lastUpdated: '1 Ocak 2026',
    intro:
      'Metrogarden Alışveriş Merkezi Yönetimi olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında kişisel verilerinizin işlenmesine ilişkin sizi aydınlatmak amacıyla bu metni hazırladık.',

    sections: [
      {
        id: 'veri-sorumlusu',
        title: '1. Veri Sorumlusu',
        content: [
          'Veri sorumlusu sıfatıyla Metrogarden AVM İşletme A.Ş. (bundan sonra "Metrogarden" veya "Şirket" olarak anılacaktır) faaliyet göstermektedir.',
          'Şirket merkezi: Orhantepe Mahallesi, Manolya Caddesi No:1, 34865 Kartal/İstanbul adresinde kayıtlıdır.',
          'İlgili kişi başvuru ve taleplerine ilişkin iletişim kanalı: kvkk@metrogarden.com.tr',
        ],
      },
      {
        id: 'isleme-amaclari',
        title: '2. Kişisel Verilerin İşlenme Amaçları',
        content: [
          'Toplanan kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:',
          '• Alışveriş merkezi içi güvenlik, kamera kayıt sistemleri ve ziyaretçi takibi kapsamında fiziksel güvenliğin sağlanması,',
          '• İletişim formları aracılığıyla iletilen talep, şikayet ve önerilerin değerlendirilmesi ve yanıtlanması,',
          '• Yasal yükümlülüklerimizin yerine getirilmesi ve resmi makamlarla bilgi paylaşımı,',
          '• Kampanya, etkinlik ve avantajlı tekliflere ilişkin pazarlama iletişiminin gerçekleştirilmesi (onay verilmesi halinde),',
          '• Müşteri memnuniyeti araştırmaları ve anketlerinin yürütülmesi,',
          '• Web sitesi kullanıcı deneyiminin geliştirilmesi ve teknik altyapı yönetimi.',
        ],
      },
      {
        id: 'islenen-veriler',
        title: '3. İşlenen Kişisel Veriler',
        content: [
          'Hizmetlerimizi kullanmanıza bağlı olarak aşağıdaki kişisel veriler işlenebilir:',
          '• Kimlik bilgileri: Ad, soyad,',
          '• İletişim bilgileri: E-posta adresi, telefon numarası,',
          '• Görsel veriler: AVM giriş ve ortak alanlarda yer alan kapalı devre kamera sistemleri tarafından kaydedilen görüntüler,',
          '• Dijital iz verileri: IP adresi, çerezler, tarayıcı türü, ziyaret edilen sayfalar ve site kullanım süreleri.',
        ],
      },
      {
        id: 'aktarim',
        title: '4. Kişisel Verilerin Aktarılması',
        content: [
          'Kişisel verileriniz, KVKK\'nın 8. ve 9. maddeleri çerçevesinde aşağıdaki taraflarla paylaşılabilir:',
          '• Yasal yükümlülükler kapsamında yetkili kamu kurum ve kuruluşları,',
          '• Teknik altyapı, yazılım geliştirme ve veri depolama hizmetleri sunan iş ortakları,',
          '• Hukuki süreçlerin yürütülmesi için avukatlık büroları.',
          'Verileriniz yurt dışına aktarılmamaktadır. Aktarım gerekeceği hallerde açık rızanız alınacaktır.',
        ],
      },
      {
        id: 'toplama-yontemi',
        title: '5. Veri Toplamanın Yöntemi ve Hukuki Sebebi',
        content: [
          'Kişisel verileriniz; web sitemiz üzerindeki iletişim formları, sosyal medya kanalları, kamera sistemleri ve genel kablosuz ağ kullanımı yoluyla otomatik ve otomatik olmayan yollarla elde edilmektedir.',
          'İşlemenin hukuki dayanakları KVKK Madde 5 kapsamında şöyle sıralanabilir:',
          '• Kanuni yükümlülüğün yerine getirilmesi (Madde 5/2-ç),',
          '• Meşru menfaat kapsamında veri işleme (Madde 5/2-f),',
          '• Açık rıza (Madde 5/1) — pazarlama amaçlı iletişimler için.',
        ],
      },
      {
        id: 'ilgili-kisi-haklari',
        title: '6. İlgili Kişinin Hakları',
        content: [
          'KVKK\'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:',
          '• Kişisel verilerinizin işlenip işlenmediğini öğrenme,',
          '• İşlenmişse buna ilişkin bilgi talep etme,',
          '• İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,',
          '• Yurt içinde ve yurt dışında aktarıldığı üçüncü kişileri öğrenme,',
          '• Eksik veya yanlış işlenmiş verilerinizin düzeltilmesini isteme,',
          '• Yasal koşulların yerine gelmesi halinde silinmesini veya yok edilmesini talep etme,',
          '• Otomatik sistemler aracılığıyla aleyhine sonuç doğuran kararların itiraz hakkı.',
          'Haklarınızı kullanmak için kvkk@metrogarden.com.tr adresine veya Şirket merkezine yazılı başvuruda bulunabilirsiniz. Başvurularınız 30 gün içinde yanıtlanacaktır.',
        ],
      },
    ],
  },

  privacy: {
    slug: 'privacy',
    title: 'Gizlilik Politikası',
    lastUpdated: '1 Ocak 2026',
    intro:
      'Metrogarden AVM olarak ziyaretçilerimizin gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası, web sitemizi ve hizmetlerimizi kullanırken toplanan bilgilerin nasıl işlendiğini açıklamaktadır.',

    sections: [
      {
        id: 'genel-bilgi',
        title: '1. Genel Bilgi',
        content: [
          'Bu politika metrogarden.com.tr alan adı ve bağlı alt alanlar üzerinden sunulan tüm hizmetleri kapsamaktadır.',
          'Sitemizi kullanarak bu politikada belirtilen uygulamaları kabul etmiş sayılırsınız. Politikayı kabul etmiyorsanız lütfen sitemizi kullanmayınız.',
          'Bu politika zaman zaman güncellenebilir. Önemli değişiklikler öncesinde sizi bilgilendirmek için makul çabayı göstereceğiz.',
        ],
      },
      {
        id: 'toplanan-bilgiler',
        title: '2. Toplanan Bilgiler',
        content: [
          'Sitemizde gezinirken ve hizmetlerimizden yararlanırken belirli bilgiler otomatik olarak toplanmaktadır:',
          '• Günlük verileri: IP adresi, tarayıcı türü, işletim sistemi, referans URL, ziyaret edilen sayfalar ve zaman damgaları.',
          '• Çerez verileri: Oturum yönetimi, tercih hatırlama ve analitik amaçlı çerezler (detaylar için Çerez Politikamıza bakınız).',
          'İletişim formları veya etkinlik kayıt formları aracılığıyla gönüllü olarak paylaştığınız bilgiler de tarafımıza iletilir.',
        ],
      },
      {
        id: 'bilgi-kullanimi',
        title: '3. Bilgilerin Kullanımı',
        content: [
          'Toplanan bilgiler yalnızca belirtilen amaçlar doğrultusunda kullanılmakta olup üçüncü taraflarla ticarî amaçlarla paylaşılmamaktadır.',
          '• Site güvenliğinin ve teknik altyapının korunması,',
          '• Kullanıcı deneyiminin iyileştirilmesi için analitik çalışmalar,',
          '• Etkinlik, kampanya ve duyurulara ilişkin iletişim (talep eden kullanıcılar için),',
          '• Yasal yükümlülüklerin yerine getirilmesi.',
        ],
      },
      {
        id: 'cerezler',
        title: '4. Çerezler',
        content: [
          'Sitemiz çeşitli çerezler kullanmaktadır. Bu çerezler; oturum çerezleri (oturum kapatıldığında silinir) ve kalıcı çerezler (belirli bir süre boyunca cihazınızda saklanır) olarak ikiye ayrılır.',
          'Çerezleri tarayıcı ayarlarınızdan yönetebilir veya tamamen devre dışı bırakabilirsiniz. Ancak bu durumda bazı site işlevleri düzgün çalışmayabilir.',
          'Çerezler hakkında daha fazla bilgi için Çerez Politikamızı incelemenizi öneririz.',
        ],
      },
      {
        id: 'ucuncu-taraf',
        title: '5. Üçüncü Taraf Hizmetler',
        content: [
          'Sitemiz aşağıdaki üçüncü taraf hizmetleri kullanmaktadır:',
          '• Google Analytics: Ziyaretçi davranışını ölçmek için anonimleştirilmiş veri toplayan analitik hizmeti. Google\'ın gizlilik politikası için policies.google.com/privacy adresini ziyaret edebilirsiniz.',
          '• Google Maps: İletişim sayfasındaki harita gösterimi için. Google\'ın hizmet koşulları geçerlidir.',
          'Bu hizmet sağlayıcıların kendi gizlilik politikaları mevcuttur; ilgili şirketlerin politikalarını incelemenizi öneririz.',
        ],
      },
      {
        id: 'veri-guvenligi',
        title: '6. Veri Güvenliği',
        content: [
          'Kişisel verilerinizin güvenliğini sağlamak amacıyla endüstri standardı güvenlik önlemleri uygulanmaktadır:',
          '• SSL/TLS şifrelemesi ile veri iletimi güvence altına alınmaktadır,',
          '• Sunucu erişimleri sıkı yetkilendirme politikalarına tabidir,',
          '• Veriler düzenli yedekleme ve şifreleme uygulamalarıyla korunmaktadır.',
          'Hiçbir elektronik iletim veya depolama yöntemi %100 güvenli değildir. Güvenliğinizi en üst düzeyde tutmak için çalışmakla birlikte mutlak güvenliği garanti etmek mümkün değildir.',
        ],
      },
      {
        id: 'iletisim-privacy',
        title: '7. İletişim',
        content: [
          'Bu politika veya kişisel verilerinizin işlenmesi hakkında sorularınız için aşağıdaki kanallardan bize ulaşabilirsiniz:',
          'E-posta: gizlilik@metrogarden.com.tr',
          'Adres: Orhantepe Mahallesi, Manolya Caddesi No:1, 34865 Kartal/İstanbul',
          'Telefon: +90 216 555 00 00',
        ],
      },
    ],
  },

  'cookie-policy': {
    slug: 'cookie-policy',
    title: 'Çerez Politikası',
    lastUpdated: '1 Ocak 2026',
    intro:
      'Bu Çerez Politikası, metrogarden.com.tr web sitesinin çerezleri nasıl kullandığını açıklamaktadır. Siteyi ziyaret ettiğinizde, cihazınıza çerez olarak bilinen küçük metin dosyaları yerleştirilebilir.',

    sections: [
      {
        id: 'cerez-nedir',
        title: '1. Çerez Nedir?',
        content: [
          'Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız tarafından bilgisayarınıza veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır. Bu dosyalar, web sitesinin sizi tanımasına, tercihlerinizi hatırlamasına ve genel kullanıcı deneyimini iyileştirmesine yardımcı olur.',
          'Çerezler tek başına sizi kişisel olarak tanımlamaz; bunun yerine cihazınızı ve tarayıcınızı tanır.',
        ],
      },
      {
        id: 'cerez-turleri',
        title: '2. Kullandığımız Çerez Türleri',
        content: [
          'Sitemizde dört temel çerez kategorisi kullanılmaktadır:',
          '• Zorunlu Çerezler: Sitenin temel işlevleri için gereklidir. Oturum yönetimi, güvenlik doğrulaması ve sayfa navigasyonu bu kapsamdadır. Bu çerezler devre dışı bırakılamaz.',
          '• Tercih Çerezleri: Dil tercihi, tema seçimi gibi kullanıcı tercihlerini hatırlar. Sayfalar arasında geçişlerde ayarlarınızın korunmasını sağlar.',
          '• Analitik Çerezler: Ziyaretçilerin sitemizi nasıl kullandığını anlamak amacıyla Google Analytics tarafından kullanılır. Tüm veriler anonimleştirilmiş biçimde toplanır.',
          '• Pazarlama Çerezleri: Kampanya ve etkinlik reklamlarının ilgi alanlarınıza uygun olarak gösterilmesi için kullanılır. Bu çerezleri kabul etmemeniz halinde reklamlar görünmaya devam eder ancak kişiselleştirilmiş olmaz.',
        ],
      },
      {
        id: 'cerez-yonetimi',
        title: '3. Çerez Yönetimi',
        content: [
          'Çerezleri nasıl yönetebileceğinizi aşağıda bulabilirsiniz:',
          '• Tarayıcı Ayarları: Çoğu tarayıcı, çerezleri engellemenize veya silmenize olanak tanıyan ayarlara sahiptir. Chrome, Firefox, Safari ve Edge tarayıcılarının çerez ayarları için ilgili yardım sayfalarını inceleyebilirsiniz.',
          '• Çerez Tercih Merkezi: Sitemize ilk girişinizde görüntülenen çerez onay paneli aracılığıyla kategorilere göre çerezleri etkinleştirebilir veya devre dışı bırakabilirsiniz.',
          'Zorunlu çerezler dışındaki tüm çerez kategorileri için tercihlerinizi istediğiniz zaman değiştirme hakkına sahipsiniz.',
        ],
      },
      {
        id: 'ucuncu-taraf-cerezler',
        title: '4. Üçüncü Taraf Çerezleri',
        content: [
          'Sitemizdeki bazı içerikler veya uygulamalar üçüncü taraflar tarafından sunulmakta olup bu taraflar da kendi çerezlerini yerleştirebilir:',
          '• Google Analytics (analytics.google.com): Ziyaretçi istatistikleri için,',
          '• Google Maps: İletişim sayfasındaki harita gömüsü için,',
          '• YouTube: Gömülü videolar için (site içinde video içeriği varsa).',
          'Bu üçüncü tarafların çerez politikaları kendi web siteleri üzerinden erişilebilir durumdadır. Söz konusu çerezlerin kullanımını kontrol etmemiz mümkün değildir.',
        ],
      },
      {
        id: 'degisiklikler',
        title: '5. Politika Değişiklikleri',
        content: [
          'Çerez Politikamız zaman zaman güncellenebilir. Değişiklikler bu sayfa üzerinde yayımlandığında yürürlüğe girer.',
          'Önemli değişiklikler için sizi web sitesinde belirgin bir bildirimle bilgilendirmeye çalışacağız.',
          '"Son Güncelleme" tarihine dikkat ederek politikamızda yapılan değişikliklerden haberdar olabilirsiniz.',
        ],
      },
      {
        id: 'iletisim-cerez',
        title: '6. İletişim',
        content: [
          'Çerez uygulamalarımız hakkında sorularınız için:',
          'E-posta: cerez@metrogarden.com.tr',
          'Adres: Orhantepe Mahallesi, Manolya Caddesi No:1, 34865 Kartal/İstanbul',
        ],
      },
    ],
  },
}
