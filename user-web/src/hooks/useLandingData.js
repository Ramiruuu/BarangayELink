import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export const useLandingData = () => {
  const [announcements, setAnnouncements] = useState([])
  const [statistics, setStatistics] = useState([])
  const [officials, setOfficials] = useState([])
  const [assistancePrograms, setAssistancePrograms] = useState([])
  const [documents, setDocuments] = useState([])
  const [contactInfo, setContactInfo] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        const [announcementsData, statsData, officialsData, programsData, docsData, contactData] = await Promise.all([
          supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(3),
          supabase.from('barangay_statistics').select('*').order('display_order'),
          supabase.from('barangay_officials').select('*').order('display_order'),
          supabase.from('assistance_programs').select('*').order('display_order'),
          supabase.from('document_types').select('*').order('name'),
          supabase.from('barangay_contact').select('*').order('priority'),
        ])

        if (announcementsData.error) throw announcementsData.error
        if (statsData.error) throw statsData.error
        if (officialsData.error) throw officialsData.error
        if (programsData.error) throw programsData.error
        if (docsData.error) throw docsData.error
        if (contactData.error) throw contactData.error

        setAnnouncements(announcementsData.data || [])
        setStatistics(statsData.data || [])
        setOfficials(officialsData.data || [])
        setAssistancePrograms(programsData.data || [])
        setDocuments(docsData.data || [])
        setContactInfo(contactData.data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching landing data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  return {
    announcements,
    statistics,
    officials,
    assistancePrograms,
    documents,
    contactInfo,
    loading,
    error,
  }
}

// Individual hooks for specific data
export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(3)
        
        if (error) throw error
        setAnnouncements(data || [])
      } catch (err) {
        console.error('Error fetching announcements:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  return { announcements, loading }
}

export const useBarangayOfficials = () => {
  const [officials, setOfficials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const { data, error } = await supabase
          .from('barangay_officials')
          .select('*')
          .eq('is_active', true)
          .order('display_order')
        
        if (error) throw error
        setOfficials(data || [])
      } catch (err) {
        console.error('Error fetching officials:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOfficials()
  }, [])

  return { officials, loading }
}

export const useContactInfo = () => {
  const [contacts, setContacts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('barangay_contact')
          .select('*')
          .eq('is_active', true)
          .order('priority')
        
        if (error) throw error
        
        const contactsObj = {}
        data?.forEach(contact => {
          contactsObj[contact.contact_type] = contact.value
        })
        setContacts(contactsObj)
      } catch (err) {
        console.error('Error fetching contact info:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchContactInfo()
  }, [])

  return { contacts, loading }
}

export const useAssistancePrograms = () => {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data, error } = await supabase
          .from('assistance_programs')
          .select('*')
          .eq('is_active', true)
          .order('display_order')
        
        if (error) throw error
        setPrograms(data || [])
      } catch (err) {
        console.error('Error fetching assistance programs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  return { programs, loading }
}
