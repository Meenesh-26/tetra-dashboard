'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const orgName = formData.get('orgName') as string

  // 1. Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        org_name: orgName,
        role: 'ADMIN',
      },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  // 2. Create the Organization in the public schema
  const { data: orgData, error: orgError } = await supabase
    .from('Org')
    .insert({ name: orgName })
    .select()
    .single()

  if (orgError) {
    return { error: orgError.message }
  }

  // 3. We'll store the orgId in the user's metadata for easy access
  // In a real app, you'd use a junction table, but this works for MVP
  await supabase.auth.updateUser({
    data: { orgId: orgData.id }
  })

  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signOut() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  await supabase.auth.signOut()
  redirect('/login')
}
