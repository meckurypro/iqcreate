// src/admin/useAdmin.ts
import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib'

export type AdminState = {
  status: 'loading' | 'unconfigured' | 'signed_out' | 'denied' | 'admin'
  email: string
}

/** Signs in with a Meckury AI account and checks it with the same is_admin() the platform uses. */
export function useAdmin() {
  const [state, setState] = useState<AdminState>({ status: supabase ? 'loading' : 'unconfigured', email: '' })

  const check = useCallback(async (session: Session | null) => {
    if (!supabase) return
    if (!session) { setState({ status: 'signed_out', email: '' }); return }
    const { data, error } = await supabase.rpc('is_admin')
    setState({ status: !error && data === true ? 'admin' : 'denied', email: session.user.email ?? '' })
  }, [])

  useEffect(() => {
    if (!supabase) return
    void supabase.auth.getSession().then(({ data }) => check(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer: awaiting Supabase calls inside this callback can deadlock the auth client.
      setTimeout(() => { void check(session) }, 0)
    })
    return () => data.subscription.unsubscribe()
  }, [check])

  const signIn = async (email: string, password: string) => {
    if (!supabase) return 'Supabase is not configured.'
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    return error ? error.message : ''
  }

  const signInWithGoogle = async () => {
    if (!supabase) return 'Supabase is not configured.'
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/admin` } })
    return error ? error.message : ''
  }

  const signOut = async () => { if (supabase) await supabase.auth.signOut() }

  return { ...state, signIn, signInWithGoogle, signOut }
}
