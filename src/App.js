import React, { useState, useEffect } from 'react';
import { 
  Search, UploadCloud, AlertCircle, CheckCircle, ChevronRight, ChevronLeft,
  LayoutDashboard, Menu, X, PlusCircle, Clock, Camera, FileText, Upload, Mail,
  QrCode, ShieldCheck, ShieldAlert, Smartphone, XCircle,
  Timer, PauseCircle, ImagePlus, PlayCircle, LogOut, ArrowRight, Globe,
  Briefcase, RefreshCcw, HandCoins, Cpu, Award, Zap
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { 
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, signOut, signInAnonymously, signInWithCustomToken
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
    nav_login: "התחברות",
    nav_start: "התחילו אימות",
    hero_title: "אפס פשרות.<br />אפס זיופים.",
    hero_subtitle_il: "הסטנדרט החדש של האימות בישראל.<br />טכנולוגיית AI בשירות מומחים אנושיים.",
    hero_subtitle_global: "הסטנדרט החדש של האימות בעולם.<br />טכנולוגיית AI בשירות מומחים אנושיים.",
    cta_primary: "אמתו את הפריט שלכם",
    cta_secondary: "איך זה עובד?",
    trusted_by: "אנו מאמתים את מותגי העל המובילים",
    why_us: "למה לבחור בנו?",
    why_1_title: "שילוב של AI ומומחים",
    why_1_desc: "החלטה סופית ע\"י מומחה אנושי.",
    why_2_title: "אחריות ואמינות",
    why_2_desc: "מוכר ע\"י פלטפורמות כמו PayPal ו-eBay.",
    why_3_title: "מהירות חסרת תקדים",
    why_3_desc: "תעודה דיגיטלית תוך שעות ספורות.",
    how_title: "איך זה עובד?",
    how_1_title: "1. צלמו והעלו",
    how_1_desc: "העלו תמונות לפי ההנחיות.",
    how_2_title: "2. ניתוח מעמיק",
    how_2_desc: "סריקה ובדיקה קפדנית.",
    how_3_title: "3. קבלת תעודה",
    how_3_desc: "תעודה רשמית אותה תוכלו לשתף.",
    welcome: "ברוכים הבאים",
    welcome_sub: "התחברו כדי לעקוב אחר הבקשות.",
    signup_title: "יצירת חשבון",
    signup_sub: "הצטרפו והתחילו לאמת.",
    continue_google: "המשך עם Google",
    continue_fb: "המשך עם Facebook",
    continue_ig: "המשך עם Instagram",
    no_account: "אין חשבון?",
    have_account: "כבר יש חשבון?",
    signup_free: "הירשמו בחינם",
    login_here: "התחברו כאן",
    full_name: "שם מלא",
    email: "כתובת אימייל",
    password: "סיסמה",
    btn_login: "התחבר",
    btn_signup: "צור חשבון",
    client_portal: "אזור לקוחות",
    my_checks: "הבדיקות שלי",
    new_request: "בקשה חדשה",
    hello: "שלום",
    welcome_dash: "ברוך הבא למערכת האימות.",
    history: "היסטוריית בדיקות",
    brand: "מותג",
    item_type: "סוג הפריט",
    model: "דגם",
    model_placeholder: "לדוגמה: Neverfull, Air Jordan 1",
    optional: "רשות",
    select_brand: "בחרו מותג...",
    select_type: "בחרו סוג...",
    step_1: "שלב 1 מתוך 3",
    step_2: "שלב 2 מתוך 3",
    step_3: "שלב 3 מתוך 3",
    continue_photos: "להעלאת תמונות",
    back: "חזור",
    continue_track: "לבחירת מסלול",
    track_title: "בחירת מסלול",
    track_sub: "בחרו את מהירות הטיפול.",
    track_reg: "בדיקה רגילה",
    track_fast: "בדיקה מהירה",
    track_exp: "אקספרס",
    hours_12: "12 שעות",
    hours_6: "6 שעות",
    hours_2: "שעתיים",
    recommended: "מומלץ",
    coupon_label: "קוד קופון",
    coupon_placeholder: "הזינו קוד",
    apply: "הפעל",
    send_payment: "שלם באמצעות PayPal",
    send_free: "שלח בחינם",
    authentic: "מקורי",
    fake: "מזויף",
    pending_expert: "בבדיקה...",
    need_photos: "נדרשות תמונות",
    business_pkg: "חבילות לעסקים",
    pkg_title: "חבילות אימות לעסקים",
    pkg_sub: "חסכו עד 20%.",
    contact_sales: "צרו קשר להזמנה",
    success_title: "התשלום בוצע בהצלחה! 🎉",
    success_sub: "הבקשה הועברה לבדיקה. שלחנו לך מייל אישור.",
    btn_home: "מסך ראשי",
    btn_another: "אימות נוסף"
  },
  en: {
    nav_login: "Login",
    nav_start: "Start Authentication",
    hero_title: "ZERO COMPROMISE.<br />ZERO FAKES.",
    hero_subtitle_il: "The new global standard in luxury authentication.",
    hero_subtitle_global: "The new global standard in luxury authentication.",
    cta_primary: "Verify Your Item",
    cta_secondary: "How it works?",
    trusted_by: "Authenticating prestigious brands",
    why_us: "Why Choose Us?",
    why_1_title: "AI + Experts",
    why_1_desc: "Final verdict by a human expert.",
    why_2_title: "Guaranteed",
    why_2_desc: "Recognized by PayPal and eBay.",
    why_3_title: "Speed",
    why_3_desc: "Digital certificate in hours.",
    how_title: "How It Works?",
    how_1_title: "1. Upload",
    how_1_desc: "Upload photos.",
    how_2_title: "2. Analysis",
    how_2_desc: "Rigorous inspection.",
    how_3_title: "3. Certificate",
    how_3_desc: "Receive official certificate.",
    welcome: "Welcome Back",
    welcome_sub: "Log in to track requests.",
    signup_title: "Create Account",
    signup_sub: "Start authenticating.",
    continue_google: "Continue with Google",
    continue_fb: "Continue with Facebook",
    continue_ig: "Continue with Instagram",
    no_account: "No account?",
    have_account: "Have an account?",
    signup_free: "Sign up free",
    login_here: "Log in here",
    full_name: "Full Name",
    email: "Email",
    password: "Password",
    btn_login: "Log In",
    btn_signup: "Create Account",
    client_portal: "Client Portal",
    my_checks: "My Authentications",
    new_request: "New Request",
    hello: "Hello",
    welcome_dash: "Welcome to the system.",
    history: "History",
    brand: "Brand",
    item_type: "Item Type",
    model: "Model",
    model_placeholder: "e.g., Neverfull",
    optional: "Optional",
    select_brand: "Select brand...",
    select_type: "Select type...",
    step_1: "Step 1 of 3",
    step_2: "Step 2 of 3",
    step_3: "Step 3 of 3",
    continue_photos: "Continue to Photos",
    back: "Back",
    continue_track: "Continue to Track",
    track_title: "Select Track",
    track_sub: "Choose turnaround time.",
    track_reg: "Standard",
    track_fast: "Fast Track",
    track_exp: "Express",
    hours_12: "12 Hours",
    hours_6: "6 Hours",
    hours_2: "2 Hours",
    recommended: "Recommended",
    coupon_label: "Coupon Code",
    coupon_placeholder: "Enter code",
    apply: "Apply",
    send_payment: "Pay with PayPal",
    send_free: "Submit Free",
    authentic: "Authentic",
    fake: "Counterfeit",
    pending_expert: "Under Review...",
    need_photos: "Photos Needed",
    business_pkg: "Business Packages",
    pkg_title: "Business Packages",
    pkg_sub: "Save up to 20%.",
    contact_sales: "Contact Sales",
    success_title: "Payment Successful! 🎉",
    success_sub: "Item is under review. Confirmation email sent.",
    btn_home: "Dashboard",
    btn_another: "Authenticate Another"
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

function FacebookIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );
}

function InstagramIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function GoogleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function BagPartIcon({ type, className = "w-8 h-8" }) {
  const baseClasses = `text-teal-600 ${className}`;
  switch(type) {
    case 'front': 
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={baseClasses}><path d="M3 8h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" /><path d="M3 8l9 6 9-6" /><circle cx="12" cy="14" r="1.5" fill="currentColor" /><path d="M6 8V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" strokeDasharray="1 1" /><path d="M3 13.5l4-2.5m-4 5.5l9-5.5M7.5 19l4.5-3m0-8L21 13.5m-9-5.5L21 19m-4.5 2l4.5-3" opacity="0.3" /></svg>;
    case 'inside': 
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={baseClasses}><path d="M4 6h16l-2 14H6L4 6z" /><path d="M4 6c0 2 16 2 16 0" opacity="0.5"/><rect x="9" y="10" width="6" height="5" rx="1" strokeDasharray="1 1" /></svg>;
    case 'base': 
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={baseClasses}><path d="M4 8l16-4v12l-16 4V8z" /><circle cx="7" cy="10" r="1" fill="currentColor" /><circle cx="17" cy="7.5" r="1" fill="currentColor" /><circle cx="7" cy="16.5" r="1" fill="currentColor" /><circle cx="17" cy="14" r="1" fill="currentColor" /></svg>;
    case 'zipper': 
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={baseClasses}><path d="M12 2v6" /><rect x="10" y="8" width="4" height="6" rx="1" /><circle cx="12" cy="16" r="1" /><path d="M10 18h4M9 20h6M10 22h4" opacity="0.6"/> </svg>;
    case 'buckle-front': 
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={baseClasses}><rect x="6" y="8" width="12" height="8" rx="2" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><path d="M12 12v3" /></svg>;
    case 'buckle-back': 
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={baseClasses}><path d="M8 14v-4a4 4 0 0 1 8 0v4" /><rect x="6" y="14" width="12" height="4" rx="1" /></svg>;
    case 'metal-stamp': 
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={baseClasses}><rect x="3" y="8" width="18" height="8" rx="1" /><circle cx="5.5" cy="12" r="0.5" fill="currentColor" /><circle cx="18.5" cy="12" r="0.5" fill="currentColor" /><path d="M9 14V10h2M12 10l1.5 4L15 10" opacity="0.6" strokeWidth="1" /></svg>;
    case 'date-code': 
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={baseClasses}><path d="M7 4h10l3 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8l3-4z" /><path d="M8 12h8M8 16h5" strokeDasharray="2 2" opacity="0.5" /></svg>;
    default: 
      return <UploadCloud className={baseClasses} />;
  }
}

