// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// Types for our auth
export interface User {
    id: string
    email: string
    user_metadata: {
        firstName?: string
        lastName?: string
        full_name?: string
    }
}

export interface AuthError {
    message: string
}

// Auth helper functions
export const authHelpers = {
    signUp: async (email: string, password: string, firstName: string, lastName: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    firstName,
                    lastName,
                    full_name: `${firstName} ${lastName}`
                }
            }
        })
        return { data, error }
    },

    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        return { data, error }
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    resetPassword: async (email: string) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`
        })
        return { data, error }
    },

    updatePassword: async (password: string) => {
        const { data, error } = await supabase.auth.updateUser({
            password
        })
        return { data, error }
    }
}