/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { 
  Search, AlertCircle, CheckCircle, ChevronRight, ChevronLeft,
  LayoutDashboard, Menu, X, PlusCircle, Clock, Camera, FileText, Upload, Mail,
  QrCode, Shield, ShieldCheck, ShieldAlert, AlertTriangle, Smartphone, XCircle,
  Timer, PauseCircle, ImagePlus, PlayCircle, LogOut, ArrowRight, Globe,
  Briefcase, RefreshCcw, HandCoins, Cpu, Award, Zap
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { 
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, signOut, signInAnonymously, signInWithCustomToken,
  GoogleAuthProvider, FacebookAuthProvider, signInWithPopup
} from 'firebase/auth';
import { 
  getFirestore, collection, addDoc, updateDoc, doc, onSnapshot 
} from 'firebase/firestore';

// ==========================================
// FIREBASE INITIALIZATION & CONFIGURATION
// ==========================================
const userFirebaseConfig = {
  apiKey: "AIzaSyBvvH0iqqzzm23gDy-1RpBWcHhtgisRhKw",
  authDomain: "luxyry-bags-israel.firebaseapp.com",
  projectId: "luxyry-bags-israel",
  storageBucket: "luxyry-bags-israel.firebasestorage.app",
  messagingSenderId: "894217543775",
  appId: "1:894217543775:web:fdafaf8b261cbf07a8fbea",
  measurementId: "G-VTFX8ZBH7E"
};

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : userFirebaseConfig;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'luxury-bags-israel-prod';

let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.error("Firebase init failed", e);
}

// ==========================================
// DICTIONARY & I18N (TRANSLATIONS)
// ==========================================
const translations = {
  he: {
    nav_login: "התחברות", nav_start: "התחילו אימות", hero_title: "אפס פשרות.<br />אפס זיופים.",
    hero_subtitle_il: "הסטנדרט החדש של האימות בישראל.<br />טכנולוגיית AI בשירות מומחים אנושיים.",
    hero_subtitle_global: "הסטנדרט החדש של האימות בעולם.<br />טכנולוגיית AI בשירות מומחים אנושיים.",
    cta_primary: "אמתו את הפריט שלכם", cta_secondary: "איך זה עובד?", trusted_by: "אנו מאמתים את מותגי העל המובילים",
    why_us: "למה לבחור בנו?", why_1_title: "שילוב של AI ומומחים", why_1_desc: "החלטה סופית ע\"י מומחה אנושי.",
    why_2_title: "אחריות ואמינות", why_2_desc: "מוכר ע\"י פלטפורמות כמו PayPal ו-eBay.", why_3_title: "מהירות חסרת תקדים",
    why_3_desc: "תעודה דיגיטלית תוך שעות ספורות.", how_title: "איך זה עובד?", how_1_title: "1. צלמו והעלו",
    how_1_desc: "העלו תמונות לפי ההנחיות.", how_2_title: "2. ניתוח מעמיק", how_2_desc: "סריקה ובדיקה קפדנית.",
    how_3_title: "3. קבלת תעודה", how_3_desc: "תעודה רשמית אותה תוכלו לשתף.", welcome: "ברוכים הבאים",
    welcome_sub: "התחברו כדי לעקוב אחר הבקשות.", signup_title: "יצירת חשבון", signup_sub: "הצטרפו והתחילו לאמת.",
    continue_google: "המשך עם Google", continue_fb: "המשך עם Facebook", continue_ig: "המשך עם Instagram",
    no_account: "אין חשבון?", have_account: "כבר יש חשבון?", signup_free: "הירשמו בחינם", login_here: "התחברו כאן",
    full_name: "שם מלא", email: "כתובת אימייל", password: "סיסמה", btn_login: "התחבר", btn_signup: "צור חשבון",
    client_portal: "אזור לקוחות", my_checks: "הבדיקות שלי", new_request: "בקשה חדשה", hello: "שלום",
    welcome_dash: "ברוך הבא למערכת האימות.", history: "היסטוריית בדיקות", brand: "מותג", item_type: "סוג הפריט",
    model: "דגם", model_placeholder: "לדוגמה: Neverfull", optional: "רשות", select_brand: "בחרו מותג...",
    select_type: "בחרו סוג...", step_1: "שלב 1 מתוך 3", step_2: "שלב 2 מתוך 3", step_3: "שלב 3 מתוך 3",
    continue_photos: "להעלאת תמונות", back: "חזור", continue_track: "לבחירת מסלול", track_title: "בחירת מסלול",
    track_sub: "בחרו את מהירות הטיפול.", track_reg: "בדיקה רגילה", track_fast: "בדיקה מהירה", track_exp: "אקספרס",
    hours_12: "12 שעות", hours_6: "6 שעות", hours_2: "שעתיים", recommended: "מומלץ", coupon_label: "קוד קופון",
    coupon_placeholder: "הזינו קוד", apply: "הפעל", send_payment: "שלם באמצעות PayPal", send_free: "שלח בחינם",
    authentic: "מקורי", fake: "מזויף", pending_expert: "בבדיקה...", need_photos: "נדרשות תמונות",
    business_pkg: "חבילות לעסקים", pkg_title: "חבילות אימות לעסקים", pkg_sub: "חסכו עד 20%.",
    contact_sales: "צרו קשר להזמנה", success_title: "התשלום בוצע בהצלחה! 🎉",
    success_sub: "הבקשה הועברה לבדיקה. שלחנו לך מייל אישור.", btn_home: "מסך ראשי", btn_another: "אימות נוסף"
  },
  en: {
    nav_login: "Login", nav_start: "Start Authentication", hero_title: "ZERO COMPROMISE.<br />ZERO FAKES.",
    hero_subtitle_il: "The new global standard in luxury authentication.", hero_subtitle_global: "The new global standard in luxury authentication.",
    cta_primary: "Verify Your Item", cta_secondary: "How it works?", trusted_by: "Authenticating prestigious brands",
    why_us: "Why Choose Us?", why_1_title: "AI + Experts", why_1_desc: "Final verdict by a human expert.",
    why_2_title: "Guaranteed", why_2_desc: "Recognized by PayPal and eBay.", why_3_title: "Speed",
    why_3_desc: "Digital certificate in hours.", how_title: "How It Works?", how_1_title: "1. Upload",
    how_1_desc: "Upload photos.", how_2_title: "2. Analysis", how_2_desc: "Rigorous inspection.",
    how_3_title: "3. Certificate", how_3_desc: "Receive official certificate.", welcome: "Welcome Back",
    welcome_sub: "Log in to track requests.", signup_title: "Create Account", signup_sub: "Start authenticating.",
    continue_google: "Continue with Google", continue_fb: "Continue with Facebook", continue_ig: "Continue with Instagram",
    no_account: "No account?", have_account: "Have an account?", signup_free: "Sign up free", login_here: "Log in here",
    full_name: "Full Name", email: "Email", password: "Password", btn_login: "Log In", btn_signup: "Create Account",
    client_portal: "Client Portal", my_checks: "My Authentications", new_request: "New Request", hello: "Hello",
    welcome_dash: "Welcome to the system.", history: "History", brand: "Brand", item_type: "Item Type",
    model: "Model", model_placeholder: "e.g., Neverfull", optional: "Optional", select_brand: "Select brand...",
    select_type: "Select type...", step_1: "Step 1 of 3", step_2: "Step 2 of 3", step_3: "Step 3 of 3",
    continue_photos: "Continue to Photos", back: "Back", continue_track: "Continue to Track", track_title: "Select Track",
    track_sub: "Choose turnaround time.", track_reg: "Standard", track_fast: "Fast Track", track_exp: "Express",
    hours_12: "12 Hours", hours_6: "6 Hours", hours_2: "2 Hours", recommended: "Recommended", coupon_label: "Coupon Code",
    coupon_placeholder: "Enter code", apply: "Apply", send_payment: "Pay with PayPal", send_free: "Submit Free",
    authentic: "Authentic", fake: "Counterfeit", pending_expert: "Under Review...", need_photos: "Photos Needed",
    business_pkg: "Business Packages", pkg_title: "Business Packages", pkg_sub: "Save up to 20%.",
    contact_sales: "Contact Sales", success_title: "Payment Successful! 🎉",
    success_sub: "Item is under review. Confirmation email sent.", btn_home: "Dashboard", btn_another: "Authenticate Another"
  }
};

