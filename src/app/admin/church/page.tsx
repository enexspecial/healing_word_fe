"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Edit,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  BookOpen,
  Heart,
  Target,
  History,
} from "lucide-react";
import { adminApiService } from "@/lib/services/adminApiService";

// Interface matching the backend entity structure
interface ChurchInfoDB {
  id: string;
  key: string;
  value: string;
  description?: string;
  aboutData?: {
    missionStatement?: string;
    visionStatement?: string;
    values?: string[];
    history?: string;
    leadership?: string;
  };
  servicesData?: {
    services: Array<{
      id?: string;
      name: string;
      description: string;
      time: string;
      dayOfWeek: string;
      location?: string;
      isActive?: boolean;
    }>;
  };
  contactData?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email?: string;
    website?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      youtube?: string;
    };
    officeHours?: { [key: string]: string };
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ChurchInfoPage() {
  const [activeTab, setActiveTab] = useState("about");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [churchInfo, setChurchInfo] = useState<ChurchInfoDB[]>([]);
  const [about, setAbout] = useState({
    mission: "To spread the love of Christ and build a strong community of believers.",
    vision: "To be a beacon of hope and healing in our community.",
    values: ["Faith", "Love", "Community", "Service", "Excellence"]
  });
  const [services, setServices] = useState([
    { id: "1", name: "Sunday Worship", description: "Main worship service", dayOfWeek: "Sunday", time: "9:00 AM", location: "Main Sanctuary", isActive: true },
    { id: "2", name: "Wednesday Bible Study", description: "Mid-week Bible study", dayOfWeek: "Wednesday", time: "7:00 PM", location: "Conference Room", isActive: true },
  ]);
  const [contact, setContact] = useState({
    address: "123 Church Street",
    city: "City",
    state: "State",
    zipCode: "12345",
    phone: "(555) 123-4567",
    email: "info@healingword.com",
    website: "https://healingword.com",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: ""
    },
    officeHours: { "Monday-Friday": "9:00 AM - 5:00 PM" } as { [key: string]: string }
  });

  useEffect(() => {
    loadChurchInfo();
  }, []);

  const loadChurchInfo = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getAllChurchInfo();
      if (response.success && response.data) {
        setChurchInfo(response.data as unknown as ChurchInfoDB[]);
        // Parse church info data
        parseChurchData(response.data as unknown as ChurchInfoDB[]);
      }
    } catch (error) {
      console.error("Failed to load church info:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseChurchData = (data: ChurchInfoDB[]) => {
    data.forEach(item => {
      if (item.key === 'about' && item.aboutData) {
        setAbout({
          mission: item.aboutData.missionStatement || "To spread the love of Christ and build a strong community of believers.",
          vision: item.aboutData.visionStatement || "To be a beacon of hope and healing in our community.",
          values: item.aboutData.values || ["Faith", "Love", "Community", "Service", "Excellence"]
        });
      }
      if (item.key === 'services' && item.servicesData) {
        setServices(item.servicesData.services.map((service, index) => ({
          id: service.id || (index + 1).toString(),
          name: service.name,
          description: service.description,
          dayOfWeek: service.dayOfWeek,
          time: service.time,
          location: service.location || "Main Sanctuary",
          isActive: service.isActive ?? true
        })));
      }
      if (item.key === 'contact' && item.contactData) {
        setContact({
          address: item.contactData.address,
          city: item.contactData.city,
          state: item.contactData.state,
          zipCode: item.contactData.zipCode,
          phone: item.contactData.phone,
          email: item.contactData.email || "info@healingword.com",
          website: item.contactData.website || "https://healingword.com",
          socialMedia: {
            facebook: item.contactData.socialMedia?.facebook || "",
            instagram: item.contactData.socialMedia?.instagram || "",
            twitter: item.contactData.socialMedia?.twitter || "",
            youtube: item.contactData.socialMedia?.youtube || ""
          },
          officeHours: item.contactData.officeHours || { "Monday-Friday": "9:00 AM - 5:00 PM" } as { [key: string]: string }
        });
      }
    });
  };

  const handleSave = async () => {
    try {
      // Update church info via API
      for (const item of churchInfo) {
        if (item.key === 'about') {
          await adminApiService.updateChurchInfo(item.id, { 
          aboutData: {
            missionStatement: about.mission,
            visionStatement: about.vision,
            values: about.values
          }
        } as any);
        }
        if (item.key === 'services') {
          await adminApiService.updateChurchInfo(item.id, { servicesData: { services } } as any);
        }
        if (item.key === 'contact') {
          await adminApiService.updateChurchInfo(item.id, { contactData: contact } as any);
        }
      }
      setIsEditing(false);
      alert("Church information saved successfully!");
    } catch (error) {
      console.error("Failed to save church info:", error);
      alert("Failed to save church information");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadChurchInfo(); // Reload original data
  };

  const tabs = [
    { id: "about", name: "About Us", icon: BookOpen },
    { id: "services", name: "Services", icon: Clock },
    { id: "contact", name: "Contact", icon: MapPin },
  ];

  const renderAboutTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Mission & Vision
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mission Statement
            </label>
            {isEditing ? (
              <textarea
                value={about.mission}
                onChange={(e) =>
                  setAbout({ ...about, mission: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                aria-label="Mission statement"
              />
            ) : (
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                {about.mission}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vision Statement
            </label>
            {isEditing ? (
              <textarea
                value={about.vision}
                onChange={(e) =>
                  setAbout({ ...about, vision: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                aria-label="Vision statement"
              />
            ) : (
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                {about.vision}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Church Values
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {about.values.map((value, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Heart className="h-5 w-5 text-red-500" />
              {isEditing ? (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    const newValues = [...about.values];
                    newValues[index] = e.target.value;
                    setAbout({ ...about, values: newValues });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label={`Church value ${index + 1}`}
                />
              ) : (
                <span className="text-gray-700">{value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderServicesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Service Times</h3>
        {isEditing && (
          <button className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            Add Service
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {service.name}
                  </h4>
                  <p className="text-gray-600">{service.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {service.dayOfWeek}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {service.time}
                    </span>
                  </div>
                </div>
              </div>
              {isEditing && (
                <div className="flex space-x-2">
                  <button
                    className="text-indigo-600 hover:text-indigo-900"
                    aria-label={`Edit ${service.name}`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => setServices(services.filter(s => s.id !== service.id))}
                    aria-label={`Delete ${service.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            {isEditing ? (
              <input
                type="text"
                value={contact.address}
                onChange={(e) =>
                  setContact({ ...contact, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Church address"
              />
            ) : (
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                {contact.address}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            {isEditing ? (
              <input
                type="text"
                value={contact.phone}
                onChange={(e) =>
                  setContact({ ...contact, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Church phone number"
              />
            ) : (
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                {contact.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={contact.email}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Church email address"
              />
            ) : (
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                {contact.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Office Hours
            </label>
            {isEditing ? (
              <input
                type="text"
                value={Object.entries(contact.officeHours).map(([day, hours]) => `${day}: ${hours}`).join(', ')}
                onChange={(e) => {
                  const value = e.target.value;
                  // Simple parsing - in a real app you'd want more sophisticated parsing
                  setContact({ ...contact, officeHours: { "Monday-Friday": value || "9:00 AM - 5:00 PM" } });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Office hours"
              />
            ) : (
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                {Object.entries(contact.officeHours).map(([day, hours]) => `${day}: ${hours}`).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Church Information
          </h1>
          <p className="text-gray-600">
            Manage church details, services, staff, and contact information.
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Information
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4 inline mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "about" && renderAboutTab()}
          {activeTab === "services" && renderServicesTab()}
          {activeTab === "contact" && renderContactTab()}
        </div>
      </div>
    </div>
  );
}
