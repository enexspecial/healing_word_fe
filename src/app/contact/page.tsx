import { Clock, Mail, Phone, MapPin, MessageCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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
              Contact Form Coming Soon
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're building a comprehensive contact system to better serve you. 
              Our new contact page will include forms, staff directories, and easy ways to get in touch.
            </p>

            {/* What to Expect */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact Forms</h3>
                <p className="text-gray-600">
                  Easy-to-use forms for prayer requests, general inquiries, and ministry questions
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Staff Directory</h3>
                <p className="text-gray-600">
                  Direct contact information for pastors, staff, and ministry leaders
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Response</h3>
                <p className="text-gray-600">
                  Fast response times and multiple ways to reach us when you need us most
                </p>
              </div>
            </div>

            {/* Current Contact Info */}
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                How to Reach Us Now
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                  <p className="text-gray-600">(555) 123-4567</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600">info@healingwordchurch.com</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                  <p className="text-gray-600">123 Church Street, Your City, ST 12345</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-xl">
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