// ==========================================
// CUSTOM VECTOR GRAPHICS (LOGOS & ICONS)
// ==========================================
function BrandLogo({ className = "w-16 h-16", hideIsrael = false }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="100" fill="#1c1c1c" />
      <path d="M55 70 L75 120 L125 120 L145 70 Z" fill="none" stroke="#d4af37" strokeWidth="4" strokeLinejoin="round" />
      <rect x="75" y="70" width="50" height="50" fill="none" stroke="#d4af37" strokeWidth="4" />
      <path d="M85 70 C85 45, 115 45, 115 70" fill="none" stroke="#d4af37" strokeWidth="4" />
      <text x="100" y={hideIsrael ? "158" : "150"} fill="#ffffff" fontSize="18" fontFamily="sans-serif" fontWeight="600" textAnchor="middle" letterSpacing="2">LUXURY BAGS</text>
      {!hideIsrael && <text x="100" y="167" fill="#d4af37" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="4">ISRAEL</text>}
      <text x="100" y="184" fill="#64748b" fontSize="8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="1">EST. 2016</text>
    </svg>
  );
}

function CertificateStamp() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <div className="absolute inset-0 border-4 border-slate-200 rounded-full animate-[spin_20s_linear_infinite] opacity-50" style={{ borderStyle: 'double' }}></div>
      <div className="absolute inset-2 border border-slate-300 rounded-full"></div>
      <div className="text-center">
        <p className="text-[8px] font-black tracking-widest text-slate-400 uppercase">Certified By</p>
        <p className="text-[12px] font-serif font-black text-[#1c1c1c] tracking-wider mt-1">LBI</p>
        <p className="text-[6px] font-bold text-[#d4af37] tracking-[0.2em] mt-1 uppercase">Est. 2016</p>
      </div>
    </div>
  );
}

function FacebookIcon({ className = "w-5 h-5" }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
}

function InstagramIcon({ className = "w-5 h-5" }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
}

function GoogleIcon({ className = "w-5 h-5" }) {
  return <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>;
}

function BagPartIcon({ type, className = "w-8 h-8" }) {
  const baseClasses = `text-teal-600 ${className}`;
  switch(type) {
    case 'front': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={baseClasses}><path d="M3 8h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" /><path d="M3 8l9 6 9-6" /><circle cx="12" cy="14" r="1.5" fill="currentColor" /><path d="M6 8V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" strokeDasharray="1 1" /><path d="M3 13.5l4-2.5m-4 5.5l9-5.5M7.5 19l4.5-3m0-8L21 13.5m-9-5.5L21 19m-4.5 2l4.5-3" opacity="0.3" /></svg>;
    case 'inside': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={baseClasses}><path d="M4 6h16l-2 14H6L4 6z" /><path d="M4 6c0 2 16 2 16 0" opacity="0.5"/><rect x="9" y="10" width="6" height="5" rx="1" strokeDasharray="1 1" /></svg>;
    case 'base': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={baseClasses}><path d="M4 8l16-4v12l-16 4V8z" /><circle cx="7" cy="10" r="1" fill="currentColor" /><circle cx="17" cy="7.5" r="1" fill="currentColor" /><circle cx="7" cy="16.5" r="1" fill="currentColor" /><circle cx="17" cy="14" r="1" fill="currentColor" /></svg>;
    case 'zipper': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={baseClasses}><path d="M12 2v6" /><rect x="10" y="8" width="4" height="6" rx="1" /><circle cx="12" cy="16" r="1" /><path d="M10 18h4M9 20h6M10 22h4" opacity="0.6"/> </svg>;
    case 'buckle-front': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={baseClasses}><rect x="6" y="8" width="12" height="8" rx="2" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><path d="M12 12v3" /></svg>;
    case 'buckle-back': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={baseClasses}><path d="M8 14v-4a4 4 0 0 1 8 0v4" /><rect x="6" y="14" width="12" height="4" rx="1" /></svg>;
    case 'metal-stamp': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={baseClasses}><rect x="3" y="8" width="18" height="8" rx="1" /><circle cx="5.5" cy="12" r="0.5" fill="currentColor" /><circle cx="18.5" cy="12" r="0.5" fill="currentColor" /><path d="M9 14V10h2M12 10l1.5 4L15 10" opacity="0.6" strokeWidth="1" /></svg>;
    case 'date-code': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={baseClasses}><path d="M7 4h10l3 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8l3-4z" /><path d="M8 12h8M8 16h5" strokeDasharray="2 2" opacity="0.5" /></svg>;
    default: return <UploadCloud className={baseClasses} />;
  }
}

const LUXURY_BRANDS = ["Louis Vuitton", "Chanel", "Hermes", "Dior", "Gucci", "Prada", "Saint Laurent", "Celine", "Fendi", "Balenciaga", "Rolex", "Cartier"];
const ITEM_TYPES = ["Bag/תיק", "Clothing/בגד", "Shoes/נעליים", "Accessories/אקססוריז", "Watch/שעון"];
const BAG_PARTS = [
  { id: 'front', iconType: 'front' }, { id: 'inside', iconType: 'inside' },
  { id: 'base', iconType: 'base' }, { id: 'date-code', iconType: 'date-code' },
  { id: 'zipper', iconType: 'zipper' }, { id: 'buckle-front', iconType: 'buckle-front' },
  { id: 'buckle-back', iconType: 'buckle-back' }, { id: 'metal-stamp', iconType: 'metal-stamp' }
];

