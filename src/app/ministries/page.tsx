import { Clock, Heart, Users, Music, ArrowRight, BookOpen, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function MinistriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our Ministries
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover the various ministries and programs that make our church a vibrant community of faith, service, and growth.
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
              Ministries Page Coming Soon
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're creating a comprehensive overview of all our ministries and programs. 
              Our ministries page will showcase how you can get involved and serve in our church community.
            </p>

            {/* What to Expect */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Youth Ministry</h3>
                <p className="text-gray-600 text-sm">
                  Programs and activities for teens and young adults
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Children's Church</h3>
                <p className="text-gray-600 text-sm">
                  Nurturing faith in our youngest members
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Music Ministry</h3>
                <p className="text-gray-600 text-sm">
                  Choir, praise team, and worship programs
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Outreach</h3>
                <p className="text-gray-600 text-sm">
                  Community service and evangelism
                </p>
              </div>
            </div>

            {/* Current Ministry Info */}
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Get Involved Now
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Bible Study</h4>
                  <p className="text-gray-600 text-sm">Wednesday 7:00 PM</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Prayer Meeting</h4>
                  <p className="text-gray-600 text-sm">Tuesday 7:00 PM</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Youth Group</h4>
                  <p className="text-gray-600 text-sm">Friday 6:30 PM</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Join Us This Sunday
              </h3>
              <p className="text-gray-600 mb-6">
                The best way to learn about our ministries is to visit us and meet our ministry leaders in person!
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

      {/* Ministry Categories Preview */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Ministry Categories
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Children & Youth</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Sunday School</li>
                <li>• Youth Group</li>
                <li>• Children's Church</li>
                <li>• Vacation Bible School</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Worship & Music</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Choir</li>
                <li>• Praise Team</li>
                <li>• Instrumental Ministry</li>
                <li>• Sound & Technical</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Outreach & Service</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Community Outreach</li>
                <li>• Missions</li>
                <li>• Food Bank</li>
                <li>• Prayer Team</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Education & Discipleship</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Bible Study</li>
                <li>• Small Groups</li>
                <li>• New Member Classes</li>
                <li>• Leadership Training</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Family & Fellowship</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Men's Ministry</li>
                <li>• Women's Ministry</li>
                <li>• Senior Adults</li>
                <li>• Fellowship Events</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Administration</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Greeters & Ushers</li>
                <li>• Office Volunteers</li>
                <li>• Facilities Team</li>
                <li>• Communications</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 