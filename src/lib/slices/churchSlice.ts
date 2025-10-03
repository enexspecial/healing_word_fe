import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ChurchService {
  id: number
  name: string
  time: string
  day: string
  description: string
}

export interface ChurchStaff {
  id: number
  name: string
  role: string
  email: string
  phone: string
  bio: string
}

export interface ChurchAbout {
  mission: string
  vision: string
  history: string
  values: string[]
}

export interface ChurchContact {
  address: string
  phone: string
  email: string
  website: string
  officeHours: string
}

export interface ChurchState {
  about: ChurchAbout
  services: ChurchService[]
  staff: ChurchStaff[]
  contact: ChurchContact
  isEditing: boolean
  isLoading: boolean
  error: string | null
}

const initialState: ChurchState = {
  about: {
    mission: 'To spread the healing word of God and bring hope to all who seek it.',
    vision: 'A community where everyone experiences God\'s love and finds their purpose in Christ.',
    history: 'Founded in 1995, Healing Word Christian Church has been serving our community with love and dedication for over 25 years.',
    values: [
      'Faith in Christ',
      'Love for all people',
      'Service to community',
      'Biblical teaching',
      'Family values'
    ]
  },
  services: [
    {
      id: 1,
      name: 'Sunday Morning Service',
      time: '9:00 AM',
      day: 'Sunday',
      description: 'Main worship service with praise, prayer, and preaching'
    },

    {
      id: 2,
      name: 'Wednesday Bible Study',
      time: '7:00 PM',
      day: 'Wednesday',
      description: 'Midweek Bible study and prayer meeting'
    }
  ],
  staff: [
    {
      id: 1,
      name: 'Pastor Michael Johnson',
      role: 'Senior Pastor',
      email: 'pastor.johnson@healing-word-church.org',
      phone: '+2348144093507',
      bio: 'Leading our congregation with wisdom and compassion for over 15 years.'
    },
    {
      id: 2,
      name: 'Dr. Sarah Williams',
      role: 'Associate Pastor',
      email: 'sarah.williams@healing-word-church.org',
      phone: '+2348144093508',
      bio: 'Specializing in youth ministry and family counseling.'
    },
    {
      id: 3,
      name: 'Mike Chen',
      role: 'Youth Pastor',
      email: 'mike.chen@healing-word-church.org',
      phone: '+2348144093509',
      bio: 'Passionate about guiding young people in their faith journey.'
    }
  ],
  contact: {
    address: '6 Bella Crescent Behind Peridot Filling Station After Oba\'s Palace Iyana Ejigbo Lagos, Nigeria',
    phone: '+2348144093507',
    email: 'info@healing-word-church.org',
    website: 'www.healing-word-church.org',
    officeHours: 'Monday - Friday: 9:00 AM - 5:00 PM'
  },
  isEditing: false,
  isLoading: false,
  error: null
}

const churchSlice = createSlice({
  name: 'church',
  initialState,
  reducers: {
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload
    },
    updateAbout: (state, action: PayloadAction<Partial<ChurchAbout>>) => {
      state.about = { ...state.about, ...action.payload }
    },
    updateAboutValue: (state, action: PayloadAction<{ index: number; value: string }>) => {
      const { index, value } = action.payload
      if (state.about.values[index] !== undefined) {
        state.about.values[index] = value
      }
    },
    updateService: (state, action: PayloadAction<{ id: number; updates: Partial<ChurchService> }>) => {
      const { id, updates } = action.payload
      const serviceIndex = state.services.findIndex(service => service.id === id)
      if (serviceIndex !== -1) {
        state.services[serviceIndex] = { ...state.services[serviceIndex], ...updates }
      }
    },
    addService: (state, action: PayloadAction<Omit<ChurchService, 'id'>>) => {
      const newId = Math.max(...state.services.map(s => s.id), 0) + 1
      state.services.push({ ...action.payload, id: newId })
    },
    removeService: (state, action: PayloadAction<number>) => {
      state.services = state.services.filter(service => service.id !== action.payload)
    },
    updateStaff: (state, action: PayloadAction<{ id: number; updates: Partial<ChurchStaff> }>) => {
      const { id, updates } = action.payload
      const staffIndex = state.staff.findIndex(member => member.id === id)
      if (staffIndex !== -1) {
        state.staff[staffIndex] = { ...state.staff[staffIndex], ...updates }
      }
    },
    addStaff: (state, action: PayloadAction<Omit<ChurchStaff, 'id'>>) => {
      const newId = Math.max(...state.services.map(s => s.id), 0) + 1
      state.staff.push({ ...action.payload, id: newId })
    },
    removeStaff: (state, action: PayloadAction<number>) => {
      state.staff = state.staff.filter(member => member.id !== action.payload)
    },
    updateContact: (state, action: PayloadAction<Partial<ChurchContact>>) => {
      state.contact = { ...state.contact, ...action.payload }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    resetToOriginal: (state) => {
      // Reset to initial state
      state.about = initialState.about
      state.services = initialState.services
      state.staff = initialState.staff
      state.contact = initialState.contact
      state.isEditing = false
      state.error = null
    }
  }
})

export const {
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
  setLoading,
  setError,
  resetToOriginal
} = churchSlice.actions

export default churchSlice.reducer
