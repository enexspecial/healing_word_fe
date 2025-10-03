import { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  icons?: {
    icon?: string
    shortcut?: string
    apple?: string
  }
  openGraph?: {
    title?: string
    description?: string
    url?: string
    siteName?: string
    images?: Array<{
      url: string
      width?: number
      height?: number
      alt?: string
    }>
    locale?: string
    type?: string
  }
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player'
    title?: string
    description?: string
    images?: string[]
    creator?: string
    site?: string
  }
  alternates?: {
    canonical?: string
  }
}

const defaultConfig: Partial<SEOConfig> = {
  openGraph: {
    siteName: 'Healing Word Christian Church',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Healing Word Christian Church Logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@healingwordchurch',
    creator: '@healingwordchurch'
  }
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    openGraph,
    twitter,
    alternates
  } = { ...defaultConfig, ...config }

  const fullTitle = title.includes('Healing Word') ? title : `${title} | Healing Word Christian Church`
  
  return {
    title: fullTitle,
    description,
    keywords: [
      'church',
      'christian church',
      'worship',
      'community',
      'faith',
      'bible study',
      'prayer',
      'healing word',
      'christian community',
      'church near me',
      'online church',
      'live streaming church',
      ...keywords
    ],
    authors: [{ name: 'Healing Word Christian Church' }],
    creator: 'Healing Word Christian Church',
    publisher: 'Healing Word Christian Church',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    alternates: {
      canonical: canonical || alternates?.canonical
    },
    robots: 'index, follow',
    openGraph: {
      ...openGraph,
      title: openGraph?.title || fullTitle,
      description: openGraph?.description || description,
      url: openGraph?.url || canonical
    },
    twitter: {
      ...twitter,
      title: twitter?.title || fullTitle,
      description: twitter?.description || description
    }
  }
}

export function generateStructuredData(type: 'organization' | 'event' | 'localBusiness', data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  switch (type) {
    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'ReligiousOrganization',
        name: 'Healing Word Christian Church',
        alternateName: 'HWCC',
        url: baseUrl,
        logo: `${baseUrl}/images/logo.png`,
        description: 'A place of hope, healing, and community where everyone belongs. Join us as we grow in faith, love, and service to God and our community.',
        foundingDate: '2018',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '6 Bella Crescent Behind Peridot Filling Station After Oba\'s Palace Iyana Ejigbo',
          addressLocality: 'Lagos',
          addressRegion: 'Lagos State',
          postalCode: '100001',
          addressCountry: 'NG'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+2348144093507',
          contactType: 'customer service',
          email: 'info@healing-word-church.org'
        },
        sameAs: [
          'https://www.facebook.com/healingwordchurch',
          'https://www.instagram.com/healingwordchurch',
          'https://www.youtube.com/healingwordchurch'
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Church Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Sunday Worship Service',
                description: 'Main worship service with praise, prayer, and preaching'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Bible Study',
                description: 'Weekly Bible study and spiritual growth sessions'
              }
            }
          ]
        }
      }
    
    case 'event':
      return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: data.title || 'Sunday Service',
        description: data.description || 'Join us for our weekly worship service',
        startDate: data.startDate || new Date().toISOString(),
        endDate: data.endDate || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        location: {
          '@type': 'Place',
          name: 'Healing Word Christian Church',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '6 Bella Crescent Behind Peridot Filling Station After Oba\'s Palace Iyana Ejigbo',
            addressLocality: 'Lagos',
            addressRegion: 'Lagos State',
            postalCode: '100001',
            addressCountry: 'NG'
          }
        },
        organizer: {
          '@type': 'ReligiousOrganization',
          name: 'Healing Word Christian Church',
          url: baseUrl
        },
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode'
      }
    
    case 'localBusiness':
      return {
        '@context': 'https://schema.org',
        '@type': 'ReligiousOrganization',
        name: 'Healing Word Christian Church',
        image: `${baseUrl}/images/logo.png`,
        description: 'A place of hope, healing, and community where everyone belongs.',
        url: baseUrl,
        telephone: '+2348144093507',
        email: 'info@healing-word-church.org',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '6 Bella Crescent Behind Peridot Filling Station After Oba\'s Palace Iyana Ejigbo',
          addressLocality: 'Lagos',
          addressRegion: 'Lagos State',
          postalCode: '100001',
          addressCountry: 'NG'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 6.5244,
          longitude: 3.3792
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Sunday'],
            opens: '09:00',
            closes: '12:00'
          }
        ],
        priceRange: 'Free',
        paymentAccepted: 'Free',
        currenciesAccepted: 'USD'
      }
    
    default:
      return {}
  }
}
