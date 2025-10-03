import { generateMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import LiveClient from './LiveClient'

export const metadata: Metadata = generateMetadata({
  title: 'Live Church Services - Watch Online Worship & Bible Study',
  description: 'Join us for live church services, worship, and Bible study online. Watch our Sunday services, prayer meetings, and special events live from Healing Word Christian Church.',
  keywords: [
    'live church service',
    'online worship',
    'live streaming church',
    'sunday service online',
    'bible study live',
    'prayer meeting live',
    'church live stream',
    'online church service',
    'virtual worship',
    'live christian service',
    'church streaming',
    'online bible study'
  ],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/live`,
  openGraph: {
    title: 'Live Church Services - Watch Online Worship & Bible Study',
    description: 'Join us for live church services, worship, and Bible study online. Watch our Sunday services, prayer meetings, and special events live.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/live`
  }
})

export default function LivePage() {
  return <LiveClient />
}