// ==========================================
// SMART DATA & CONSTANTS
// ==========================================
const LUXURY_BRANDS = [
  "Louis Vuitton", "Chanel", "Hermes", "Dior", "Gucci", 
  "Prada", "Saint Laurent", "Celine", "Fendi", "Balenciaga", "Rolex", "Cartier"
];

const ITEM_TYPES = [
  "Bag/תיק", "Clothing/בגד", "Shoes/נעליים", "Accessories/אקססוריז", "Watch/שעון"
];

const BAG_PARTS = [
  { id: 'front', iconType: 'front' }, 
  { id: 'inside', iconType: 'inside' },
  { id: 'base', iconType: 'base' }, 
  { id: 'date-code', iconType: 'date-code' },
  { id: 'zipper', iconType: 'zipper' }, 
  { id: 'buckle-front', iconType: 'buckle-front' },
  { id: 'buckle-back', iconType: 'buckle-back' }, 
  { id: 'metal-stamp', iconType: 'metal-stamp' }
];

// ==========================================
// GLOBAL TYPOGRAPHY (PREMIUM FONT)
// ==========================================
function GlobalStyles() {
  return (
    <style dangerouslySetInnerHTML={{__html: `
      @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;600;700;800;900&display=swap');
      * { font-family: 'Assistant', system-ui, sans-serif !important; }
    `}} />
  );
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

  useEffect(() => {
    let sessionTimer;
    if (user) {
      sessionTimer = setTimeout(() => {
        if(auth) signOut(auth);
        setUser(null);
        setShowLoginModal(true);
        alert(isRtl ? 'פג תוקף החיבור (שעתיים). אנא התחברו מחדש.' : 'Session expired. Please log in again.');
      }, 7200000); 
    }
    return () => clearTimeout(sessionTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      } catch(e) { 
        console.warn("Custom Auth Failed", e); 
      }
    };
    initCanvasAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (currentUser.email && currentUser.email.includes('admin')) {
          setRole('admin');
        } else {
          setRole('client');
        }
        setShowLoginModal(false);
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    
    const requestsRef = collection(db, 'artifacts', appId, 'public', 'data', 'auth_requests');
    const unsubscribe = onSnapshot(requestsRef, (snapshot) => {
      const allReqs = snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
      allReqs.sort((a, b) => b.createdAt - a.createdAt);
      
      if (role === 'admin') {
        setSystemRequests(allReqs);
      } else {
        setSystemRequests(allReqs.filter(req => req.clientId === user.uid));
      }
    }, (error) => {
      console.error("Firestore Listen Error:", error);
    });
    
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, role]);

  const handleLogout = () => { 
    if(auth) signOut(auth); 
    setUser(null); 
  };
  
  const addRequest = async (newReqData) => { 
    if (!user || !db) return;
    const requestsRef = collection(db, 'artifacts', appId, 'public', 'data', 'auth_requests');
    await addDoc(requestsRef, { 
      ...newReqData, 
      clientId: user.uid, 
      clientEmail: user.email || 'Anonymous', 
      createdAt: Date.now() 
    });
    setCurrentView('dashboard'); 
  };
  
  const updateRequest = async (firestoreId, updates) => {
    if (!user || !db) return;
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'auth_requests', firestoreId);
    await updateDoc(docRef, updates);
  };

  if (!user && !showLoginModal) {
    return (
      <>
        <GlobalStyles />
        <LandingPage 
          t={t} 
          geo={geo} 
          isRtl={isRtl} 
          lang={lang} 
          setLang={setLang} 
          onGoToLogin={() => setShowLoginModal(true)} 
          setGeo={setGeo} 
        />
      </>
    );
  }

  if (!user && showLoginModal) {
    return (
      <>
        <GlobalStyles />
        <div dir={isRtl ? "rtl" : "ltr"} className="relative">
          <LoginScreen 
            onBack={() => setShowLoginModal(false)} 
            t={t} 
            geo={geo} 
            isRtl={isRtl} 
            lang={lang} 
            setLang={setLang} 
          />
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        )}
        
        <Sidebar 
          t={t} 
          currentView={currentView} 
          setCurrentView={(v) => { setCurrentView(v); setIsMobileMenuOpen(false); }} 
          role={role} 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
          onLogout={handleLogout} 
          geo={geo} 
        />
        
        <main className="flex-1 flex flex-col h-screen w-full overflow-hidden">
          <Header toggleMenu={() => setIsMobileMenuOpen(true)} role={role} t={t} />
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-4 md:p-8 flex-1">
              {role === 'admin' ? (
                  <AuthenticationTool requests={systemRequests} updateRequest={updateRequest} />
              ) : (
                currentView === 'dashboard' ? 
                  <ClientDashboard t={t} requests={systemRequests} setView={setCurrentView} onSelectCert={(req) => { setSelectedCertificate(req); setCurrentView('certificate-view'); }} /> : 
                currentView === 'new-request' ? 
                  <NewAuthenticationRequest t={t} geo={geo} isRtl={isRtl} addRequest={addRequest} setView={setCurrentView} /> :
                currentView === 'business-pkgs' ? 
                  <BusinessPackages t={t} geo={geo} isRtl={isRtl} setView={setCurrentView} /> :
                currentView === 'certificate-view' ? 
                  <DigitalCertificate data={selectedCertificate} onBack={() => setCurrentView('dashboard')} isClientView={true} t={t} isRtl={isRtl} /> :
                  <ClientDashboard t={t} requests={systemRequests} setView={setCurrentView} onSelectCert={(req) => { setSelectedCertificate(req); setCurrentView('certificate-view'); }} />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// ==========================================
// MARKETING LANDING PAGE
// ==========================================
function LandingPage({ t, geo, isRtl, lang, setLang, onGoToLogin, setGeo }) {
  const hideIsrael = geo.country !== 'IL';
  const [showDev, setShowDev] = useState(false);

  useEffect(() => {
    if (window.location.search.includes('dev=true')) {
      setShowDev(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyGeoSettings = (region) => {
    if (region === 'IL') { setGeo({ country: 'IL', currency: 'ILS', symbol: '₪' }); setLang('he'); }
    else if (region === 'US') { setGeo({ country: 'US', currency: 'USD', symbol: '$' }); setLang('en'); }
    else if (region === 'FR') { setGeo({ country: 'FR', currency: 'EUR', symbol: '€' }); setLang('en'); }
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
          <div className="flex items-center gap-3">
            <BrandLogo className="w-12 h-12" hideIsrael={hideIsrael} />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
              <Globe size={14} /> {lang === 'he' ? 'EN' : 'HE'}
            </button>
            <button onClick={onGoToLogin} className="text-sm font-bold text-slate-600 hover:text-teal-700 transition-colors">
              {t('nav_login')}
            </button>
            <button onClick={onGoToLogin} className="bg-[#1c1c1c] text-[#d4af37] px-5 py-2.5 rounded-full text-sm font-bold hover:bg-black transition-colors shadow-lg shadow-black/10">
              {t('nav_start')}
            </button>
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
            <button onClick={onGoToLogin} className="w-full sm:w-auto bg-[#d4af37] hover:bg-[#c4a130] text-[#1c1c1c] font-black px-8 py-4 rounded-full transition-transform active:scale-95 shadow-xl shadow-yellow-900/20 text-lg flex items-center justify-center gap-2">
              <ShieldCheck size={24} /> {t('cta_primary')}
            </button>
            <a href="#how-it-works" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm font-bold px-8 py-4 rounded-full transition-colors text-lg">
              {t('cta_secondary')}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-100 py-6 overflow-hidden">
        <p className="text-center text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">{t('trusted_by')}</p>
        <div className="flex justify-center flex-wrap gap-8 md:gap-16 opacity-60 grayscale">
           <span className="font-serif font-bold text-xl">LOUIS VUITTON</span>
           <span className="font-serif font-bold text-xl">CHANEL</span>
           <span className="font-serif font-bold text-xl">HERMÈS</span>
           <span className="font-serif font-bold text-xl">DIOR</span>
           <span className="font-serif font-bold text-xl">GUCCI</span>
           <span className="font-serif font-bold text-xl">PRADA</span>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">{t('why_us')}</h2>
            <div className="w-24 h-1 bg-teal-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6"><Cpu size={28} /></div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{t('why_1_title')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('why_1_desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6"><Award size={28} /></div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{t('why_2_title')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('why_2_desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6"><Zap size={28} /></div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{t('why_3_title')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('why_3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">{t('how_title')}</h2>
            <div className="w-24 h-1 bg-teal-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-100 -z-10"></div>
             <div className="text-center relative z-10">
                <div className="w-24 h-24 mx-auto bg-slate-900 text-white rounded-full flex items-center justify-center mb-6 shadow-xl"><Camera size={32} /></div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{t('how_1_title')}</h3>
                <p className="text-slate-600">{t('how_1_desc')}</p>
             </div>
             <div className="text-center relative z-10">
                <div className="w-24 h-24 mx-auto bg-slate-900 text-white rounded-full flex items-center justify-center mb-6 shadow-xl"><Search size={32} /></div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{t('how_2_title')}</h3>
                <p className="text-slate-600">{t('how_2_desc')}</p>
             </div>
             <div className="text-center relative z-10">
                <div className="w-24 h-24 mx