function GlobalStyles() {
  return <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;600;700;800;900&display=swap'); * { font-family: 'Assistant', system-ui, sans-serif !important; }`}} />;
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [user, setUser] = useState(null); 
  const [role, setRole] = useState('client'); 
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [systemRequests, setSystemRequests] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [geo, setGeo] = useState({ country: 'IL', currency: 'ILS', symbol: '₪' });
  const [lang, setLang] = useState('he');
  
  const t = (key) => translations[lang]?.[key] || translations['en'][key] || key;
  const isRtl = lang === 'he' || lang === 'ar';
  const hideIsrael = geo.country !== 'IL'; 

  const handleLogout = () => { if(auth) signOut(auth); setUser(null); };

  useEffect(() => {
    let sessionTimer;
    if (user) {
      sessionTimer = setTimeout(() => {
        handleLogout();
        setShowLoginModal(true);
        alert(isRtl ? 'פג תוקף החיבור (שעתיים). אנא התחברו מחדש.' : 'Session expired. Please log in again.');
      }, 7200000); 
    }
    return () => clearTimeout(sessionTimer);
  }, [user, isRtl]);

  useEffect(() => {
    if (!auth) return;
    const initCanvasAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else if (process.env.NODE_ENV === 'development') {
          await signInAnonymously(auth);
        }
      } catch(e) { console.warn("Auth Failed", e); }
    };
    initCanvasAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setRole(currentUser.email && currentUser.email.includes('admin') ? 'admin' : 'client');
        setShowLoginModal(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const requestsRef = collection(db, 'artifacts', appId, 'public', 'data', 'auth_requests');
    const unsubscribe = onSnapshot(requestsRef, (snapshot) => {
      const allReqs = snapshot.docs.map(document => ({ firestoreId: document.id, ...document.data() }));
      allReqs.sort((a, b) => b.createdAt - a.createdAt);
      setSystemRequests(role === 'admin' ? allReqs : allReqs.filter(req => req.clientId === user.uid));
    }, (error) => console.error("Firestore Listen Error:", error));
    return () => unsubscribe();
  }, [user, role]);

  const addRequest = async (newReqData) => { 
    if (!user || !db) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'auth_requests'), { 
      ...newReqData, clientId: user.uid, clientEmail: user.email || 'Anonymous', createdAt: Date.now() 
    });
    setCurrentView('dashboard'); 
  };
  
  const updateRequest = async (firestoreId, updates) => {
    if (!user || !db) return;
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'auth_requests', firestoreId), updates);
  };

  if (!user && !showLoginModal) {
    return <><GlobalStyles /><LandingPage t={t} geo={geo} isRtl={isRtl} lang={lang} setLang={setLang} onGoToLogin={() => setShowLoginModal(true)} setGeo={setGeo} hideIsrael={hideIsrael} /></>;
  }

  if (!user && showLoginModal) {
    return <><GlobalStyles /><div dir={isRtl ? "rtl" : "ltr"} className="relative"><LoginScreen onBack={() => setShowLoginModal(false)} t={t} isRtl={isRtl} lang={lang} setLang={setLang} hideIsrael={hideIsrael} /></div></>;
  }

  return (
    <>
      <GlobalStyles />
      <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
        {isMobileMenuOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />}
        <Sidebar t={t} currentView={currentView} setCurrentView={(v) => { setCurrentView(v); setIsMobileMenuOpen(false); }} role={role} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} onLogout={handleLogout} hideIsrael={hideIsrael} />
        <main className="flex-1 flex flex-col h-screen w-full overflow-hidden">
          <Header toggleMenu={() => setIsMobileMenuOpen(true)} role={role} t={t} />
          <div className="flex-1 overflow-y-auto flex flex-col p-4 md:p-8">
            {role === 'admin' ? (
              <AuthenticationTool requests={systemRequests} updateRequest={updateRequest} hideIsrael={hideIsrael} />
            ) : currentView === 'new-request' ? (
              <NewAuthenticationRequest t={t} geo={geo} isRtl={isRtl} addRequest={addRequest} setView={setCurrentView} />
            ) : currentView === 'business-pkgs' ? (
              <BusinessPackages t={t} geo={geo} isRtl={isRtl} setView={setCurrentView} />
            ) : currentView === 'certificate-view' ? (
              <DigitalCertificate data={selectedCertificate} onBack={() => setCurrentView('dashboard')} isClientView={true} t={t} isRtl={isRtl} hideIsrael={hideIsrael} />
            ) : (
              <ClientDashboard t={t} requests={systemRequests} setView={setCurrentView} onSelectCert={(req) => { setSelectedCertificate(req); setCurrentView('certificate-view'); }} />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

// ==========================================
// MARKETING LANDING PAGE
// ==========================================
function LandingPage({ t, geo, isRtl, lang, setLang, onGoToLogin, setGeo, hideIsrael }) {
  const [showDev, setShowDev] = useState(false);
  useEffect(() => { if (window.location.search.includes('dev=true')) setShowDev(true); }, []);

  const applyGeoSettings = (region) => {
    if (region === 'IL') { setGeo({ country: 'IL', currency: 'ILS', symbol: '₪' }); setLang('he'); }
    else if (region === 'US') { setGeo({ country: 'US', currency: 'USD', symbol: '$' }); setLang('en'); }
    else if (region === 'AE') { setGeo({ country: 'AE', currency: 'AED', symbol: 'د.إ' }); setLang('ar'); }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col" dir={isRtl ? "rtl" : "ltr"}>
      {showDev && (
        <div className="fixed bottom-4 left-4 bg-white p-2 rounded-xl shadow-2xl border border-slate-200 z-50 text-xs flex gap-2 font-sans" dir="ltr">
           <Globe size={16} className="text-slate-400"/>
           <button onClick={() => applyGeoSettings('IL')} className="hover:text-teal-600 font-bold">IL</button>|
           <button onClick={() => applyGeoSettings('US')} className="hover:text-teal-600 font-bold">US</button>|
           <button onClick={() => applyGeoSettings('AE')} className="hover:text-teal-600 font-bold">AE</button>
        </div>
      )}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3"><BrandLogo className="w-12 h-12" hideIsrael={hideIsrael} /></div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900"><Globe size={14} /> {lang === 'he' ? 'EN' : 'HE'}</button>
            <button onClick={onGoToLogin} className="text-sm font-bold text-slate-600 hover:text-teal-700 transition-colors">{t('nav_login')}</button>
            <button onClick={onGoToLogin} className="bg-[#1c1c1c] text-[#d4af37] px-5 py-2.5 rounded-full text-sm font-bold hover:bg-black shadow-lg">{t('nav_start')}</button>
          </div>
        </div>
      </nav>
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-900 overflow-hidden flex-1 flex flex-col justify-center">
        <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=2000&q=80')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/80 to-slate-900/95 mix-blend-multiply"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter drop-shadow-xl" dangerouslySetInnerHTML={{ __html: t('hero_title') }}></h1>
          <p className="text-lg md:text-xl text-teal-100 max-w-2xl mx-auto font-light leading-relaxed mb-10" dangerouslySetInnerHTML={{ __html: hideIsrael ? t('hero_subtitle_global') : t('hero_subtitle_il') }}></p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onGoToLogin} className="w-full sm:w-auto bg-[#d4af37] hover:bg-[#c4a130] text-[#1c1c1c] font-black px-8 py-4 rounded-full shadow-xl text-lg flex items-center justify-center gap-2"><Shield size={24} /> {t('cta_primary')}</button>
            <a href="#how-it-works" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm font-bold px-8 py-4 rounded-full text-lg">{t('cta_secondary')}</a>
          </div>
        </div>
      </section>
      <section className="bg-white border-b border-slate-100 py-6 overflow-hidden">
        <p className="text-center text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">{t('trusted_by')}</p>
        <div className="flex justify-center flex-wrap gap-8 md:gap-16 opacity-60 grayscale">
           <span className="font-serif font-bold text-xl">LOUIS VUITTON</span><span className="font-serif font-bold text-xl">CHANEL</span>
           <span className="font-serif font-bold text-xl">HERMÈS</span><span className="font-serif font-bold text-xl">DIOR</span>
           <span className="font-serif font-bold text-xl">GUCCI</span><span className="font-serif font-bold text-xl">PRADA</span>
        </div>
      </section>
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16"><h2 className="text-3xl font-black text-slate-900 mb-4">{t('why_us')}</h2><div className="w-24 h-1 bg-teal-600 mx-auto rounded-full"></div></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"><div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6"><Cpu size={28} /></div><h3 className="text-xl font-bold text-slate-800 mb-3">{t('why_1_title')}</h3><p className="text-slate-600 leading-relaxed">{t('why_1_desc')}</p></div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"><div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6"><Award size={28} /></div><h3 className="text-xl font-bold text-slate-800 mb-3">{t('why_2_title')}</h3><p className="text-slate-600 leading-relaxed">{t('why_2_desc')}</p></div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"><div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6"><Zap size={28} /></div><h3 className="text-xl font-bold text-slate-800 mb-3">{t('why_3_title')}</h3><p className="text-slate-600 leading-relaxed">{t('why_3_desc')}</p></div>
          </div>
        </div>
      </section>
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16"><h2 className="text-3xl font-black text-slate-900 mb-4">{t('how_title')}</h2><div className="w-24 h-1 bg-teal-600 mx-auto rounded-full"></div></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-100 -z-10"></div>
             <div className="text-center relative z-10"><div className="w-24 h-24 mx-auto bg-slate-900 text-white rounded-full flex items-center justify-center mb-6 shadow-xl"><Camera size={32} /></div><h3 className="text-xl font-bold text-slate-800 mb-3">{t('how_1_title')}</h3><p className="text-slate-600">{t('how_1_desc')}</p></div>
             <div className="text-center relative z-10"><div className="w-24 h-24 mx-auto bg-slate-900 text-white rounded-full flex items-center justify-center mb-6 shadow-xl"><Search size={32} /></div><h3 className="text-xl font-bold text-slate-800 mb-3">{t('how_2_title')}</h3><p className="text-slate-600">{t('how_2_desc')}</p></div>
             <div className="text-center relative z-10"><div className="w-24 h-24 mx-auto bg-[#d4af37] text-[#1c1c1c] rounded-full flex items-center justify-center mb-6 shadow-xl"><FileText size={32} /></div><h3 className="text-xl font-bold text-slate-800 mb-3">{t('how_3_title')}</h3><p className="text-slate-600">{t('how_3_desc')}</p></div>
          </div>
          <div className="mt-16 text-center"><button onClick={onGoToLogin} className="bg-teal-800 hover:bg-teal-900 text-white font-bold px-10 py-4 rounded-full shadow-lg text-lg">{t('nav_start')} <ArrowRight size={20} className={`inline ${isRtl ? 'rotate-180 mr-2' : 'ml-2'}`} /></button></div>
        </div>
      </section>
      <footer className="bg-[#1c1c1c] text-slate-400 py-10 text-center text-sm"><BrandLogo className="w-16 h-16 mx-auto mb-4 opacity-50 grayscale" hideIsrael={hideIsrael} /><p>&copy; {new Date().getFullYear()} LUXURY BAGS{hideIsrael ? '' : ' ISRAEL'}. All rights reserved.</p></footer>
    </div>
  );
}

// ==========================================
// LOGIN SCREEN
// ==========================================
function LoginScreen({ onBack, t, isRtl, lang, setLang, hideIsrael }) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!auth) { alert("Firebase is not connected."); return; }
    setErrorMsg(''); setIsLoading(true);
    try {
      if (isSignUp && !showAdminLogin) await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      let msg = isRtl ? "שגיאה בפרטי ההתחברות. נסה שנית." : "Invalid credentials. Please try again.";
      if (err.code === 'auth/email-already-in-use') msg = isRtl ? "האימייל הזה כבר רשום במערכת, נסה להתחבר." : "Email already in use, please log in.";
      if (err.code === 'auth/weak-password') msg = isRtl ? "הסיסמה חלשה מדי (נדרשים לפחות 6 תווים)." : "Password is too weak (min 6 chars).";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') msg = isRtl ? "אימייל או סיסמה שגויים." : "Invalid email or password.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    if (!auth) { alert("Firebase is not connected."); return; }
    setErrorMsg(''); setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg(isRtl ? "ההתחברות בוטלה על ידי המשתמש." : "Login cancelled.");
      } else {
        setErrorMsg(isRtl ? "שגיאה בהתחברות. ודא שהפעלת אפשרות זו ב-Firebase Console." : "Login failed. Make sure provider is enabled in Firebase Console.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white relative overflow-x-hidden">
      <div className={`absolute top-6 ${isRtl ? 'right-6' : 'left-6'} z-50`}>
         <button onClick={onBack} className="flex items-center gap-1 text-slate-500 hover:text-slate-900 font-bold text-sm bg-white/80 px-3 py-1.5 rounded-full shadow-sm"><ChevronLeft size={16} className={isRtl ? 'rotate-180' : ''} /> חזרה לאתר</button>
      </div>
      <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} z-50`}>
        <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-slate-200 md:border-white/30 text-slate-800 md:text-white px-4 py-2 rounded-full font-bold text-xs shadow-sm hover:bg-white/30"><Globe size={14} /> {lang === 'he' ? 'EN' : 'עברית'}</button>
      </div>
      <div className="hidden md:flex md:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden pt-12">
        <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=1200&q=80')" }}></div>
        <div className="absolute inset-0 bg-teal-950/70 mix-blend-multiply"></div>
        <div className="relative z-10 flex flex-col items-center text-center p-12 animate-in fade-in duration-1000">
          <BrandLogo className="w-40 h-40 mb-8 drop-shadow-2xl" hideIsrael={hideIsrael} />
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-4 leading-tight tracking-tighter drop-shadow-lg" dangerouslySetInnerHTML={{ __html: t('hero_title') }}></h1>
          <p className="text-teal-100 text-lg max-w-md font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: hideIsrael ? t('hero_subtitle_global') : t('hero_subtitle_il') }}></p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-24 bg-white relative">
        <div className="md:hidden flex flex-col items-center mb-10 mt-12">
          <BrandLogo className="w-24 h-24 mb-4" hideIsrael={hideIsrael} />
          <h1 className="text-3xl font-black text-slate-900 text-center tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: t('hero_title') }}></h1>
        </div>
        <div className="w-full max-w-sm mx-auto animate-in slide-in-from-bottom-8 fade-in duration-700">
          {!showAdminLogin ? (
            <>
              <div className="mb-8"><h2 className="text-2xl font-bold text-slate-900 mb-2">{isSignUp ? t('signup_title') : t('welcome')}</h2><p className="text-slate-500 text-sm">{isSignUp ? t('signup_sub') : t('welcome_sub')}</p></div>
              <div className="space-y-3 mb-4">
                <button type="button" onClick={() => handleSocialLogin(new GoogleAuthProvider())} className="w-full bg-white border border-slate-200 text-slate-700 font-medium py-3 px-4 rounded-xl shadow-sm hover:bg-slate-50 flex items-center justify-center gap-3"><GoogleIcon className="w-5 h-5" /> {t('continue_google')}</button>
                <button type="button" onClick={() => handleSocialLogin(new FacebookAuthProvider())} className="w-full bg-[#1877F2] text-white font-medium py-3 px-4 rounded-xl shadow-sm hover:bg-[#1864D9] flex items-center justify-center gap-3 transition-colors"><FacebookIcon className="w-5 h-5" /> {t('continue_fb')}</button>
              </div>
              <div className="text-center mb-6">
                <span className="text-sm text-slate-500">{isSignUp ? t('have_account') : t('no_account')} </span>
                <button onClick={() => setIsSignUp(!isSignUp)} className={`text-sm text-teal-700 font-bold hover:underline ${isRtl ? 'mr-1.5' : 'ml-1.5'}`}>{isSignUp ? t('login_here') : t('signup_free')}</button>
              </div>
              <div className="relative flex items-center py-2 mb-6"><div className="flex-grow border-t border-slate-200"></div><span className="flex-shrink-0 mx-4 text-slate-400 text-sm">{t('or_email')}</span><div className="flex-grow border-t border-slate-200"></div></div>
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isSignUp && <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4" placeholder={t('full_name')} />}
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4" placeholder={t('email')} required />
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4" placeholder={t('password')} required minLength="6" />
                {errorMsg && <p className="text-red-500 text-xs font-bold">{errorMsg}</p>}
                <button type="submit" disabled={isLoading} className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-3.5 rounded-xl shadow-md mt-2 disabled:opacity-50">{isLoading ? "..." : (isSignUp ? t('btn_signup') : t('btn_login'))}</button>
              </form>
            </>
          ) : (
            <div className="animate-in fade-in zoom-in-95">
              <div className="mb-8"><h2 className="text-2xl font-bold text-slate-900 mb-2">Admin / Team Access</h2><p className="text-slate-500 text-sm">Secured AI & Backoffice Gateway</p></div>
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4" placeholder="Admin Email" required />
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4" placeholder="Password" required />
                {errorMsg && <p className="text-red-500 text-xs font-bold">{errorMsg}</p>}
                <button type="submit" disabled={isLoading} className="w-full bg-[#1c1c1c] text-[#d4af37] font-bold py-3.5 rounded-xl mt-2 hover:bg-black transition-colors disabled:opacity-50">{isLoading ? "..." : "Login to System"}</button>
              </form>
            </div>
          )}
        </div>
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <button onClick={() => setShowAdminLogin(!showAdminLogin)} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">{showAdminLogin ? "Back to Client Login" : "Admin / Team Login"}</button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SHARED UI COMPONENTS
// ==========================================
function Sidebar({ t, currentView, setCurrentView, role, isOpen, onClose, onLogout, hideIsrael }) {
  const adminMenu = [{ id: 'auth-tool', label: 'תור משימות לבדיקה', icon: <Search size={20} /> }];
  const clientMenu = [{ id: 'dashboard', label: t('my_checks'), icon: <LayoutDashboard size={20} /> }, { id: 'new-request', label: t('new_request'), icon: <PlusCircle size={20} /> }];
  const menuItems = role === 'admin' ? adminMenu : clientMenu;
  return (
    <aside className={`fixed md:static inset-y-0 ${t('hello') === 'שלום' ? 'right-0' : 'left-0'} w-72 md:w-64 bg-[#1c1c1c] text-slate-300 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : (t('hello') === 'שלום' ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0')}`}>
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-black/20">
        <div className="flex items-center gap-3"><BrandLogo className="w-10 h-10" hideIsrael={hideIsrael} /><div><p className="text-[10px] tracking-[0.2em] text-[#d4af37] uppercase font-bold">{role === 'admin' ? 'Agent Network' : 'Client Portal'}</p></div></div>
        <button onClick={onClose} className="md:hidden p-2"><X size={24} /></button>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map(item => (
          <button key={item.id} onClick={() => setCurrentView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${currentView === item.id ? 'bg-teal-800/40 border border-teal-700/50 text-teal-400 shadow-sm' : 'hover:bg-white/5 hover:text-white'}`}>{item.icon} <span className="font-medium text-sm">{item.label}</span></button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800 bg-black/20"><div className="flex items-center justify-between"><button onClick={onLogout} className="text-slate-500 hover:text-red-400 p-2 transition-colors"><LogOut size={18} className={t('hello')==='שלום' ? 'transform rotate-180' : ''} /></button></div></div>
    </aside>
  );
}

function Header({ toggleMenu, role, t }) {
  return (
    <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-3"><button onClick={toggleMenu} className="md:hidden text-slate-600 p-1 rounded-lg"><Menu size={24} /></button><h1 className="text-lg font-bold text-slate-800 hidden md:block">{role === 'admin' ? 'System Admin / AI Core' : t('client_portal')}</h1></div>
    </header>
  );
}

// ==========================================
// CLIENT DASHBOARD
// ==========================================
function ClientDashboard({ t, requests, setView, onSelectCert }) {
  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-4xl animate-in fade-in duration-500">
      <div className="bg-teal-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl font-bold mb-1">{t('hello')}! 👋</h2><p className="text-teal-100 text-sm mb-6 opacity-90">{t('welcome_dash')}</p>
          <button onClick={() => setView('new-request')} className="bg-[#d4af37] text-[#1c1c1c] font-bold px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 text-sm w-full md:w-auto justify-center hover:bg-[#c4a130] transition-colors"><PlusCircle size={18} /> {t('new_request')}</button>
        </div>
      </div>
      <div>
        <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2"><Clock size={18} className="text-teal-700" /> {t('history')}</h3>
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.firestoreId || req.id} onClick={() => req.status === 'completed' && onSelectCert(req)} className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 ${req.status === 'completed' ? 'cursor-pointer hover:shadow-md active:scale-[0.99] border-green-200' : 'opacity-90'}`}>
              <img src={req.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=200&q=80'} alt={req.brand} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1"><h4 className="font-bold text-slate-800 text-sm truncate">{req.brand}</h4><span className="text-[10px] text-slate-400">{req.date}</span></div>
                <p className="text-xs text-slate-500 truncate mb-2">{req.model} • {req.id}</p>
                {req.status === 'completed' ? (<span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border ${req.result === 'authentic' ? 'bg-green-50 text-green-700 border-green-100' : req.result === 'refunded' ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-red-50 text-red-700 border-red-100'}`}>{req.result === 'authentic' ? <><CheckCircle size={12} /> {t('authentic')}</> : req.result === 'refunded' ? <><X size={12}/> בוטל</> : <><XCircle size={12} /> {t('fake')}</>}</span>) : req.status === 'waiting_for_customer' ? (<span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-[10px] font-bold border border-amber-100"><AlertCircle size={12} /> {t('need_photos')}</span>) : (<span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold border border-slate-200"><Clock size={12} /> {t('pending_expert')}</span>)}
              </div>
              <ChevronRight size={20} className={`text-slate-300 ${t('hello') === 'שלום' ? '' : 'transform rotate-180'}`} />
            </div>
          ))}
          {requests.length === 0 && <p className="text-center text-slate-500 text-sm py-10">No requests yet.</p>}
        </div>
      </div>
    </div>
  );
}

function NewAuthenticationRequest({ t, geo, isRtl, addRequest, setView }) {
  const [step, setStep] = useState(1);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [brand, setBrand] = useState('');
  const [itemType, setItemType] = useState('');
  const [model, setModel] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [paymentTrack, setPaymentTrack] = useState('regular');
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  
  useEffect(() => {
    const scriptId = 'paypal-sdk-script';
    if (document.getElementById(scriptId)) { setPaypalLoaded(true); return; }
    const script = document.createElement('script'); script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=Abl9tf9osl-4AxIDVVUNAGaWU3O-AaZiSexD6BGVw7VmLpb5ecU25xRWcEwR0JHT_nU10LbKcegIn3zE&currency=${geo.currency === 'ILS' ? 'ILS' : 'USD'}`;
    script.async = true; script.onload = () => setPaypalLoaded(true); document.body.appendChild(script);
  }, [geo.currency]);

  const handleApplyCoupon = () => {
    if (['LUXBAGFREE', 'LUXBAGCHECK'].includes(couponCode.trim().toUpperCase())) {
      setCouponMessage({ type: 'success', text: isRtl ? 'קופון אומת בהצלחה!' : 'Coupon applied successfully!' }); setIsDiscountApplied(true);
    } else { setCouponMessage({ type: 'error', text: isRtl ? 'קוד שגוי' : 'Invalid code' }); setIsDiscountApplied(false); }
  };

  const handleUploadClick = () => { setIsCompressing(true); setTimeout(() => setIsCompressing(false), 1200); };

  useEffect(() => {
    if (paypalLoaded && window.paypal && !isDiscountApplied && step === 3 && !showSuccess) {
       const container = document.getElementById('paypal-button-container');
       if (container) {
         container.innerHTML = ''; 
         const amountToCharge = paymentTrack === 'express' ? (geo.currency === 'ILS' ? 149 : 49) : paymentTrack === 'fast' ? (geo.currency === 'ILS' ? 129 : 39) : (geo.currency === 'ILS' ? 99 : 29);
         window.paypal.Buttons({
           createOrder: (d, actions) => actions.order.create({ purchase_units: [{ amount: { value: amountToCharge.toString() } }] }),
           onApprove: (d, actions) => actions.order.capture().then(() => {
                addRequest({ id: `REQ-${Math.floor(1000+Math.random()*9000)}`, brand, model: model || 'N/A', date: new Date().toLocaleDateString('en-GB'), status: 'pending', paymentTrack, image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=200&q=80' });
                setShowSuccess(true);
             }),
           onError: (err) => { console.error("PayPal Error:", err); alert("PayPal Error: Please try again."); }
         }).render('#paypal-button-container');
       }
    }
  }, [paypalLoaded, isDiscountApplied, step, paymentTrack, showSuccess, geo.currency, addRequest, brand, model]);

  const handlePaymentSuccessFree = () => {
    const newReqId = `REQ-${Math.floor(1000+Math.random()*9000)}`;
    addRequest({ id: newReqId, brand, model: model || 'N/A', date: new Date().toLocaleDateString('en-GB'), status: 'pending', paymentTrack, image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=200&q=80' });
    setShowSuccess(true);
  };

  const handleReset = () => { setBrand(''); setItemType(''); setModel(''); setCouponCode(''); setIsDiscountApplied(false); setPaymentTrack('regular'); setShowSuccess(false); setStep(1); };

  if (showSuccess) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in zoom-in-95 text-center p-10">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-12 h-12 text-green-500" /></div>
        <h2 className="text-2xl font-black text-slate-800 mb-3">{t('success_title')}</h2><p className="text-slate-600 mb-8">{t('success_sub')}</p>
        <div className="space-y-3"><button onClick={() => setView('dashboard')} className="w-full bg-[#1c1c1c] text-[#d4af37] font-bold py-4 rounded-xl">{t('btn_home')}</button><button onClick={handleReset} className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold py-4 rounded-xl">{t('btn_another')} <PlusCircle size={18} className="inline ml-1" /></button></div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto md:max-w-3xl bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in pb-6">
      <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between mb-2">
        <h2 className="font-bold text-slate-800">{t('new_request')}</h2><span className="text-xs font-medium text-teal-800 bg-teal-100 px-2 py-1 rounded-full">{step === 1 ? t('step_1') : step === 2 ? t('step_2') : t('step_3')}</span>
      </div>
      <div className="p-5 md:p-8">
        {step === 1 ? (
          <div className="space-y-5">
             <div><label className="block text-sm font-medium text-slate-700 mb-2">{t('brand')} *</label><select value={brand} onChange={e => setBrand(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-teal-700"><option value="">{t('select_brand')}</option>{LUXURY_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
             <div><label className="block text-sm font-medium text-slate-700 mb-2">{t('item_type')} *</label><select value={itemType} onChange={e => setItemType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-teal-700"><option value="">{t('select_type')}</option>{ITEM_TYPES.map(type => <option key={type} value={type}>{type.split('/')[isRtl ? 1 : 0]}</option>)}</select></div>
             {brand && itemType && (<div><label className="block text-sm font-medium text-slate-700 mb-2">{t('model')} ({t('optional')})</label><input type="text" value={model} onChange={e => setModel(e.target.value)} placeholder={t('model_placeholder')} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-3 px-4 outline-none focus:border-teal-700" /></div>)}
             <button onClick={() => setStep(2)} disabled={!brand || !itemType} className="w-full mt-6 bg-teal-800 hover:bg-teal-900 text-white font-bold py-3.5 rounded-xl disabled:opacity-50">{t('continue_photos')}</button>
          </div>
        ) : step === 2 ? (
          <div className="space-y-6">
            {isCompressing && (<div className="bg-blue-50 border border-blue-100 text-blue-800 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-pulse"><RefreshCcw size={14} className="animate-spin" /> {isRtl ? 'מכווץ תמונות...' : 'Compressing...'}</div>)}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {BAG_PARTS.map(part => (<div key={part.id} onClick={handleUploadClick} className="border-2 border-dashed border-slate-200 rounded-xl p-3 flex flex-col items-center text-center bg-slate-50 hover:border-teal-300 cursor-pointer"><BagPartIcon type={part.iconType} className="w-10 h-10 mb-2" /><span className="text-xs font-bold text-slate-700 mb-1">{part.id}</span></div>))}
            </div>
            <div className="pt-6 flex gap-3"><button onClick={() => setStep(1)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl">{t('back')}</button><button onClick={() => setStep(3)} className="flex-[2] bg-teal-800 hover:bg-teal-900 text-white font-bold py-3.5 rounded-xl">{t('continue_track')}</button></div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in">
            <div className="mb-2"><h3 className="text-lg font-bold text-slate-800">{t('track_title')}</h3><p className="text-sm text-slate-500">{t('track_sub')}</p></div>
            <div className="space-y-4">
              <TrackOption id="regular" title={t('track_reg')} hours={t('hours_12')} price={geo.currency === 'ILS' ? 99 : 29} geo={geo} current={paymentTrack} onSelect={setPaymentTrack} />
              <TrackOption id="fast" title={t('track_fast')} hours={t('hours_6')} price={geo.currency === 'ILS' ? 129 : 39} geo={geo} current={paymentTrack} onSelect={setPaymentTrack} highlight="text-orange-500" />
              <TrackOption id="express" title={t('track_exp')} hours={t('hours_2')} price={geo.currency === 'ILS' ? 149 : 49} geo={geo} current={paymentTrack} onSelect={setPaymentTrack} tag={t('recommended')} highlight="text-red-500" />
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-sm border border-slate-100 mt-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('coupon_label')}</label>
              <div className="flex gap-2"><input type="text" value={couponCode} onChange={e => { setCouponCode(e.target.value); setCouponMessage(null); }} placeholder={t('coupon_placeholder')} className="flex-1 bg-white border border-slate-200 rounded-lg py-2.5 px-3 uppercase text-sm outline-none focus:border-teal-600" disabled={isDiscountApplied} /><button onClick={handleApplyCoupon} disabled={!couponCode || isDiscountApplied} className="bg-slate-800 text-white font-bold py-2.5 px-5 rounded-lg disabled:opacity-50 hover:bg-slate-900">{t('apply')}</button></div>
              {couponMessage && <p className={`mt-2 text-xs font-bold ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{couponMessage.text}</p>}
            </div>
            <div className="pt-6 flex flex-col gap-3 border-t border-slate-100 mt-6">
              <button onClick={() => setStep(2)} className="w-full bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl">{t('back')}</button>
              {isDiscountApplied ? (
                <button onClick={handlePaymentSuccessFree} className="w-full bg-teal-800 text-white font-bold py-3.5 rounded-xl hover:bg-teal-900 transition-colors">{t('send_free')}</button>
              ) : (<div className="relative z-0 min-h-[150px]">{!paypalLoaded && <div className="flex justify-center p-8"><RefreshCcw className="animate-spin text-slate-400" /></div>}<div id="paypal-button-container" className="w-full"></div></div>)}
              <button onClick={() => setView('business-pkgs')} className="text-sm font-bold text-teal-700 hover:underline mt-2 flex justify-center items-center gap-2"><Briefcase size={16} /> {t('business_pkg')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TrackOption({ id, title, hours, price, geo, current, onSelect, tag, highlight = "text-slate-500" }) {
  const isSelected = current === id;
  return (
    <div onClick={() => onSelect(id)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-white hover:border-teal-300'}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3"><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-teal-600' : 'border-slate-300'}`}>{isSelected && <div className="w-2.5 h-2.5 rounded-full bg-teal-600"></div>}</div>
          <div><span className="font-bold text-slate-800 flex items-center gap-2">{title} {tag && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full uppercase">{tag}</span>}</span><span className={`text-sm flex items-center gap-1 mt-1 ${highlight}`}><Clock size={14} /> {hours}</span></div>
        </div>
        <span className="font-black text-xl text-teal-800" dir="ltr">{geo.symbol}{price}</span>
      </div>
    </div>
  );
}

function BusinessPackages({ t, geo, isRtl, setView }) {
  const packages = [
    { title: 'Bronze', checks: 10, free: 2, discount: '15%', price: geo.currency === 'ILS' ? 850 : 250 },
    { title: 'Silver', checks: 50, free: 10, discount: '17%', price: geo.currency === 'ILS' ? 4150 : 1200 },
    { title: 'Gold', checks: 100, free: 25, discount: '20%', price: geo.currency === 'ILS' ? 7900 : 2300 }
  ];
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <button onClick={() => setView('new-request')} className="text-slate-500 font-medium flex items-center gap-1 mb-2 hover:text-slate-800"><ChevronLeft size={18} className={isRtl ? 'rotate-180' : ''}/> {t('back')}</button>
      <div className="text-center mb-10"><Briefcase className="w-16 h-16 mx-auto text-teal-700 mb-4" /><h2 className="text-3xl font-black text-slate-800 mb-2">{t('pkg_title')}</h2><p className="text-slate-500 max-w-lg mx-auto">{t('pkg_sub')}</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col"><div className="absolute top-4 right-4 bg-teal-100 text-teal-800 text-xs font-black px-2 py-1 rounded">- {pkg.discount}</div><h3 className="text-xl font-bold text-slate-800 mb-1">{pkg.title} Pack</h3><p className="text-slate-500 text-sm mb-6">{pkg.checks} Authentications + {pkg.free} Free</p><div className="text-3xl font-black text-teal-800 mb-6" dir="ltr">{geo.symbol}{pkg.price}</div><button className="mt-auto w-full bg-[#1c1c1c] hover:bg-black text-[#d4af37] font-bold py-3 rounded-xl">{t('contact_sales')}</button></div>
        ))}
      </div>
    </div>
  );
}

function DigitalCertificate({ data, onBack, isClientView, t, isRtl, hideIsrael }) {
  if(!data) return null;
  const isAuthentic = data.result === 'authentic';
  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-12 animate-in zoom-in-95">
      <button onClick={onBack} className="text-slate-500 font-medium flex items-center gap-1 mb-2"><ChevronLeft size={18} className={isRtl ? 'rotate-180' : ''}/> {t('back')}</button>
      <div className="bg-white border-[12px] border-[#1c1c1c] p-2 shadow-2xl relative">
        <div className="border-[3px] border-[#d4af37] p-8 md:p-12 relative flex flex-col items-center text-center overflow-hidden">
          <BrandLogo className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-5 pointer-events-none" />
          <div className="mb-8 relative z-10"><BrandLogo className="w-24 h-24 mx-auto mb-4" hideIsrael={hideIsrael} /><h1 className="text-2xl md:text-4xl font-serif tracking-widest text-[#1c1c1c] uppercase mb-2">Certificate of Authentication</h1><p className="text-[#d4af37] font-bold tracking-[0.3em] text-sm uppercase">Luxury Bags Israel</p></div>
          <div className={`w-full py-4 mb-8 border-y-2 relative z-10 ${isAuthentic ? 'border-green-200 bg-green-50/80 text-green-800' : 'border-red-200 bg-red-50/80 text-red-800'}`}><h2 className="text-xl md:text-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3">{isAuthentic ? <><ShieldCheck size={32} /> Authentic</> : <><ShieldAlert size={32} /> Counterfeit</>}</h2></div>
          <div className="w-full max-w-lg mb-10 relative z-10">
            <div className="grid grid-cols-2 gap-y-4 text-left border-b border-slate-200 pb-4 mb-4" dir="ltr"><div className="text-slate-500 text-sm uppercase tracking-wider">Brand</div><div className="font-bold text-slate-800">{data.brand}</div><div className="text-slate-500 text-sm uppercase tracking-wider">Model</div><div className="font-bold text-slate-800">{data.model}</div><div className="text-slate-500 text-sm uppercase tracking-wider">Date Inspected</div><div className="font-bold text-slate-800">{data.date}</div></div>
            <p className="text-xs text-slate-500 italic text-center">This item has been rigorously inspected by our experts combining decades of human experience and advanced AI protocols.</p>
          </div>
          <div className="w-full flex justify-between items-end relative z-10 mt-auto pt-8">
            <div className="text-left" dir="ltr"><CertificateStamp /></div>
            <div className="flex flex-col items-center"><div className="bg-white p-2 border border-slate-200 rounded-lg shadow-sm mb-2"><QrCode size={64} className="text-slate-800" /></div><p className="text-[8px] text-slate-400 uppercase tracking-widest">Scan to Verify</p><p className="text-[10px] font-bold text-slate-800 mt-1">ID: {data.id}</p></div>
          </div>
        </div>
      </div>
      {!isClientView && (<div className="flex justify-end pt-4"><button className="bg-[#1c1c1c] text-[#d4af37] px-6 py-3 rounded-xl font-bold flex items-center gap-2">הדפס / יצא ל-PDF</button></div>)}
      {isClientView && isAuthentic && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm mt-6 text-center animate-in fade-in slide-in-from-bottom-4">
          <h3 className="font-bold text-slate-800 text-lg mb-2">איזה יופי, הפריט מקורי! 🎉</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
             <button className="flex items-center justify-center gap-2 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium py-3 px-6 rounded-xl"><InstagramIcon size={18}/> שתפו בסטורי באינסטגרם</button>
             <button className="flex items-center justify-center gap-2 bg-[#1877F2] text-white font-medium py-3 px-6 rounded-xl"><FacebookIcon size={18} fill="currentColor" stroke="none" /> שתפו בפייסבוק</button>
             <button className="flex items-center justify-center gap-2 bg-slate-900 text-white font-medium py-3 px-6 rounded-xl"><Upload size={18} /> העתק קישור לתעודה</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AuthenticationTool({ requests, updateRequest, hideIsrael }) {
  const [selectedReqId, setSelectedReqId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [finalVerdict, setFinalVerdict] = useState(null); 
  const [timeLeft, setTimeLeft] = useState(7200); 
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedParts, setSelectedParts] = useState([]);
  const [customMessage, setCustomMessage] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const activeReq = requests.find(r => r.id === selectedReqId || r.firestoreId === selectedReqId);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    else if (!isTimerRunning && timeLeft !== 0) clearInterval(interval);
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (sec) => `${Math.floor(sec / 3600).toString().padStart(2, '0')}:${Math.floor((sec % 3600) / 60).toString().padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`;

  const startReviewing = (req) => { setSelectedReqId(req.firestoreId || req.id); setTimeLeft(req.paymentTrack === 'express' ? 7200 : req.paymentTrack === 'fast' ? 21600 : 43200); if(req.status !== 'waiting_for_customer') setIsTimerRunning(true); };
  const simulateAIAnalysis = () => { setIsAnalyzing(true); setTimeout(() => { setIsAnalyzing(false); updateRequest(activeReq.firestoreId || activeReq.id, { status: 'reviewing', aiDraftResponse: `מנוע ה-AI מזהה פונט לא תקני בחותמת התאריך. נדרשת החלטת מומחה סופית.`, confidence: 88 }); }, 2000); };
  const handleIssueCertificate = (verdict) => { setIsTimerRunning(false); setFinalVerdict(verdict); setShowNotificationModal(true); updateRequest(activeReq.firestoreId || activeReq.id, { status: 'completed', result: verdict }); };
  const handleCancelAndRefund = () => { setIsTimerRunning(false); setShowCancelModal(false); alert(`שולח זיכוי והודעה: "${cancelReason}"`); updateRequest(activeReq.firestoreId || activeReq.id, { status: 'completed', result: 'refunded' }); setSelectedReqId(null); };
  const sendPhotoRequest = () => { if (!selectedParts.length && !customMessage.trim()) return; setIsTimerRunning(false); updateRequest(activeReq.firestoreId || activeReq.id, { status: 'waiting_for_customer' }); };
  const simulateCustomerUpload = () => { setSelectedParts([]); setCustomMessage(''); setIsTimerRunning(true); updateRequest(activeReq.firestoreId || activeReq.id, { status: 'reviewing' }); };
  
  const simulateCronJob = (type) => {
    if(type === '48h') alert('סימולציה: מייל תזכורת 48 שעות נשלח בהצלחה ללקוח.');
    if(type === '10d') {
      alert('סימולציה: בקשה נסגרה אוטומטית עקב חוסר מענה 10 ימים (Time Out).');
      updateRequest(activeReq.firestoreId || activeReq.id, { status: 'completed', result: 'refunded' });
      setSelectedReqId(null);
    }
  };

  const togglePartSelection = (id) => setSelectedParts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);

  if (!activeReq) {
    const pendingRequests = requests.filter(r => r.status !== 'completed');
    return (
      <div className="max-w-6xl mx-auto animate-in fade-in" dir="rtl">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-6">
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm col-span-2 md:col-span-1"><h3 className="text-slate-500 text-xs md:text-sm font-medium mb-1">בקשות ממתינות לבדיקה</h3><p className="text-2xl md:text-3xl font-bold text-slate-800">{pendingRequests.length}</p></div>
          <div className="bg-teal-900 p-4 md:p-6 rounded-2xl shadow-md text-white col-span-2 md:col-span-2 relative overflow-hidden"><div className="relative z-10"><h3 className="text-teal-100 text-xs md:text-sm font-medium mb-1">סטטוס מנוע AI Core</h3><p className="text-xl md:text-2xl font-bold flex items-center gap-2">מערכת יציבה ופעילה</p></div><BrandLogo className="absolute top-0 left-0 w-48 h-48 opacity-10 transform -translate-x-1/4 -translate-y-1/4" hideIsrael={hideIsrael} /></div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">תור משימות לבדיקה</h2>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {pendingRequests.length === 0 ? (<p className="p-8 text-center text-slate-500">אין בקשות פתוחות. הכל נבדק!</p>) : (
            <div className="divide-y divide-slate-100">
              {pendingRequests.map(req => (
                <div key={req.firestoreId || req.id} onClick={() => startReviewing(req)} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer group">
                  <div className="flex items-center gap-4"><img src={req.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=200&q=80'} alt={req.brand} className="w-12 h-12 rounded object-cover border border-slate-200" /><div><h4 className="font-bold text-slate-800 text-sm">{req.brand} <span className="text-xs text-slate-500 font-normal">{req.model}</span></h4><p className="text-xs text-slate-500">{req.id} • <span className="font-bold">{req.paymentTrack}</span></p></div></div>
                  <div className="flex items-center gap-3"><span className={`text-[10px] px-2 py-1 rounded-full font-bold ${req.status === 'waiting_for_customer' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{req.status === 'waiting_for_customer' ? 'ממתין לתמונות' : 'ממתין ל-AI'}</span><button className="text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100">פתח תיק <ArrowRight size={14} className="inline ml-1"/></button></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-6 animate-in fade-in duration-500" dir="rtl">
      <button onClick={() => setSelectedReqId(null)} className="text-slate-500 font-medium hover:text-slate-800 flex items-center gap-1 mb-2"><ChevronRight size={18} /> חזור לתור המשימות</button>
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4"><img src={activeReq.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=200&q=80'} className="w-16 h-16 rounded-xl border border-slate-200 object-cover" /><div><h2 className="font-bold text-slate-800 text-lg">בקשה {activeReq.id}</h2><p className="text-sm text-slate-500">{activeReq.brand} • מסלול: <span className="font-bold text-red-500">{activeReq.paymentTrack}</span></p></div></div>
        <div className={`flex items-center gap-3 px-5 py-3 rounded-xl font-mono text-2xl font-bold border-2 shadow-inner ${activeReq.status === 'waiting_for_customer' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-900 text-teal-400 border-slate-800'}`}><span dir="ltr">{formatTime(timeLeft)}</span>{activeReq.status === 'waiting_for_customer' ? <PauseCircle size={24} /> : <Timer size={24} className="animate-pulse" />}</div>
      </div>

      {activeReq.status === 'pending' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm"><h2 className="text-xl font-bold text-slate-800 mb-2">שלב 1: סריקת AI</h2><button onClick={simulateAIAnalysis} disabled={isAnalyzing} className="px-6 py-3.5 bg-teal-800 text-white rounded-xl font-bold flex gap-2">{isAnalyzing ? 'מנתח...' : 'הפעל סריקה'}</button></div>
      )}

      {(activeReq.status === 'reviewing' || activeReq.status === 'waiting_for_customer') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-[#1c1c1c] p-4 text-white flex justify-between items-center"><h3 className="font-bold flex items-center gap-2 text-sm text-[#d4af37]"><CheckCircle size={18} className="mr-1" /> ממצאי סריקת ה-AI</h3><span className="bg-white/10 px-3 py-1 rounded-full text-xs">ודאות: {activeReq.confidence}%</span></div>
              <div className="p-5 md:p-6 space-y-6">
                <div><h4 className="text-xs font-bold text-slate-400 uppercase mb-2">המלצת המערכת</h4><div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm whitespace-pre-wrap">{activeReq.aiDraftResponse}</div></div>
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="font-black text-slate-800 mb-4 text-lg">החלטת מומחה סופית</h4>
                  <div className="flex gap-3 mb-4"><button onClick={() => handleIssueCertificate('authentic')} disabled={activeReq.status === 'waiting_for_customer'} className="flex-1 py-4 bg-green-50 text-green-800 font-bold rounded-xl disabled:opacity-50"><ShieldCheck className="inline mr-2"/>אשר כמקורי</button><button onClick={() => handleIssueCertificate('fake')} disabled={activeReq.status === 'waiting_for_customer'} className="flex-1 py-4 bg-red-50 text-red-800 font-bold rounded-xl disabled:opacity-50"><ShieldAlert className="inline mr-2"/>פסול כמזויף</button></div>
                  <div className="flex gap-4 border-t border-slate-100 pt-4 mt-2"><button onClick={() => setShowCancelModal(true)} className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline">לא ניתן לאימות? בטל וזכה לקוח</button></div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-slate-50 p-4 border-b border-slate-100"><h3 className="font-bold text-slate-800 flex items-center gap-2"><ImagePlus size={18} className="text-teal-600" /> ניהול תמונות מול לקוח</h3></div>
              <div className="p-5">
                {activeReq.status === 'reviewing' && !selectedParts.length && !customMessage && (
                  <div className="text-center"><div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-500"><Camera size={28} /></div><h4 className="font-bold text-slate-800 mb-2">תמונות חסרות?</h4><button onClick={() => setCustomMessage(' ')} className="w-full py-3 bg-amber-100 text-amber-800 font-bold rounded-xl text-sm">פתח בקשת השלמה</button></div>
                )}
                {activeReq.status === 'reviewing' && customMessage !== '' && (
                  <div className="animate-in slide-in-from-right-4 duration-300">
                    <p className="text-xs font-bold text-slate-600 mb-3">סמן איזה אזור הלקוח נדרש לצלם שוב:</p>
                    <div className="grid grid-cols-4 gap-2 mb-4">{BAG_PARTS.map(part => (<div key={part.id} onClick={() => togglePartSelection(part.id)} className={`aspect-square rounded-lg border-2 flex items-center justify-center cursor-pointer ${selectedParts.includes(part.id) ? 'border-teal-500 bg-teal-50 text-teal-600' : 'border-slate-200 text-slate-400'}`}><BagPartIcon type={part.iconType} className="w-6 h-6" /></div>))}</div>
                    <textarea placeholder="הערה ללקוח..." value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs mb-3"></textarea>
                    <div className="flex gap-2"><button onClick={() => setCustomMessage('')} className="flex-1 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-lg">ביטול</button><button onClick={sendPhotoRequest} disabled={selectedParts.length === 0} className="flex-[2] py-2 bg-teal-800 text-white font-bold text-xs rounded-lg disabled:opacity-50">שלח ללקוח והקפא זמן</button></div>
                  </div>
                )}
                {activeReq.status === 'waiting_for_customer' && (
                  <div className="text-center"><div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-500 animate-pulse"><Clock size={28} /></div><h4 className="font-bold text-amber-600 mb-2">ממתין לתמונות מהלקוח</h4><div className="border-t border-slate-100 pt-4 mt-4"><button onClick={simulateCustomerUpload} className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl text-sm flex justify-center items-center gap-2"><PlayCircle size={16} /> הלקוח העלה תמונות</button></div></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2"><HandCoins size={20} className="text-slate-500"/> זיכוי לקוח</h3>
            <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder="הזן סיבה להחזר..." className="w-full h-24 border border-slate-200 rounded-lg p-3 text-sm mb-4"></textarea>
            <div className="flex gap-3"><button onClick={()=>setShowCancelModal(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg">חזור</button><button onClick={handleCancelAndRefund} disabled={!cancelReason} className="flex-1 py-2 bg-slate-900 text-white font-bold rounded-lg disabled:opacity-50">בצע זיכוי</button></div>
          </div>
        </div>
      )}
      {showNotificationModal && <ClientNotificationModal verdict={finalVerdict} reqId={activeReq.id} onClose={() => { setShowNotificationModal(false); setSelectedReqId(null); }} hideIsrael={hideIsrael} />}
    </div>
  );
}

function ClientNotificationModal({ verdict, reqId, onClose, hideIsrael }) {
  const isAuthentic = verdict === 'authentic';
  const themeClasses = isAuthentic ? 'from-green-500 to-emerald-600 bg-green-50 border-green-200 text-green-900' : 'from-slate-600 to-red-800 bg-red-50 border-red-200 text-red-900';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className={`bg-gradient-to-r ${themeClasses.split(' ').slice(0, 2).join(' ')} p-4 text-white flex justify-between items-center`}>
          <div className="flex items-center gap-2 font-bold"><Smartphone size={20} /> סימולציית הודעה ללקוח</div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-6 bg-slate-100 flex justify-center">
          <div className="bg-white w-full rounded-[2rem] border-8 border-slate-800 h-[450px] overflow-y-auto shadow-inner relative flex flex-col">
            <div className="bg-slate-800 text-white text-[10px] py-1 px-4 flex justify-between rounded-t-xl" dir="ltr"><span>09:41</span><span>100% 🔋</span></div>
            <div className="p-4 flex-1">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 border-b border-slate-100 pb-2"><Mail size={14} /> Inbox</div>
              <div className={`rounded-xl border ${isAuthentic ? 'bg-green-50 border-green-100' : 'bg-rose-50 border-rose-100'} p-5 text-center`}>
                <BrandLogo className="w-12 h-12 mx-auto mb-4 drop-shadow-md" hideIsrael={hideIsrael} />
                <h3 className={`text-lg font-black mb-2 ${isAuthentic ? 'text-green-800' : 'text-slate-800'}`}>{isAuthentic ? 'חדשות מצוינות, הפריט אושר!' : 'עדכון לגבי אימות הפריט'}</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">בדיקת הבקשה {reqId} הסתיימה.<br/><br/>{isAuthentic ? 'לאחר בחינה קפדנית, אנו שמחים לאשר כי הפריט הינו מקורי לחלוטין (Authentic).' : 'זיהינו אי-התאמות בסטנדרט הייצור. הפריט נפסל כמזויף.'}</p>
                <button onClick={onClose} className={`w-full py-3 rounded-xl font-bold text-white shadow-md flex justify-center items-center gap-2 ${isAuthentic ? 'bg-green-600' : 'bg-slate-800'}`}><FileText size={16} /> סגור</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
