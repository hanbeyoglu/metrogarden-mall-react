import type { Mall } from '@/types'

export const mall: Mall = {
  id: 'metrogarden-avm',
  name: 'Metrogarden AVM',
  tagline: 'İstanbul\'un kalbinde premium alışveriş deneyimi.',
  description:
    'Metrogarden AVM, İstanbul\'un en seçkin alışveriş merkezlerinden biri olarak 180\'den fazla dünya markası, geniş yeme-içme seçenekleri ve eğlence alternatifleriyle ziyaretçilerini ağırlıyor.',
  address: 'Necip Fazıl Mah. Alemdağ Cad. No: 940 Ümraniye / İstanbul',
  phone: '+90 216 510 06 40',
  email: 'info@suryapimetrogardenavm.com.tr',
  website: 'https://metrogarden.com.tr',
  google_maps_url:
    'https://www.google.com/maps/place/Sur+Yap%C4%B1+Metrogarden+AVM/@41.0155031,29.1761837,807m/data=!3m3!1e3!4b1!5s0x14cacefc32e018cb:0x3e327174acc6fd1e!4m6!3m5!1s0x14cacee228283919:0xe975904936db8bd9!8m2!3d41.0154991!4d29.1787586!16s%2Fg%2F11b66g3sxf!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D',
  google_maps_embed_url:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.5186591632313!2d29.17618371537248!3d41.01550307929971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cacee228283919%3A0xe975904936db8bd9!2sSur%20Yap%C4%B1%20Metrogarden%20AVM!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str',
  working_hours: {
    schedule: 'Her gün 10:00 – 22:00',
    exceptions: 'Dini bayramlar ve özel günlerde farklı saatler uygulanabilir.',
  },
  social_links: {
    instagram: 'https://instagram.com/metrogardenavm',
    facebook: 'https://facebook.com/metrogardenavm',
    twitter: 'https://twitter.com/metrogardenavm',
    youtube: 'https://youtube.com/@metrogardenavm',
  },
  stats: {
    store_count: 180,
    floor_count: 4,
    parking_capacity: 2500,
    operating_days: 365,
  },
}
