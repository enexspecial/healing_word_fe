import LiveStream from '@/components/ui/LiveStream'
import { Calendar, Clock, Users, Video, Play } from 'lucide-react'

export default function LivePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Live Services
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Join us live for worship, or watch our archived services anytime. 
            Experience the presence of God from anywhere in the world.
          </p>
        </div>
      </section>

      {/* Live Stream Section */}
      <section className="section-padding">
        <div className="container-custom">
          <LiveStream
            streamUrl=""
            platform="youtube"
            isLive={false}
            title="Sunday Morning Service"
            description="Join us for our weekly Sunday worship service featuring praise, prayer, and powerful preaching from God's Word."
            chatEnabled={true}
          />
        </div>
      </section>

      {/* Service Schedule */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Service Schedule
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Sunday Services</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Morning Worship</span>
                  <span className="font-semibold text-blue-600">9:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Evening Worship</span>
                  <span className="font-semibold text-blue-600">11:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday School</span>
                  <span className="font-semibold text-blue-600">10:00 AM</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-600">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-yellow-600" />
                <h3 className="text-xl font-semibold text-gray-900">Midweek Services</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bible Study</span>
                  <span className="font-semibold text-yellow-600">Wednesday 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prayer Meeting</span>
                  <span className="font-semibold text-yellow-600">Tuesday 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Youth Group</span>
                  <span className="font-semibold text-yellow-600">Friday 6:30 PM</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Special Events</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Revival Services</span>
                  <span className="font-semibold text-green-600">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Community Outreach</span>
                  <span className="font-semibold text-green-600">Quarterly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conferences</span>
                  <span className="font-semibold text-green-600">Annually</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Services */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Recent Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Sunday Service - July 21, 2024",
                preacher: "Pastor Johnson",
                topic: "Walking in Faith",
                duration: "1:25:30",
                thumbnail: "/images/service-thumb-1.jpg"
              },
              {
                title: "Wednesday Bible Study - July 17, 2024",
                preacher: "Pastor Johnson",
                topic: "The Book of Romans",
                duration: "45:15",
                thumbnail: "/images/service-thumb-2.jpg"
              },
              {
                title: "Sunday Service - July 14, 2024",
                preacher: "Pastor Johnson",
                topic: "God's Grace",
                duration: "1:32:45",
                thumbnail: "/images/service-thumb-3.jpg"
              }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white opacity-80" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-2">Preacher: {service.preacher}</p>
                  <p className="text-gray-600 mb-3">Topic: {service.topic}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{service.duration}</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Watch Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Watch */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How to Watch
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Services</h3>
              <p className="text-gray-600">
                Join us live every Sunday at 9:00 AM and 11:00 AM for our worship services. 
                Click the play button above when the service is live.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Archived Services</h3>
              <p className="text-gray-600">
                Can't make it live? Watch our archived services anytime. 
                All services are available for replay within 24 hours.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Stay Connected</h3>
              <p className="text-gray-600">
                Subscribe to our channel to get notified when we go live. 
                Share with friends and family who can't attend in person.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 