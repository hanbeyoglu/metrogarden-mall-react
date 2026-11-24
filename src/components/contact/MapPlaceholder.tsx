import { ExternalLink, Navigation } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const MAPS_URL =
  'https://www.google.com/maps/place/Sur+Yap%C4%B1+Metrogarden+AVM/@41.0155031,29.1761837,807m/data=!3m3!1e3!4b1!5s0x14cacefc32e018cb:0x3e327174acc6fd1e!4m6!3m5!1s0x14cacee228283919:0xe975904936db8bd9!8m2!3d41.0154991!4d29.1787586!16s%2Fg%2F11b66g3sxf!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D'

const DIRECTIONS_URL =
  'https://www.google.com/maps/dir//Sur+Yap%C4%B1+Metrogarden+AVM/@41.0155031,29.1761837,807m/data=!3m3!1e3!4b1!5s0x14cacefc32e018cb:0x3e327174acc6fd1e!4m6!3m5!1s0x14cacee228283919:0xe975904936db8bd9!8m2!3d41.0154991!4d29.1787586!16s%2Fg%2F11b66g3sxf!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D'

const EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.5186591632313!2d29.17618371537248!3d41.01550307929971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cacee228283919%3A0xe975904936db8bd9!2sSur%20Yap%C4%B1%20Metrogarden%20AVM!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str'

interface MapPlaceholderProps {
  embedUrl?: string
  mapUrl?: string
  address?: string
}

export function MapPlaceholder({ embedUrl, mapUrl, address }: MapPlaceholderProps) {
  const { t } = useTranslation()
  const directionsUrl = address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    : DIRECTIONS_URL
  return (
    <div className="overflow-hidden border border-mist">
      {/* Real Map iframe embed */}
      <div className="relative w-full bg-fog" style={{ height: 350 }}>
        <iframe
          title={t('pages.contact.mapTitle')}
          src={embedUrl || EMBED_URL}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full"
        />
      </div>

      {/* Action buttons */}
      <div className="flex divide-x divide-mist border-t border-mist">
        <a
          href={mapUrl || MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-1 items-center justify-center gap-2 py-3.5 font-sans text-[11px] font-medium text-graphite transition-all hover:bg-fog hover:text-carbon"
        >
          <ExternalLink size={13} />
          {t('common.openInMaps')}
        </a>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-1 items-center justify-center gap-2 py-3.5 font-sans text-[11px] font-medium text-graphite transition-all hover:bg-fog hover:text-carbon"
        >
          <Navigation size={13} />
          {t('common.directions')}
        </a>
      </div>
    </div>
  )
}

