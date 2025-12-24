// src/pages/SupabaseTest.jsx
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

function SupabaseTest() {
  const [status, setStatus] = useState('Checking connection...')

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple auth check (does not require tables)
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          setStatus('❌ Connection failed: ' + error.message)
        } else {
          setStatus('✅ Supabase connected successfully!')
          console.log('Session data:', data)
        }
      } catch (err) {
        setStatus('❌ Error: ' + err.message)
      }
    }

    checkConnection()
  }, [])

  return (
    <div style={{ padding: '40px', fontSize: '20px' }}>
      <h2>Supabase Connection Test</h2>
      <p>{status}</p>
    </div>
  )
}

export default SupabaseTest
