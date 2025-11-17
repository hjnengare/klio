/**
 * Connection Pool Manager for Supabase Clients
 * Implements singleton pattern with connection reuse for better performance
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

// Cache for Supabase clients per request
const clientCache = new WeakMap<Request, SupabaseClient>();

// Global client pool (for non-request-scoped operations)
let globalClient: SupabaseClient | null = null;

/**
 * Get or create a Supabase client for the current request
 * Uses WeakMap to ensure one client per request lifecycle
 */
export async function getPooledSupabaseClient(request?: Request): Promise<SupabaseClient> {
  // If request is provided, use request-scoped caching
  if (request) {
    const cached = clientCache.get(request);
    if (cached) {
      return cached;
    }

    const cookieStore = await cookies();
    const client = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                cookieStore.set({ name, value, ...options });
              } catch (error) {
                // Ignore cookie set errors in Server Components
              }
            });
          },
        },
      }
    );

    clientCache.set(request, client);
    return client;
  }

  // For non-request-scoped operations, use global singleton
  if (!globalClient) {
    const cookieStore = await cookies();
    globalClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                cookieStore.set({ name, value, ...options });
              } catch (error) {
                // Ignore cookie set errors
              }
            });
          },
        },
      }
    );
  }

  return globalClient;
}

/**
 * Create multiple Supabase clients for parallel operations
 * Useful when you need to execute independent queries simultaneously
 */
export async function createParallelClients(count: number = 2): Promise<SupabaseClient[]> {
  const cookieStore = await cookies();
  const clients: SupabaseClient[] = [];

  for (let i = 0; i < count; i++) {
    clients.push(
      createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                try {
                  cookieStore.set({ name, value, ...options });
                } catch (error) {
                  // Ignore cookie set errors
                }
              });
            },
          },
        }
      )
    );
  }

  return clients;
}

/**
 * Clear the global client cache (useful for testing or memory management)
 */
export function clearClientCache() {
  globalClient = null;
}

