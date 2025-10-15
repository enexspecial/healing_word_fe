import { Clock, Mail, Phone, MapPin, MessageCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { generateMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { generateBreadcrumbStructuredData } from '@/lib/breadcrumb-utils'
import ContactForm from './ContactForm'
import { publicApiService } from '@/lib/services/publicApiService'

export const metadata: Metadata = generateMetadata({
  title: 'Contact Healing Word Christian Church - Get in Touch Today',
  description: 'Contact Healing Word Christian Church - Get in touch with us for prayer requests, general inquiries, and ministry questions. Visit us this Sunday or reach out directly.',
  keywords: [
    'contact healing word church',
    'church contact information',
    'prayer requests',
    'church phone number',
    'church email',
    'church address',
    'visit church',
    'church office hours',
    'pastor contact',
    'church inquiry'
  ],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/contact`,
  openGraph: {
    title: 'Contact Healing Word Christian Church - Get in Touch Today',
    description: 'Contact Healing Word Christian Church - Get in touch with us for prayer requests, general inquiries, and ministry questions.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/contact`
  }
})

export default async function ContactPage() {
  const breadcrumbItems = [{ label: 'Contact Us' }]
  const breadcrumbStructuredData = generateBreadcrumbStructuredData(breadcrumbItems)

  // Fetch contact info from backend (with fallback to hardcoded values)
  let contactInfo = {
    phone: '+2348144093507',
    email: 'info@healing-word-church.org',
    address: '6 Bella Crescent Behind Peridot Filling Station After Oba\'s Palace Iyana Ejigbo Lagos, Nigeria',
  }

  try {
    const result = await publicApiService.getContactInfo()
    if (result.success && result.data) {
      contactInfo = {
        phone: result.data.phone || contactInfo.phone,
        email: result.data.email || contactInfo.email,
        address: result.data.address || contactInfo.address,
      }
    }
  } catch (error) {
    // Use fallback values if API call fails
    console.error('Failed to fetch contact info:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Get in touch with us. We'd love to hear from you and help you get connected with our church family.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We'd love to hear from you! Send us a message and we'll respond as soon as possible.
              </p>
            </div>


            {/* Contact Form */}
            <ContactForm />

            {/* Contact Information */}
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Other Ways to Reach Us
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                  <p className="text-gray-600">{contactInfo.phone}</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600">{contactInfo.email}</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                  <p className="text-gray-600">{contactInfo.address}</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-xl text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Visit Us This Sunday
              </h3>
              <p className="text-gray-600 mb-6">
                The best way to get to know us is to join us for worship. We'd love to meet you in person!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/live" className="btn-primary flex items-center justify-center gap-2">
                  Watch Live Services
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/" className="btn-outline flex items-center justify-center gap-2">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Service Times
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Sunday Services</h4>
                <p className="text-gray-600">9:00 AM & 11:00 AM</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Office Hours</h4>
                <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 