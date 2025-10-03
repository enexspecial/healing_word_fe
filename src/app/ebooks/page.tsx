import { generateMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import EbooksClient from './EbooksClient'

export const metadata: Metadata = generateMetadata({
  title: 'Christian Resources & Ebooks - Bible Studies, Devotionals & More',
  description: 'Browse our collection of Christian resources including Bible studies, devotionals, sermon transcripts, and spiritual growth materials. Free downloads available.',
  keywords: [
    'christian resources',
    'bible study materials',
    'devotionals',
    'sermon transcripts',
    'christian ebooks',
    'spiritual growth',
    'bible study guides',
    'prayer resources',
    'christian books',
    'faith resources',
    'church resources',
    'free christian materials'
  ],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/ebooks`,
  openGraph: {
    title: 'Christian Resources & Ebooks - Bible Studies, Devotionals & More',
    description: 'Browse our collection of Christian resources including Bible studies, devotionals, sermon transcripts, and spiritual growth materials.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/ebooks`
  }
})

export default function EbooksPage() {
  return <EbooksClient />
}