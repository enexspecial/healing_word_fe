import { Clock, Heart, Users, BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Our Church
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Learn about our story, mission, and the amazing people who make Healing Word Christian Church a place of hope and community.
          </p>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-12 h-12 text-blue-600" />
              </div>
            </div>

            {/* Main Message */}
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Coming Soon
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're working hard to bring you the complete story of Healing Word Christian Church. 
              Our About page will feature our history, mission, values, and the wonderful people who make our church family special.
            </p>

            {/* What to Expect */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Story</h3>
                <p className="text-gray-600">
                  Discover how God has been working through our church community over the years
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Team</h3>
                <p className="text-gray-600">
                  Meet our pastors, staff, and leadership team who serve our congregation
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
                <p className="text-gray-600">
                  Learn about our vision, values, and commitment to serving God and our community
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Stay Connected
              </h3>
              <p className="text-gray-600 mb-6">
                While we're building this page, you can still connect with us through our other resources and services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/live" className="btn-primary flex items-center justify-center gap-2">
                  Watch Live Services
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/ebooks" className="btn-outline flex items-center justify-center gap-2">
                  Browse Resources
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Want to Learn More?
            </h3>
            <p className="text-gray-600 mb-8">
              Visit us this Sunday or reach out to us directly. We'd love to share our story with you in person!
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Service Times</h4>
                <p className="text-gray-600">Sundays at 9:00 AM & 11:00 AM</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                <p className="text-gray-600">123 Church Street, Your City</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 