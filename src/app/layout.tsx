import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import ReduxProvider from '@/components/providers/ReduxProvider'
import { generateMetadata, generateStructuredData } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = generateMetadata({
  title: 'Healing Word Christian Church - A Place of Hope, Healing & Community',
  description: 'Welcome to Healing Word Christian Church - A place of hope, healing, and community where everyone belongs. Join us for worship, Bible study, and fellowship.',
  keywords: [
    'christian church',
    'church near me',
    'worship service',
    'bible study',
    'prayer meeting',
    'christian community',
    'online church',
    'live streaming church',
    'healing word church',
    'faith community',
    'spiritual growth',
    'church services',
    'sunday service',
    'christian fellowship'
  ],
  canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'Healing Word Christian Church - A Place of Hope, Healing & Community',
    description: 'Welcome to Healing Word Christian Church - A place of hope, healing, and community where everyone belongs. Join us for worship, Bible study, and fellowship.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Healing Word Christian Church - A Place of Hope, Healing & Community'
      }
    ]
  },
  twitter: {
    title: 'Healing Word Christian Church - A Place of Hope, Healing & Community',
    description: 'Welcome to Healing Word Christian Church - A place of hope, healing, and community where everyone belongs.',
    images: ['/images/logo.png']
  }
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = generateStructuredData('organization', {})
  
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </head>
      <body className={inter.className}>
        <ReduxProvider>
          <div className="min-h-screen bg-white">
            <Navigation />
            {children}
          </div>
        </ReduxProvider>
      </body>
    </html>
  )
}
