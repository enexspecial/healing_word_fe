"use client";

import { useState } from "react";
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
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  setEditing,
  updateAbout,
  updateAboutValue,
  updateService,
  addService,
  removeService,
  updateStaff,
  addStaff,
  removeStaff,
  updateContact,
  resetToOriginal,
} from "@/lib/slices/churchSlice";

export default function ChurchInfoPage() {
  const dispatch = useAppDispatch();
  const { about, services, contact, isEditing } = useAppSelector(
    (state) => state.church
  );
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    { id: "about", name: "About Us", icon: BookOpen },
    { id: "services", name: "Services", icon: Clock },
    { id: "contact", name: "Contact", icon: MapPin },
  ];

  const handleSave = () => {
    dispatch(setEditing(false));
    // Here you would typically save to the backend
    console.log("Saving church information:", { about, services, contact });
  };

  const handleCancel = () => {
    dispatch(setEditing(false));
    dispatch(resetToOriginal());
  };

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
                  dispatch(updateAbout({ mission: e.target.value }))
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
                  dispatch(updateAbout({ vision: e.target.value }))
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
                  onChange={(e) =>
                    dispatch(updateAboutValue({ index, value: e.target.value }))
                  }
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
                      {service.day}
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
                    onClick={() => dispatch(removeService(service.id))}
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
                  dispatch(updateContact({ address: e.target.value }))
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
                  dispatch(updateContact({ phone: e.target.value }))
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
                  dispatch(updateContact({ email: e.target.value }))
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
                value={contact.officeHours}
                onChange={(e) =>
                  dispatch(updateContact({ officeHours: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Office hours"
              />
            ) : (
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                {contact.officeHours}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

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
              onClick={() => dispatch(setEditing(true))}
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
