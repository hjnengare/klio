module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/src/app/lib/supabase/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getBrowserSupabase",
    ()=>getBrowserSupabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-ssr] (ecmascript)");
"use client";
;
function getBrowserSupabase() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://rnlbbnluoxydtqviwtqj.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJubGJibmx1b3h5ZHRxdml3dHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTc0NzEsImV4cCI6MjA3NTc5MzQ3MX0.dUafp8rCHRTxrksX-XlOCjaNkLHx0t4sr_eboL4OpG8"));
}
}),
"[project]/src/app/lib/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthService",
    ()=>AuthService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/supabase/client.ts [app-ssr] (ecmascript)");
;
class AuthService {
    static getClient() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBrowserSupabase"])();
    }
    static async signUp({ email, password }) {
        const supabase = this.getClient();
        try {
            // Basic validation
            if (!email?.trim() || !password?.trim()) {
                return {
                    user: null,
                    error: {
                        message: 'Email and password are required'
                    }
                };
            }
            if (!this.isValidEmail(email)) {
                return {
                    user: null,
                    error: {
                        message: 'Please enter a valid email address'
                    }
                };
            }
            if (password.length < 8) {
                return {
                    user: null,
                    error: {
                        message: 'Password must be at least 8 characters long'
                    }
                };
            }
            if (!this.isStrongPassword(password)) {
                return {
                    user: null,
                    error: {
                        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                    }
                };
            }
            const { data, error } = await supabase.auth.signUp({
                email: email.trim().toLowerCase(),
                password: password,
                options: {
                    emailRedirectTo: undefined
                }
            });
            if (error) {
                console.error('Supabase signup error:', error);
                return {
                    user: null,
                    error: this.handleSupabaseError(error)
                };
            }
            if (!data.user) {
                return {
                    user: null,
                    error: {
                        message: 'Registration failed. Please try again.'
                    }
                };
            }
            // Profile will be created by database trigger, no need to create manually
            return {
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    created_at: data.user.created_at,
                    updated_at: data.user.updated_at || data.user.created_at
                },
                error: null
            };
        } catch (error) {
            return {
                user: null,
                error: {
                    message: error instanceof Error ? error.message : 'An unexpected error occurred',
                    details: error
                }
            };
        }
    }
    static async signIn({ email, password }) {
        const supabase = this.getClient();
        try {
            if (!email?.trim() || !password?.trim()) {
                return {
                    user: null,
                    error: {
                        message: 'Email and password are required'
                    }
                };
            }
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password: password
            });
            if (error) {
                return {
                    user: null,
                    error: this.handleSupabaseError(error)
                };
            }
            if (!data.user) {
                return {
                    user: null,
                    error: {
                        message: 'Login failed. Please try again.'
                    }
                };
            }
            // Get user profile
            const profile = await this.getUserProfile(data.user.id);
            return {
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    created_at: data.user.created_at,
                    updated_at: data.user.updated_at || data.user.created_at,
                    profile: profile
                },
                error: null
            };
        } catch (error) {
            return {
                user: null,
                error: {
                    message: error instanceof Error ? error.message : 'An unexpected error occurred',
                    details: error
                }
            };
        }
    }
    static async signOut() {
        const supabase = this.getClient();
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                return {
                    error: this.handleSupabaseError(error)
                };
            }
            return {
                error: null
            };
        } catch (error) {
            return {
                error: {
                    message: error instanceof Error ? error.message : 'An unexpected error occurred',
                    details: error
                }
            };
        }
    }
    static async getCurrentUser() {
        const supabase = this.getClient();
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;
            const profile = await this.getUserProfile(user.id);
            return {
                id: user.id,
                email: user.email,
                created_at: user.created_at,
                updated_at: user.updated_at || user.created_at,
                profile: profile
            };
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }
    // Removed createUserProfile - database trigger handles profile creation
    static async getUserProfile(userId) {
        const supabase = this.getClient();
        try {
            const { data, error } = await supabase.from('profiles').select('user_id, onboarding_step, interests_count, last_interests_updated, created_at, updated_at').eq('user_id', userId).single();
            if (error || !data) return undefined;
            return {
                id: data.user_id,
                onboarding_step: data.onboarding_step,
                onboarding_complete: data.onboarding_step === 'complete',
                interests_count: data.interests_count || 0,
                last_interests_updated: data.last_interests_updated,
                created_at: data.created_at,
                updated_at: data.updated_at
            };
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return undefined;
        }
    }
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static isStrongPassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return strongPasswordRegex.test(password);
    }
    static handleSupabaseError(error) {
        // Handle specific error messages from Supabase
        const message = error.message.toLowerCase();
        if (message.includes('user already registered') || message.includes('email already exists') || message.includes('already been registered')) {
            return {
                message: '❌ This email address is already taken. Try logging in instead.',
                code: 'user_exists'
            };
        }
        if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
            return {
                message: '❌ Invalid email or password. Please check your credentials.',
                code: 'invalid_credentials'
            };
        }
        if (message.includes('email not confirmed')) {
            return {
                message: '📧 Please check your email and click the confirmation link to verify your account.',
                code: 'email_not_confirmed'
            };
        }
        if (message.includes('too many requests') || message.includes('rate limit')) {
            return {
                message: '⏰ Too many attempts. Please wait a moment and try again.',
                code: 'rate_limit'
            };
        }
        if (message.includes('signup is disabled') || message.includes('signups not allowed')) {
            return {
                message: '🚫 New registrations are temporarily unavailable. Please try again later.',
                code: 'signup_disabled'
            };
        }
        if (message.includes('password') && (message.includes('weak') || message.includes('requirements'))) {
            return {
                message: '🔐 Password doesn\'t meet security requirements. Use 8+ characters with uppercase, lowercase, and numbers.',
                code: 'weak_password'
            };
        }
        if (message.includes('email') && (message.includes('invalid') || message.includes('format'))) {
            return {
                message: '📧 Please enter a valid email address (e.g., user@example.com).',
                code: 'invalid_email'
            };
        }
        if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
            return {
                message: '🌐 Connection issue. Please check your internet and try again.',
                code: 'network_error'
            };
        }
        if (message.includes('422') || message.includes('unprocessable')) {
            return {
                message: '❌ Registration failed. Please check that your email and password are valid.',
                code: 'invalid_data'
            };
        }
        // Default fallback with more user-friendly message
        return {
            message: error.message || '❌ Something went wrong. Please try again in a moment.',
            code: error.error_code || 'unknown_error'
        };
    }
}
}),
"[project]/src/app/contexts/AuthContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/supabase/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/auth.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBrowserSupabase"])();
    // Initialize auth state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const initializeAuth = async ()=>{
            setIsLoading(true);
            try {
                const currentUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthService"].getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally{
                setIsLoading(false);
            }
        };
        initializeAuth();
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session)=>{
            if (event === 'SIGNED_IN' && session?.user) {
                const currentUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthService"].getCurrentUser();
                setUser(currentUser);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
        });
        return ()=>subscription.unsubscribe();
    }, [
        supabase
    ]);
    const login = async (email, password)=>{
        setIsLoading(true);
        setError(null);
        try {
            const { user: authUser, error: authError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthService"].signIn({
                email,
                password
            });
            if (authError) {
                setError(authError.message);
                setIsLoading(false);
                return false;
            }
            if (authUser) {
                setUser(authUser);
                // Redirect based on onboarding status
                if (authUser.profile?.onboarding_complete) {
                    router.push('/home');
                } else {
                    router.push(`/${authUser.profile?.onboarding_step || 'interests'}`);
                }
            }
            setIsLoading(false);
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed';
            setError(message);
            setIsLoading(false);
            return false;
        }
    };
    const register = async (email, password)=>{
        setIsLoading(true);
        setError(null);
        try {
            const { user: authUser, error: authError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthService"].signUp({
                email,
                password
            });
            if (authError) {
                // Handle specific error cases
                let errorMessage = authError.message;
                if (authError.message.includes('User already registered') || authError.message.includes('already registered')) {
                    errorMessage = 'An account with this email already exists. Please try logging in instead.';
                }
                setError(errorMessage);
                setIsLoading(false);
                return false;
            }
            if (authUser) {
                setUser(authUser);
                // Navigate to interests page after registration
                router.push('/interests');
            }
            setIsLoading(false);
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Registration failed';
            setError(message);
            setIsLoading(false);
            return false;
        }
    };
    const logout = async ()=>{
        setIsLoading(true);
        setError(null);
        try {
            const { error: signOutError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthService"].signOut();
            if (signOutError) {
                setError(signOutError.message);
            } else {
                setUser(null);
                router.push('/onboarding');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Logout failed';
            setError(message);
        } finally{
            setIsLoading(false);
        }
    };
    const updateUser = async (userData)=>{
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            // Update user profile in Supabase if profile data is being updated
            if (userData.profile) {
                // Prepare profile updates - only update fields that exist in the profiles table
                const profileUpdates = {
                    updated_at: new Date().toISOString()
                };
                // Only update onboarding_step if provided
                if (userData.profile.onboarding_step) {
                    profileUpdates.onboarding_step = userData.profile.onboarding_step;
                }
                // Update the profiles table with valid fields only
                const { error } = await supabase.from('profiles').update(profileUpdates).eq('user_id', user.id);
                if (error) throw error;
                // Handle interests separately using the dedicated API
                if (userData.profile.interests && Array.isArray(userData.profile.interests)) {
                    try {
                        const response = await fetch('/api/user/interests', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                selections: userData.profile.interests
                            })
                        });
                        if (!response.ok) {
                            console.warn('Failed to update interests:', await response.text());
                        }
                    } catch (interestError) {
                        console.warn('Error updating interests:', interestError);
                    }
                }
                // Handle subcategories separately using the dedicated API
                if (userData.profile.sub_interests && Array.isArray(userData.profile.sub_interests)) {
                    try {
                        const response = await fetch('/api/user/subcategories', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                subcategories: userData.profile.sub_interests
                            })
                        });
                        if (!response.ok) {
                            console.warn('Failed to update subcategories:', await response.text());
                        }
                    } catch (subcatError) {
                        console.warn('Error updating subcategories:', subcatError);
                    }
                }
            }
            // Update local user state
            const updatedUser = {
                ...user,
                ...userData,
                profile: userData.profile ? {
                    ...user.profile,
                    ...userData.profile
                } : user.profile
            };
            setUser(updatedUser);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Update failed';
            setError(message);
        } finally{
            setIsLoading(false);
        }
    };
    const value = {
        user,
        login,
        register,
        logout,
        updateUser,
        isLoading,
        error
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/contexts/AuthContext.tsx",
        lineNumber: 237,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
}),
"[project]/src/app/contexts/ToastContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastProvider",
    ()=>ToastProvider,
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-ssr] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
"use client";
;
;
;
const ToastContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ToastProvider({ children }) {
    const [toasts, setToasts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // Generate unique ID to prevent collisions
    const generateUniqueId = ()=>{
        return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };
    const showToast = (message, type = 'info', duration = 4000)=>{
        const id = generateUniqueId();
        const newToast = {
            id,
            message,
            type,
            duration
        };
        setToasts((prev)=>[
                ...prev,
                newToast
            ]);
        // Auto remove toast after duration
        setTimeout(()=>{
            removeToast(id);
        }, duration);
    };
    const removeToast = (id)=>{
        setToasts((prev)=>prev.filter((toast)=>toast.id !== id));
    };
    const getToastStyles = (type)=>{
        switch(type){
            case 'success':
                return 'bg-white   text-sage';
            case 'sage':
                return 'bg-white   text-sage';
            case 'error':
                return 'bg-white   text-red-500';
            case 'warning':
                return 'bg-white   text-amber-500';
            default:
                return 'bg-white   text-charcoal';
        }
    };
    const getToastIcon = (type)=>{
        const iconClasses = "w-5 h-5 flex-shrink-0";
        switch(type){
            case 'success':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                    className: iconClasses
                }, void 0, false, {
                    fileName: "[project]/src/app/contexts/ToastContext.tsx",
                    lineNumber: 67,
                    columnNumber: 16
                }, this);
            case 'sage':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                    className: iconClasses
                }, void 0, false, {
                    fileName: "[project]/src/app/contexts/ToastContext.tsx",
                    lineNumber: 69,
                    columnNumber: 16
                }, this);
            case 'error':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                    className: iconClasses
                }, void 0, false, {
                    fileName: "[project]/src/app/contexts/ToastContext.tsx",
                    lineNumber: 71,
                    columnNumber: 16
                }, this);
            case 'warning':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                    className: iconClasses
                }, void 0, false, {
                    fileName: "[project]/src/app/contexts/ToastContext.tsx",
                    lineNumber: 73,
                    columnNumber: 16
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                    className: iconClasses
                }, void 0, false, {
                    fileName: "[project]/src/app/contexts/ToastContext.tsx",
                    lineNumber: 75,
                    columnNumber: 16
                }, this);
        }
    };
    const value = {
        showToast,
        removeToast
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastContext.Provider, {
        value: value,
        children: [
            children,
            toasts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-4 left-4 z-[9999] flex flex-col-reverse gap-2 pointer-events-none max-w-sm",
                children: toasts.map((toast)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `
                pointer-events-auto max-w-sm w-full backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-sage/20
                transition-all duration-300 ease-out animate-in slide-in-from-left
                ${getToastStyles(toast.type)}
              `,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-shrink-0",
                                    children: getToastIcon(toast.type)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/contexts/ToastContext.tsx",
                                    lineNumber: 101,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-sf text-sm font-600 leading-tight",
                                        children: toast.message
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/contexts/ToastContext.tsx",
                                        lineNumber: 105,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/contexts/ToastContext.tsx",
                                    lineNumber: 104,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>removeToast(toast.id),
                                    className: "flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-charcoal/10 rounded-full",
                                    "aria-label": "Dismiss notification",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/contexts/ToastContext.tsx",
                                        lineNumber: 114,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/contexts/ToastContext.tsx",
                                    lineNumber: 109,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/contexts/ToastContext.tsx",
                            lineNumber: 100,
                            columnNumber: 15
                        }, this)
                    }, toast.id, false, {
                        fileName: "[project]/src/app/contexts/ToastContext.tsx",
                        lineNumber: 92,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/contexts/ToastContext.tsx",
                lineNumber: 90,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/contexts/ToastContext.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
function useToast() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
}),
"[project]/src/app/contexts/OnboardingContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OnboardingProvider",
    ()=>OnboardingProvider,
    "useOnboarding",
    ()=>useOnboarding
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/contexts/ToastContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const OnboardingContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ONBOARDING_STEPS = [
    'interests',
    'subcategories',
    'deal-breakers',
    'complete'
];
// Fallback data in case API fails
const FALLBACK_INTERESTS = [
    {
        id: 'food-drink',
        name: 'Food & Drink',
        description: 'Restaurants, cafes, and culinary experiences',
        icon: 'restaurant'
    },
    {
        id: 'beauty-wellness',
        name: 'Beauty & Wellness',
        description: 'Gyms, spas, and personal care services',
        icon: 'cut'
    },
    {
        id: 'home-services',
        name: 'Home & Services',
        description: 'Home improvement and professional services',
        icon: 'home'
    },
    {
        id: 'outdoors-adventure',
        name: 'Outdoors & Adventure',
        description: 'Outdoor activities and adventures',
        icon: 'bicycle'
    },
    {
        id: 'nightlife-entertainment',
        name: 'Nightlife & Entertainment',
        description: 'Movies, shows, and nightlife',
        icon: 'musical-notes'
    },
    {
        id: 'arts-culture',
        name: 'Arts & Culture',
        description: 'Museums, galleries, and cultural experiences',
        icon: 'color-palette'
    },
    {
        id: 'family-pets',
        name: 'Family & Pets',
        description: 'Family activities and pet services',
        icon: 'heart'
    },
    {
        id: 'shopping-lifestyle',
        name: 'Shopping & Lifestyle',
        description: 'Retail stores and lifestyle services',
        icon: 'bag'
    }
];
function OnboardingProvider({ children }) {
    const { user, updateUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const { showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [interests, setInterests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [subInterests, setSubInterests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedInterests, setSelectedInterests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedSubInterests, setSelectedSubInterests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedDealbreakers, setSelectedDealbreakers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const currentStep = user?.profile?.onboarding_step || 'interests';
    const loadInterests = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            setIsLoading(true);
            setError(null);
            // Load from catalog API
            const response = await fetch('/api/interests');
            if (response.ok) {
                const data = await response.json();
                if (data.interests && Array.isArray(data.interests)) {
                    setInterests(data.interests);
                    return;
                }
            }
            // Fallback to static data if API fails
            console.warn('Interests API failed, using fallback data');
            setInterests(FALLBACK_INTERESTS);
        } catch (error) {
            console.error('Error loading interests:', error);
            setError('Failed to load interests');
            // Use fallback data even on error
            setInterests(FALLBACK_INTERESTS);
        } finally{
            setIsLoading(false);
        }
    }, []);
    const loadSubInterests = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (interestIds)=>{
        try {
            setIsLoading(true);
            setError(null);
            const qs = interestIds.length ? `?interests=${interestIds.join(",")}` : "";
            const res = await fetch(`/api/subcategories${qs}`, {
                cache: "no-store"
            });
            if (!res.ok) throw new Error("Failed to load subcategories");
            const { subcategories } = await res.json();
            // Set subcategories directly - they should be {id,label,interest_id}
            setSubInterests(subcategories);
            console.log("loaded subInterests", subcategories);
        } catch (error) {
            console.error('Error loading sub-interests:', error);
            setError('Failed to load sub-interests');
            setSubInterests([]);
        } finally{
            setIsLoading(false);
        }
    }, []);
    const getNextStep = (current)=>{
        const currentIndex = ONBOARDING_STEPS.indexOf(current);
        if (currentIndex === -1 || currentIndex === ONBOARDING_STEPS.length - 1) {
            return 'complete';
        }
        return ONBOARDING_STEPS[currentIndex + 1];
    };
    const getStepCompletionMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((step)=>{
        switch(step){
            case 'interests':
                return `Great! ${selectedInterests.length} interests selected. Let's explore sub-categories!`;
            case 'subcategories':
                return `Perfect! ${selectedSubInterests.length} sub-interests added. Now let's set your dealbreakers.`;
            case 'deal-breakers':
                return `Excellent! ${selectedDealbreakers.length} dealbreakers set. Almost done!`;
            default:
                return 'Step completed successfully!';
        }
    }, [
        selectedInterests.length,
        selectedSubInterests.length,
        selectedDealbreakers.length
    ]);
    const nextStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!user) return;
        try {
            setIsLoading(true);
            setError(null);
            const nextStepName = getNextStep(currentStep);
            // Save current step data
            const profileUpdates = {
                onboarding_step: nextStepName
            };
            if (currentStep === 'interests') {
                profileUpdates.interests = selectedInterests;
            } else if (currentStep === 'subcategories') {
                profileUpdates.sub_interests = selectedSubInterests;
            } else if (currentStep === 'deal-breakers') {
                profileUpdates.dealbreakers = selectedDealbreakers;
            }
            await updateUser({
                profile: profileUpdates
            });
            // Show success toast for step completion
            const completionMessage = getStepCompletionMessage(currentStep);
            showToast(completionMessage, 'success', 3000);
            // Navigate to the next step
            if (nextStepName === 'complete') {
                router.push('/home');
            } else if (nextStepName === 'subcategories' && currentStep === 'interests') {
                // Pass selected interests as URL params to subcategories
                const interestParams = selectedInterests.length > 0 ? `?interests=${selectedInterests.join(',')}` : '';
                router.push(`/subcategories${interestParams}`);
            } else {
                router.push(`/${nextStepName}`);
            }
        } catch (error) {
            console.error('Error proceeding to next step:', error);
            setError('Failed to save progress');
        } finally{
            setIsLoading(false);
        }
    }, [
        user,
        currentStep,
        selectedInterests,
        selectedSubInterests,
        selectedDealbreakers,
        updateUser,
        showToast,
        getStepCompletionMessage,
        router
    ]);
    const completeOnboarding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!user) return;
        try {
            setIsLoading(true);
            setError(null);
            // Mark onboarding as complete with all final data
            await updateUser({
                profile: {
                    onboarding_complete: true,
                    onboarding_step: 'complete',
                    interests: selectedInterests,
                    sub_interests: selectedSubInterests,
                    dealbreakers: selectedDealbreakers
                }
            });
            // Note: All selections are now saved locally via updateUser
            // Show completion toast
            showToast('🎉 Welcome to KLIO! Your profile is now complete.', 'success', 4000);
        } catch (error) {
            console.error('Error completing onboarding:', error);
            setError('Failed to complete onboarding');
        } finally{
            setIsLoading(false);
        }
    }, [
        user,
        selectedInterests,
        selectedSubInterests,
        selectedDealbreakers,
        updateUser,
        showToast
    ]);
    const resetOnboarding = ()=>{
        setSelectedInterests([]);
        setSelectedSubInterests([]);
        setSelectedDealbreakers([]);
        setError(null);
    };
    const value = {
        // Data
        interests,
        subInterests,
        selectedInterests,
        selectedSubInterests,
        selectedDealbreakers,
        // State
        isLoading,
        error,
        currentStep,
        // Actions
        loadInterests,
        loadSubInterests,
        setSelectedInterests,
        setSelectedSubInterests,
        setSelectedDealbreakers,
        nextStep,
        completeOnboarding,
        resetOnboarding
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(OnboardingContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/contexts/OnboardingContext.tsx",
        lineNumber: 265,
        columnNumber: 5
    }, this);
}
function useOnboarding() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}
}),
"[project]/src/app/components/Providers/PageTransitionProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PageTransitionProvider,
    "usePageTransition",
    ()=>usePageTransition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const PageTransitionContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function usePageTransition() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(PageTransitionContext);
    if (!context) {
        throw new Error("usePageTransition must be used within PageTransitionProvider");
    }
    return context;
}
function PageTransitionProvider({ children }) {
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const contextValue = {
        isLoading,
        setIsLoading
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PageTransitionContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/components/Providers/PageTransitionProvider.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/components/Performance/WebVitals.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
function WebVitals() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Skip in development to improve performance
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
    }, []);
    return null;
}
const __TURBOPACK__default__export__ = WebVitals;
}),
"[project]/src/app/components/ErrorBoundary/ErrorBoundary.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Component"] {
    constructor(props){
        super(props);
        this.state = {
            hasError: false,
            retryCount: 0
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
            retryCount: 0
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        // Report to monitoring service in production
        if (("TURBOPACK compile-time value", "development") === 'production') {
        // Here you would send to error reporting service
        // e.g., Sentry, LogRocket, etc.
        }
        // Call optional error callback
        this.props.onError?.(error, errorInfo);
    }
    handleRetry = ()=>{
        this.setState((prevState)=>({
                hasError: false,
                error: undefined,
                retryCount: prevState.retryCount + 1
            }));
    };
    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }
            const isRepeatedError = this.state.retryCount >= 2;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-dvh flex items-center justify-center  bg-white   px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-md w-full text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ion-icon", {
                                name: "warning-outline",
                                style: {
                                    color: '#dc2626',
                                    fontSize: '2rem'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/ErrorBoundary/ErrorBoundary.tsx",
                                lineNumber: 61,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/ErrorBoundary/ErrorBoundary.tsx",
                            lineNumber: 60,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "font-sf text-xl font-600 text-charcoal mb-3",
                            children: isRepeatedError ? 'Persistent Error' : 'Something went wrong'
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/ErrorBoundary/ErrorBoundary.tsx",
                            lineNumber: 63,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-sf text-sm text-charcoal/70 mb-6 leading-relaxed",
                            children: isRepeatedError ? 'We\'re experiencing technical difficulties. Please contact support if this continues.' : 'We encountered an unexpected error. Please try again.'
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/ErrorBoundary/ErrorBoundary.tsx",
                            lineNumber: 66,
                            columnNumber: 13
                        }, this),
                        ("TURBOPACK compile-time value", "development") === 'development' && this.state.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                            className: "mb-6 text-left bg-red-50 p-4 rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                    className: "font-sf text-sm font-600 text-red-600 cursor-pointer",
                                    children: "Error Details (Dev Only)"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/ErrorBoundary/ErrorBoundary.tsx",
                                    lineNumber: 76,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                    className: "mt-2 text-xs text-red-800 whitespace-pre-wrap overflow-auto",
                                    children: this.state.error.stack
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/ErrorBoundary/ErrorBoundary.tsx",
                                    lineNumber: 79,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/ErrorBoundary/ErrorBoundary.tsx",
                            lineNumber: 75,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: this.handleRetry,
                                    disabled: isRepeatedError,
                                    className: `w-full font-sf text-base font-600 py-3 px-6 rounded-2xl transition-colors duration-300 focus:outline-none focus:ring-2 ${isRepeatedError ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-sage text-white hover:bg-sage/90 focus:ring-sage/30'}`,
                                    children: isRepeatedError ? 'Unable to Retry' : 'Try Again'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/ErrorBoundary/ErrorBoundary.tsx",
                                    lineNumber: 86,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>window.location.href = '/',
                                    className: "w-full bg-coral text-white font-sf text-base font-600 py-3 px-6 rounded-2xl hover:bg-coral/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-coral/30",
                                    children: "Go to Home"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/ErrorBoundary/ErrorBoundary.tsx",
                                    lineNumber: 98,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/ErrorBoundary/ErrorBoundary.tsx",
                            lineNumber: 85,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/ErrorBoundary/ErrorBoundary.tsx",
                    lineNumber: 59,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/components/ErrorBoundary/ErrorBoundary.tsx",
                lineNumber: 58,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
}
const __TURBOPACK__default__export__ = ErrorBoundary;
}),
"[project]/src/app/lib/supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createProfile",
    ()=>createProfile,
    "getInterests",
    ()=>getInterests,
    "getProfile",
    ()=>getProfile,
    "getSubInterests",
    ()=>getSubInterests,
    "saveUserSelections",
    ()=>saveUserSelections,
    "supabase",
    ()=>supabase,
    "updateProfile",
    ()=>updateProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/supabase/client.ts [app-ssr] (ecmascript)");
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBrowserSupabase"])();
const createProfile = async (userId)=>{
    const { data, error } = await supabase.from('profiles').insert([
        {
            user_id: userId,
            onboarding_step: 'interests',
            onboarding_complete: false,
            interests: [],
            sub_interests: [],
            dealbreakers: []
        }
    ]).select().single().abortSignal(AbortSignal.timeout(10000)) // 10 second timeout
    ;
    if (error) throw error;
    return data;
};
const getProfile = async (userId)=>{
    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single().abortSignal(AbortSignal.timeout(5000)) // 5 second timeout
    ;
    if (error) throw error;
    return data;
};
const updateProfile = async (userId, updates)=>{
    const { data, error } = await supabase.from('profiles').update(updates).eq('user_id', userId).select().single().abortSignal(AbortSignal.timeout(5000));
    if (error) throw error;
    return data;
};
const getInterests = async ()=>{
    const { data, error } = await supabase.from('v_interests').select('*').order('name', {
        ascending: true
    }).limit(50) // Reasonable limit
    .abortSignal(AbortSignal.timeout(3000));
    if (error) throw error;
    return data || [];
};
const getSubInterests = async (parentIds)=>{
    let query = supabase.from('v_sub_interests').select('*').order('name', {
        ascending: true
    }).limit(100) // Reasonable limit
    ;
    if (parentIds && parentIds.length > 0) {
        query = query.in('parent_id', parentIds);
    }
    const { data, error } = await query.abortSignal(AbortSignal.timeout(3000));
    if (error) throw error;
    return data || [];
};
const saveUserSelections = async (userId, selections)=>{
    // First, clear existing selections
    await supabase.from('user_taxonomies').delete().eq('user_id', userId);
    // Then insert new selections
    if (selections.length > 0) {
        const { error } = await supabase.from('user_taxonomies').insert(selections.map((selection)=>({
                user_id: userId,
                taxonomy_id: selection.id,
                type: selection.type
            })));
        if (error) throw error;
    }
};
}),
"[project]/src/app/hooks/useBusinessNotifications.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBusinessNotifications",
    ()=>useBusinessNotifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/contexts/ToastContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function useBusinessNotifications() {
    const { showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const subscriptionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastNotificationTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Don't subscribe if not in browser
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        // Throttle notifications to prevent spam (min 5 seconds between notifications)
        const THROTTLE_MS = undefined;
        const handleNewBusiness = undefined;
        // Subscribe to new inserts in the businesses table
        const channel = undefined;
    }, [
        showToast
    ]);
}
}),
"[project]/src/app/components/Notifications/BusinessNotifications.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BusinessNotifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useBusinessNotifications$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/hooks/useBusinessNotifications.ts [app-ssr] (ecmascript)");
"use client";
;
function BusinessNotifications() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useBusinessNotifications$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBusinessNotifications"])();
    // This component doesn't render anything - it just sets up the subscription
    return null;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8eda76b9._.js.map