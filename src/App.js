/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, UploadCloud, AlertCircle, CheckCircle, ChevronRight, ChevronLeft, LayoutDashboard, Menu, X, PlusCircle, Clock, Camera, FileText, Upload, Mail, QrCode, ShieldCheck, ShieldAlert, Smartphone, XCircle, Timer, PauseCircle, ImagePlus, PlayCircle, LogOut, ArrowRight, Globe, Briefcase, RefreshCcw, HandCoins, Cpu, Award, Zap, Download, Share2 } from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, updateDoc, doc, onSnapshot, runTransaction, query, where, getDocs } from 'firebase/firestore';

// ==========================================
// FIREBASE CONFIGURATION
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
// SECURITY & ADMIN SETTINGS
// ==========================================
const ADMIN_EMAILS = ['admin@luxurybags.co.il', 'ohad270@gmail.com', 'ohad@luxurybags.co.il'];
const TELEGRAM_TOKEN = "8628800853:AAGwwiVHEii4ao5PO93sWN9755BiQkijDH8";
const TELEGRAM_CHAT_ID = "6397836431";

const sendTelegramMessage = async (message) => {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
    });
  } catch(e) {
    console.error("Telegram notification failed", e);
  }
};

// ==========================================
// DICTIONARY & I18N
// ==========================================
const translations = {
  he: {
    nav_login: "התחברות", nav_start: "התחילו אימות", hero_title: "אפס פשרות. אפס זיופים.",
    hero_subtitle_il: "הסטנדרט החדש של האימות בישראל. טכנולוגיית AI בשירות מומחים אנושיים.",
    cta_primary: "אמתו את הפריט שלכם", cta_secondary: "איך זה עובד?", trusted_by: "אנו מאמתים את מותגי העל המובילים",
    why_us: "למה לבחור בנו?", why_1_title: "שילוב של AI ומומחים", why_1_desc: "החלטה סופית ע\"י מומחה אנושי.",
    why_2_title: "אחריות ואמינות", why_2_desc: "מוכר ע\"י פלטפורמות כמו PayPal ו-eBay.",
    why_3_title: "מהירות חסרת תקדים", why_3_desc: "תעודה דיגיטלית תוך שעות ספורות.",
    welcome: "ברוכים הבאים", welcome_sub: "התחברו כדי לעקוב אחר הבקשות.",
    signup_title: "יצירת חשבון", signup_sub: "הצטרפו והתחילו לאמת.",
    full_name: "שם מלא", email: "כתובת אימייל", password: "סיסמה",
    btn_login: "התחבר", btn_signup: "צור חשבון", client_portal: "אזור לקוחות",
    my_checks: "הבדיקות שלי", new_request: "בקשה חדשה", hello: "שלום",
    history: "היסטוריית בדיקות", brand: "מותג", item_type: "סוג הפריט", model: "דגם",
    serial_number: "מספר סידורי", serial_optional: "רשות - אם קיים",
    select_brand: "בחרו מותג...", select_type: "בחרו סוג...",
    step_1: "שלב 1: פרטים", step_2: "שלב 2: תמונות", step_3: "שלב 3: תשלום",
    continue_photos: "להעלאת תמונות", back: "חזור", continue_track: "לבחירת מסלול",
    track_title: "בחירת מסלול", track_sub: "בחרו את מהירות הטיפול.",
    track_reg: "בדיקה רגילה", track_fast: "בדיקה מהירה", track_exp: "אקספרס",
    hours_12: "12 שעות", hours_6: "6 שעות", hours_2: "שעתיים", recommended: "מומלץ",
    coupon_label: "קוד קופון", coupon_placeholder: "הזינו קוד", apply: "הפעל",
    send_payment_link: "מעבר לתשלום מאובטח (PayPal)", already_paid: "שילמתי - שלח בקשה לבדיקה",
    authentic: "מקורי", fake: "מזויף", pending_expert: "בבדיקה...", pending_payment: "ממתין לתשלום",
    need_photos: "נדרשות תמונות", business_pkg: "חבילות לעסקים",
    pkg_title: "חבילות אימות לעסקים", pkg_sub: "חסכו עד 20%.", contact_sales: "צרו קשר להזמנה",
    success_title: "הבקשה נקלטה! 🎉", success_sub: "היא תועבר לבדיקה ברגע שהתשלום יאושר.",
    btn_home: "מסך ראשי", btn_another: "אימות נוסף"
  },
  en: {
    nav_login: "Login", nav_start: "Start Authentication", hero_title: "ZERO COMPROMISE. ZERO FAKES.",
    hero_subtitle_il: "The new standard in authentication.", cta_primary: "Verify Your Item",
    welcome: "Welcome", welcome_sub: "Log in to continue.",
    btn_login: "Log In", btn_signup: "Create Account", client_portal: "Client Portal",
    my_checks: "My Authentications", new_request: "New Request", hello: "Hello",
    step_1: "Step 1", step_2: "Step 2", step_3: "Step 3", continue_photos: "Photos",
    back: "Back", continue_track: "Next", track_title: "Select Track",
    send_payment_link: "Proceed to Secure Payment", already_paid: "I Paid - Submit Request",
    authentic: "Authentic", fake: "Counterfeit", pending_payment: "Pending Payment",
    success_title: "Request Received!", success_sub: "Review will start upon payment confirmation.",
    btn_home: "Dashboard", btn_another: "Verify Another"
  }
};

const LUXURY_BRANDS = ["Louis Vuitton", "Chanel", "Hermes", "Dior", "Gucci", "Prada", "Saint Laurent", "Celine", "Fendi", "Balenciaga", "Rolex", "Cartier"];
const ITEM_TYPES = ["Bag/תיק", "Clothing/בגד", "Shoes/נעליים", "Accessories/אקססוריז", "Watch/שעון"];
const LV_MODELS = ["Neverfull", "Speedy", "Alma", "Keepall", "Pochette Metis", "Onthego", "Capucines", "Noé", "Multi Pochette", "Diane", "Coussin", "Loop", "Twist", "Bumbag", "Dauphine", "Other / לא ידוע"];
const BAG_PARTS = [
  { id: 'front', iconType: 'front', label: 'Front / חזית' },
  { id: 'inside', iconType: 'inside', label: 'Inside / פנים' },
  { id: 'base', iconType: 'base', label: 'Base / תחתית' },
  { id: 'date-code', iconType: 'date-code', label: 'Date Code / קוד ייצור' },
  { id: 'zipper', iconType: 'zipper', label: 'Zipper / רוכסן' },
  { id: 'metal-stamp', iconType: 'metal-stamp', label: 'Metal Stamp / חותמת מתכת' }
];

// ==========================================
// CUSTOM VECTOR GRAPHICS (LOGOS & ICONS)
// ==========================================
function BrandLogo({ className = "w-16 h-16", hideIsrael = false }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="95" fill="#1c1c1c" stroke="#d4af37" strokeWidth="2"/>
      <path d="M100 40 L140 120 L100 100 L60 120 Z" fill="#d4af37"/>
      <text x="100" y={hideIsrael ? "158" : "150"} fill="#ffffff" fontSize="18" fontFamily="sans-serif" fontWeight="600" textAnchor="middle" letterSpacing="2">LUXURY BAGS</text>
      {!hideIsrael && <text x="100" y="170" fill="#d4af37" fontSize="14" fontFamily="sans-serif" textAnchor="middle" letterSpacing="4">ISRAEL</text>}
    </svg>
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

// ==========================================
// META PIXEL COMPONENT
// ==========================================
function MetaPixel() {
  useEffect(() => {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', '1438850480805983');
    window.fbq('track', 'PageView');
  }, []);

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src="https://www.facebook.com/tr?id=1438850480805983&ev=PageView&noscript=1"
        alt="Meta Pixel"
      />
    </noscript>
  );
}

// ==========================================
// GLOBAL STYLES & PRINT ISOLATION
// ==========================================
function GlobalStyles() {
  return (
    <style dangerouslySetInnerHTML={{__html: `
      @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;600;700;800;900&display=swap');
      * { font-family: 'Assistant', system-ui, sans-serif !important; }
      
      /* PRINT ISOLATION CSS */
      @media print {
        body * {
          visibility: hidden;
        }
        #print-certificate-container, #print-certificate-container * {
          visibility: visible;
        }
        #print-certificate-container {
          position: fixed;
          left: 0;
          top: 0;
          width: 210mm;
          height: 297mm;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: white;
          z-index: 9999;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        @page {
          size: A4;
          margin: 0;
        }
      }
    `}} />
  );
}

// ==========================================
// ERROR BOUNDARY (WATCHDOG)
// ==========================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("Watchdog caught an error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6" dir="rtl">
          <div className="bg-slate-800 p-8 rounded-2xl max-w-lg text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">מערכת ההגנה (Watchdog) הופעלה</h1>
            <p className="text-slate-300 mb-6">זיהינו שגיאה לא צפויה במערכת ומנענו קריסה מוחלטת.</p>
            <p className="text-xs text-slate-500 bg-slate-900 p-3 rounded text-left mb-6 font-mono overflow-auto">{this.state.error?.toString()}</p>
            <button onClick={() => window.location.reload()} className="bg-teal-600 px-6 py-3 rounded-xl font-bold hover:bg-teal-700">רענן מסך</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================
function MainApp() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('client');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [systemRequests, setSystemRequests] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [geo, setGeo] = useState({ country: 'IL', currency: 'ILS', symbol: '₪' });
  const [lang, setLang] = useState('he');

  const t = useCallback((key) => translations[lang]?.[key] || translations['en'][key] || key, [lang]);
  const isRtl = lang === 'he' || lang === 'ar';

  const handleLogout = () => {
    if(auth) signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    if (!auth) return;
    const initCanvasAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else if (process.env.NODE_ENV === 'development') {
          await signInAnonymously(auth);
        }
      } catch(e) { console.warn("Custom Auth Failed", e); }
    };
    initCanvasAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Admin verification using strict array
        const email = (currentUser.email || '').toLowerCase();
        if (ADMIN_EMAILS.includes(email)) {
           setRole('admin');
        } else {
           setRole('client');
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const reqsRef = collection(db, 'artifacts', appId, 'public', 'data', 'auth_requests');
    const unsubscribe = onSnapshot(reqsRef, (snapshot) => {
      const allReqs = snapshot.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
      if (role === 'admin') {
        setSystemRequests(allReqs.sort((a,b) => b.createdAt - a.createdAt));
      } else {
        setSystemRequests(allReqs.filter(r => r.clientId === user.uid).sort((a,b) => b.createdAt - a.createdAt));
      }
    });
    return () => unsubscribe();
  }, [user, role]);

  const addRequest = useCallback(async (newReqData) => {
    if (!user || !db) return;
    try {
      const requestsRef = collection(db, 'artifacts', appId, 'public', 'data', 'auth_requests');
      
      // Sanitization: Remove Heavy Base64 & undefined fields before saving
      const cleanData = JSON.parse(JSON.stringify(newReqData));
      if (cleanData.images) {
          Object.keys(cleanData.images).forEach(key => {
              if (cleanData.images[key] && cleanData.images[key].startsWith('data:image')) {
                  cleanData.images[key] = 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=200&q=80';
              }
          });
      }

      await addDoc(requestsRef, { 
        ...cleanData, 
        clientId: user.uid, 
        clientEmail: user.email || 'Anonymous', 
        createdAt: Date.now() 
      });

      // Send Telegram Notification
      sendTelegramMessage(`התקבלה בקשת אימות חדשה!\n\nלקוח: ${user.email}\nמותג: ${cleanData.brand}\nדגם: ${cleanData.model}\nסטטוס: ממתין לתשלום`);

    } catch(err) {
      console.error("Error saving request", err);
      throw err;
    }
  }, [user]);

  const updateRequest = async (firestoreId, updates) => {
    if (!user || !db) return;
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'auth_requests', firestoreId);
    await updateDoc(docRef, updates);
  };

  if (!user && !showLoginModal) {
    return <LandingPage t={t} geo={geo} isRtl={isRtl} lang={lang} setLang={setLang} onGoToLogin={() => setShowLoginModal(true)} setGeo={setGeo} />;
  }

  if (!user && showLoginModal) {
    return <LoginScreen onBack={() => setShowLoginModal(false)} t={t} geo={geo} isRtl={isRtl} lang={lang} setLang={setLang} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
      {isMobileMenuOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />}
      
      <Sidebar t={t} currentView={currentView} setCurrentView={(v) => { setCurrentView(v); setIsMobileMenuOpen(false); setSelectedCertificate(null); }} role={role} isOpen={isMobileMenuOpen} onLogout={handleLogout} geo={geo} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header toggleMenu={() => setIsMobileMenuOpen(true)} role={role} t={t} />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
          
          {selectedCertificate ? (
            <div className="max-w-3xl mx-auto">
               <button onClick={() => setSelectedCertificate(null)} className="text-slate-500 font-medium hover:text-slate-800 flex items-center gap-1 mb-6">
                 <ChevronLeft size={18} className={isRtl ? 'rotate-180' : ''}/> {t('back')}
               </button>
               {/* Screen View */}
               <ScreenCertificateView data={selectedCertificate} isClientView={role === 'client'} t={t} isRtl={isRtl} />
               {/* Hidden Print View */}
               <PrintCertificateView data={selectedCertificate} />
            </div>
          ) : currentView === 'dashboard' ? (
            <ClientDashboard t={t} requests={systemRequests} setView={setCurrentView} onSelectCert={setSelectedCertificate} role={role} updateRequest={updateRequest} />
          ) : currentView === 'new-request' ? (
            <NewAuthenticationRequest t={t} geo={geo} isRtl={isRtl} addRequest={addRequest} setView={setCurrentView} />
          ) : currentView === 'business-pkgs' ? (
            <BusinessPackages t={t} geo={geo} isRtl={isRtl} setView={setCurrentView} />
          ) : currentView === 'auth-tool' && role === 'admin' ? (
            <AuthenticationTool requests={systemRequests} updateRequest={updateRequest} onSelectCert={setSelectedCertificate} />
          ) : null}

        </div>
      </main>
    </div>
  );
}

// ==========================================
// LANDING PAGE
// ==========================================
function LandingPage({ t, geo, isRtl, lang, setLang, onGoToLogin, setGeo }) {
  const [showDev, setShowDev] = useState(false);
  useEffect(() => { if (window.location.search.includes('dev=true')) setShowDev(true); }, []);
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" dir={isRtl ? "rtl" : "ltr"}>
      {showDev && (
        <div className="bg-slate-900 text-white text-xs p-1 flex gap-4 justify-center">
          <button onClick={() => { setGeo({ country: 'IL', currency: 'ILS', symbol: '₪' }); setLang('he'); }} className="font-bold hover:text-teal-400">IL</button>
          <button onClick={() => { setGeo({ country: 'US', currency: 'USD', symbol: '$' }); setLang('en'); }} className="font-bold hover:text-teal-400">US</button>
        </div>
      )}
      
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <BrandLogo className="w-12 h-12" />
        <button onClick={onGoToLogin} className="bg-[#1c1c1c] text-[#d4af37] font-bold px-6 py-2 rounded-full hover:bg-black transition-colors">{t('nav_login')}</button>
      </header>

      <section className="relative py-24 px-6 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-slate-50 -z-10" />
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100/50 border border-yellow-200 text-yellow-800 text-sm font-semibold">
           <Zap size={16} className="text-yellow-600" />
           {t('trusted_by')}
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6 max-w-4xl leading-tight">
          {t('hero_title')}
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl font-medium">
          {t('hero_subtitle_il')}
        </p>
        <button onClick={onGoToLogin} className="bg-[#1c1c1c] text-[#d4af37] text-lg font-bold px-10 py-5 rounded-full shadow-2xl hover:scale-105 transition-transform">
          {t('cta_primary')}
        </button>
      </section>

      <section className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">{t('why_us')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
             <FeatureCard icon={<Cpu size={32}/>} title={t('why_1_title')} desc={t('why_1_desc')} />
             <FeatureCard icon={<ShieldCheck size={32}/>} title={t('why_2_title')} desc={t('why_2_desc')} />
             <FeatureCard icon={<Timer size={32}/>} title={t('why_3_title')} desc={t('why_3_desc')} />
          </div>
        </div>
      </section>
    </div>
  );
}
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center hover:shadow-xl transition-shadow">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-teal-700">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-600">{desc}</p>
    </div>
  );
}

// ==========================================
// LOGIN SCREEN
// ==========================================
function LoginScreen({ onBack, t, isRtl }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isSignUp) await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      setErrorMsg("שגיאה בהתחברות. אנא ודא פרטים ונסה שנית.");
    }
  };

  return (
    <div className="min-h-screen flex" dir={isRtl ? "rtl" : "ltr"}>
      <button onClick={onBack} className={`absolute top-6 ${isRtl ? 'right-6' : 'left-6'} z-50 flex items-center gap-2 font-bold bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow`}>
        <ChevronLeft size={16} className={isRtl ? 'rotate-180' : ''} /> חזרה לאתר
      </button>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          <BrandLogo className="w-20 h-20 mb-8" />
          <h2 className="text-3xl font-black mb-2">{isSignUp ? t('signup_title') : t('welcome')}</h2>
          <p className="text-slate-500 mb-8">{isSignUp ? t('signup_sub') : t('welcome_sub')}</p>
          
          {errorMsg && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">{errorMsg}</div>}
          
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <input type="email" placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-50 border-none px-5 py-4 rounded-xl focus:ring-2 focus:ring-teal-500" />
            <input type="password" placeholder={t('password')} value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-50 border-none px-5 py-4 rounded-xl focus:ring-2 focus:ring-teal-500" />
            <button type="submit" className="w-full bg-[#1c1c1c] text-[#d4af37] font-bold py-4 rounded-xl shadow-md hover:bg-black">{isSignUp ? t('btn_signup') : t('btn_login')}</button>
          </form>
          
          <div className="mt-8 text-center text-sm">
            <span className="text-slate-500">{isSignUp ? t('have_account') : t('no_account')} </span>
            <button onClick={() => setIsSignUp(!isSignUp)} className="font-bold text-teal-700 underline">{isSignUp ? t('login_here') : t('signup_free')}</button>
          </div>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2 bg-slate-900 relative">
        <img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=1000&q=80" alt="Luxury" className="absolute inset-0 w-full h-full object-cover opacity-60" />
      </div>
    </div>
  );
}

// ==========================================
// APP SHELL COMPONENTS
// ==========================================
function Sidebar({ t, currentView, setCurrentView, role, isOpen, onLogout }) {
  const menu = role === 'admin' ? [
    { id: 'auth-tool', label: 'תור משימות לבדיקה', icon: <Briefcase size={20}/> }
  ] : [
    { id: 'dashboard', label: t('my_checks'), icon: <LayoutDashboard size={20}/> },
    { id: 'new-request', label: t('new_request'), icon: <PlusCircle size={20}/> },
    { id: 'business-pkgs', label: t('business_pkg'), icon: <Award size={20}/> }
  ];

  return (
    <aside className={`fixed md:static inset-y-0 right-0 w-72 md:w-64 bg-[#1c1c1c] text-slate-300 flex flex-col z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
      <div className="p-6 pb-2 border-b border-white/10 flex items-center justify-between">
        <BrandLogo className="w-12 h-12" />
      </div>
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {menu.map(item => (
          <button key={item.id} onClick={() => setCurrentView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${currentView === item.id ? 'bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37]' : 'hover:bg-white/5 hover:text-white'}`}>
            {item.icon} <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-white/10">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
          <LogOut size={18} className="transform rotate-180" /> התנתקות
        </button>
      </div>
    </aside>
  );
}

function Header({ toggleMenu, role, t }) {
  return (
    <header className="bg-white border-b px-4 py-4 flex items-center justify-between md:justify-end sticky top-0 z-30">
      <button onClick={toggleMenu} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Menu size={24} /></button>
      <div className="font-bold text-slate-800">{role === 'admin' ? 'LBI Expert Portal' : t('client_portal')}</div>
    </header>
  );
}

// ==========================================
// CLIENT DASHBOARD
// ==========================================
function ClientDashboard({ t, requests, setView, onSelectCert, role, updateRequest }) {
  const [uploadingMissingFor, setUploadingMissingFor] = useState(null);

  if (uploadingMissingFor) {
    return <MissingPhotosUploader req={uploadingMissingFor} onBack={() => setUploadingMissingFor(null)} updateRequest={updateRequest} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{t('hello')}! 👋</h1>
          <p className="text-slate-500 mt-1">{t('welcome_dash')}</p>
        </div>
        <button onClick={() => setView('new-request')} className="bg-[#1c1c1c] text-[#d4af37] font-bold px-6 py-3 rounded-xl shadow-md hover:scale-105 transition-transform flex items-center gap-2 w-full md:w-auto justify-center">
          <PlusCircle size={18} /> {t('new_request')}
        </button>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">{t('history')}</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {requests.length === 0 ? (
            <div className="p-12 text-center text-slate-400">אין בקשות היסטוריות.</div>
          ) : (
            requests.map(req => (
              <div key={req.firestoreId || req.id} className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shadow-sm shrink-0">
                    <img src={(req.images && Object.values(req.images)[0]) || 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=200&q=80'} alt="Item" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-lg">{req.brand} <span className="font-normal text-slate-500 text-sm">| {req.model}</span></div>
                    <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">{req.id}</span> • {req.date}
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-auto">
                   <StatusBadge status={req.status} result={req.result} t={t} onClick={() => req.status === 'completed' ? onSelectCert(req) : req.status === 'waiting_for_customer' ? setUploadingMissingFor(req) : null} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, result, t, onClick }) {
  if (status === 'completed') {
    const isAuthentic = result === 'authentic';
    return (
      <button onClick={onClick} className={`w-full md:w-auto px-4 py-2 rounded-full text-sm font-bold flex items-center justify-center gap-2 ${isAuthentic ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
        {isAuthentic ? <CheckCircle size={16}/> : <XCircle size={16}/>} {isAuthentic ? t('authentic') : t('fake')} - צפה בתעודה
      </button>
    );
  }
  if (status === 'waiting_for_customer') {
    return (
      <button onClick={onClick} className="w-full md:w-auto px-4 py-2 rounded-full text-sm font-bold flex items-center justify-center gap-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 animate-pulse">
        <AlertCircle size={16}/> נדרשות תמונות (לחץ להשלמה)
      </button>
    );
  }
  if (status === 'pending_payment') {
    return <span className="inline-flex px-4 py-2 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700"><Clock size={16} className="mr-2"/> {t('pending_payment')}</span>;
  }
  return <span className="inline-flex px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-700"><Timer size={16} className="mr-2"/> {t('pending_expert')}</span>;
}

// ==========================================
// MISSING PHOTOS UPLOADER (CLIENT SIDE)
// ==========================================
function MissingPhotosUploader({ req, onBack, updateRequest }) {
  const { uploadedImages, fileInputRef, triggerFileInput, removeImage, handleFileChange } = useImageUploader();
  
  const missingParts = req.missingParts || [];

  const handleSubmit = () => {
    const mergedImages = { ...req.images, ...uploadedImages };
    updateRequest(req.firestoreId, { images: mergedImages, status: 'reviewing', missingParts: [] });
    sendTelegramMessage(`לקוח העלה תמונות השלמה עבור בקשה ${req.id}`);
    onBack();
  };

  const handleNoBetterPhotos = () => {
    updateRequest(req.firestoreId, { status: 'reviewing', adminMessage: 'הלקוח דיווח שאין באפשרותו לספק תמונות טובות יותר.', missingParts: [] });
    sendTelegramMessage(`לקוח דיווח שאין תמונות טובות יותר עבור בקשה ${req.id}`);
    onBack();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-yellow-200 overflow-hidden">
      <div className="bg-yellow-50 border-b border-yellow-200 p-6 flex justify-between items-center">
         <div>
           <h2 className="text-xl font-bold text-yellow-900 flex items-center gap-2"><AlertCircle /> השלמת תמונות לבקשה {req.id}</h2>
         </div>
         <button onClick={onBack} className="text-slate-500 hover:bg-yellow-100 p-2 rounded-full"><X size={20}/></button>
      </div>
      
      <div className="p-6 md:p-8 space-y-6">
         {req.adminMessage && (
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
             <h4 className="font-bold text-slate-800 text-sm mb-1">הודעה מהמומחה שלנו:</h4>
             <p className="text-slate-600">{req.adminMessage}</p>
           </div>
         )}

         <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
         
         <div className="grid grid-cols-2 gap-4">
            {missingParts.map(partId => {
               const partDef = BAG_PARTS.find(p => p.id === partId);
               return (
                 <div key={partId} onClick={() => triggerFileInput(partId)} className={`relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden transition-all ${uploadedImages[partId] ? 'border-teal-500 bg-teal-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}>
                   {uploadedImages[partId] ? (
                     <>
                       <img src={uploadedImages[partId]} alt={partId} className="absolute inset-0 w-full h-full object-cover" />
                       <button onClick={(e) => removeImage(partId, e)} className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600"><X size={16}/></button>
                     </>
                   ) : (
                     <>
                       <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 mb-3"><Camera size={24}/></div>
                       <span className="text-xs font-bold text-slate-600 text-center">השלם: {partDef?.label || partId}</span>
                     </>
                   )}
                 </div>
               )
            })}
         </div>

         <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
            <button onClick={handleSubmit} disabled={Object.keys(uploadedImages).length === 0} className="w-full bg-[#1c1c1c] text-[#d4af37] font-bold py-4 rounded-xl hover:bg-black transition-colors disabled:opacity-50">
               שלח תמונות להמשך בדיקה
            </button>
            <button onClick={handleNoBetterPhotos} className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors">
               אין לי אפשרות לצלם תמונות טובות יותר
            </button>
         </div>
      </div>
    </div>
  );
}

// ==========================================
// CUSTOM HOOK: IMAGE UPLOADER
// ==========================================
function useImageUploader() {
  const [uploadedImages, setUploadedImages] = useState({});
  const fileInputRef = useRef(null);
  const [uploadingPart, setUploadingPart] = useState(null);

  const triggerFileInput = (partId) => {
    setUploadingPart(partId);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const removeImage = (partId, e) => {
    e.stopPropagation();
    const newImages = { ...uploadedImages };
    delete newImages[partId];
    setUploadedImages(newImages);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingPart) return;
    
    // Client-side quick compression to Base64 for instant preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImages(prev => ({ ...prev, [uploadingPart]: reader.result }));
      setUploadingPart(null);
    };
    reader.readAsDataURL(file);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  return { uploadedImages, fileInputRef, triggerFileInput, removeImage, handleFileChange };
}

// ==========================================
// NEW AUTHENTICATION REQUEST (WIZARD)
// ==========================================
function NewAuthenticationRequest({ t, geo, isRtl, addRequest, setView }) {
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState('');
  const [itemType, setItemType] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [paymentTrack, setPaymentTrack] = useState('regular');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { uploadedImages, fileInputRef, triggerFileInput, removeImage, handleFileChange } = useImageUploader();

  const handlePaymentSuccess = async (paymentStatus = 'pending_payment') => {
    setIsSaving(true);
    try {
      const counterRef = doc(db, 'artifacts', appId, 'public', 'data', 'counters', 'main_counter');
      let newIdNum = 19201;
      
      // Transaction to safely get next sequential ID
      await runTransaction(db, async (transaction) => {
          const counterDoc = await transaction.get(counterRef);
          if (!counterDoc.exists()) {
              transaction.set(counterRef, { currentSequence: 19201 });
          } else {
              newIdNum = (counterDoc.data().currentSequence || 19200) + 1;
              transaction.update(counterRef, { currentSequence: newIdNum });
          }
      });
      
      const finalId = `LBI-${newIdNum}`;
      
      await addRequest({
          id: finalId,
          brand,
          itemType,
          model: model || 'N/A',
          serialNumber: serialNumber || '',
          date: new Date().toLocaleDateString('en-GB'),
          status: paymentStatus,
          paymentTrack,
          images: uploadedImages
      });
      
      setShowSuccess(true);

      // --- META PIXEL EVENT TRACKING ---
      if (typeof window !== 'undefined' && window.fbq) {
        const amountToCharge = paymentTrack === 'express' ? (geo.currency === 'ILS' ? 149 : 49) : paymentTrack === 'fast' ? (geo.currency === 'ILS' ? 129 : 39) : (geo.currency === 'ILS' ? 99 : 29);
        window.fbq('track', 'Lead', {
          content_name: 'Authentication Request Submitted',
          currency: geo.currency,
          value: amountToCharge
        });
      }
      // ---------------------------------

    } catch(err) {
      console.error(err);
      alert('שגיאה בשמירת הבקשה. אנא פנה לתמיכה.');
    } finally {
      setIsSaving(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={48} /></div>
        <h2 className="text-3xl font-black mb-2">{t('success_title')}</h2>
        <p className="text-slate-500 mb-8">{t('success_sub')}</p>
        <div className="space-y-3">
          <button onClick={() => setView('dashboard')} className="w-full bg-[#1c1c1c] text-[#d4af37] font-bold py-4 rounded-xl hover:bg-black transition-colors">{t('btn_home')}</button>
          <button onClick={() => { setStep(1); setShowSuccess(false); setBrand(''); setModel(''); setSerialNumber(''); }} className="w-full bg-slate-100 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors">{t('btn_another')}</button>
        </div>
      </div>
    );
  }

  const amountToCharge = paymentTrack === 'express' ? (geo.currency === 'ILS' ? 149 : 49) : paymentTrack === 'fast' ? (geo.currency === 'ILS' ? 129 : 39) : (geo.currency === 'ILS' ? 99 : 29);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-[#1c1c1c] text-white p-6 md:p-8">
        <h2 className="text-2xl font-black mb-2">{t('new_request')}</h2>
        <div className="flex items-center gap-2 text-sm text-[#d4af37] font-medium">
          <span className={step >= 1 ? 'text-[#d4af37]' : 'text-slate-500'}>1. פרטים</span> <ChevronLeft size={14} className={isRtl ? '' : 'rotate-180'}/>
          <span className={step >= 2 ? 'text-[#d4af37]' : 'text-slate-500'}>2. תמונות</span> <ChevronLeft size={14} className={isRtl ? '' : 'rotate-180'}/>
          <span className={step >= 3 ? 'text-[#d4af37]' : 'text-slate-500'}>3. תשלום</span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('brand')}</label>
              <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-teal-500">
                <option value="">{t('select_brand')}</option>
                {LUXURY_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">{t('item_type')}</label>
               <select value={itemType} onChange={(e) => setItemType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-teal-500">
                 <option value="">{t('select_type')}</option>
                 {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('model')} <span className="font-normal text-slate-400">({t('optional')})</span></label>
              {brand === 'Louis Vuitton' && itemType.includes('Bag') ? (
                <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-teal-500">
                  <option value="">בחרו דגם...</option>
                  {LV_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              ) : (
                <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="לדוגמה: Submariner" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-teal-500" />
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('serial_number')} <span className="font-normal text-slate-400">({t('serial_optional')})</span></label>
              <input type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="הזן מספר סידורי אם קיים" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-teal-500" />
            </div>
            <button onClick={() => setStep(2)} disabled={!brand || !itemType} className="w-full bg-[#1c1c1c] text-[#d4af37] font-bold py-4 rounded-xl hover:bg-black transition-colors mt-6 disabled:opacity-50">
              {t('continue_photos')}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {BAG_PARTS.map(part => (
                <div key={part.id} onClick={() => triggerFileInput(part.id)} className={`relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden transition-all ${uploadedImages[part.id] ? 'border-teal-500 bg-teal-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}`}>
                  {uploadedImages[part.id] ? (
                    <>
                      <img src={uploadedImages[part.id]} alt={part.id} className="absolute inset-0 w-full h-full object-cover" />
                      <button onClick={(e) => removeImage(part.id, e)} className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600"><X size={16}/></button>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 mb-3"><Camera size={24}/></div>
                      <span className="text-xs font-bold text-slate-600 text-center">{part.label}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="w-1/3 bg-slate-100 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors">{t('back')}</button>
              <button onClick={() => setStep(3)} disabled={Object.keys(uploadedImages).length < 2} className="w-2/3 bg-[#1c1c1c] text-[#d4af37] font-bold py-4 rounded-xl hover:bg-black transition-colors disabled:opacity-50">
                {t('continue_track')}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid gap-4">
               <TrackOption id="regular" title={t('track_reg')} hours="24-48h" price={geo.currency==='ILS'?99:29} geo={geo} current={paymentTrack} onSelect={setPaymentTrack} />
               <TrackOption id="fast" title={t('track_fast')} hours={t('hours_12')} price={geo.currency==='ILS'?129:39} geo={geo} current={paymentTrack} onSelect={setPaymentTrack} highlight="text-teal-600 font-bold" tag="Popular" />
               <TrackOption id="express" title={t('track_exp')} hours={t('hours_2')} price={geo.currency==='ILS'?149:49} geo={geo} current={paymentTrack} onSelect={setPaymentTrack} highlight="text-rose-600 font-bold" tag="Priority" />
            </div>
            
            <div className="pt-6 border-t border-slate-100">
              <a href={`https://paypal.me/ohad270/${amountToCharge}${geo.currency}`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#003087] text-white font-bold py-4 rounded-xl hover:bg-[#001f5c] transition-colors shadow-lg">
                 <HandCoins size={20} /> {t('send_payment_link')} - {geo.symbol}{amountToCharge}
              </a>
              <button onClick={() => handlePaymentSuccess('pending_payment')} disabled={isSaving} className="w-full mt-4 bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-colors shadow-md disabled:opacity-50">
                 {isSaving ? 'שומר בקשה...' : t('already_paid')}
              </button>
              <button onClick={() => setStep(2)} className="w-full mt-4 bg-slate-100 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors">{t('back')}</button>
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
    <div onClick={() => onSelect(id)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${isSelected ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-white hover:border-teal-300'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-teal-600' : 'border-slate-300'}`}>{isSelected && <div className="w-2.5 h-2.5 bg-teal-600 rounded-full"/>}</div>
        <div>
           <div className="font-bold text-slate-800 flex items-center gap-2">{title} {tag && <span className="text-[10px] uppercase bg-slate-800 text-white px-2 py-0.5 rounded-full">{tag}</span>}</div>
           <div className={`text-sm flex items-center gap-1 mt-1 ${highlight}`}><Clock size={14}/> {hours}</div>
        </div>
      </div>
      <div className="text-xl font-black text-slate-900">{geo.symbol}{price}</div>
    </div>
  );
}

// ==========================================
// BUSINESS PACKAGES
// ==========================================
function BusinessPackages({ t, geo, isRtl, setView }) {
  const packages = [
    { title: 'Bronze', checks: 10, free: 2, discount: '15%', price: geo.currency === 'ILS' ? 850 : 250 },
    { title: 'Silver', checks: 50, free: 10, discount: '17%', price: geo.currency === 'ILS' ? 4150 : 1200 },
    { title: 'Gold', checks: 100, free: 25, discount: '20%', price: geo.currency === 'ILS' ? 7900 : 2300 }
  ];
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-black mb-2">{t('pkg_title')}</h2>
      <p className="text-slate-500 mb-8">{t('pkg_sub')}</p>
      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">- {pkg.discount}</div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">{pkg.title}</h3>
            <div className="text-4xl font-black text-teal-600 mb-6">{geo.symbol}{pkg.price}</div>
            <ul className="text-slate-600 space-y-3 mb-8">
              <li className="flex justify-center gap-2"><CheckCircle size={18} className="text-teal-500"/> {pkg.checks} Authentications</li>
              <li className="flex justify-center gap-2"><CheckCircle size={18} className="text-teal-500"/> + {pkg.free} Free</li>
            </ul>
            <a href="https://wa.me/972500000000" target="_blank" rel="noreferrer" className="block w-full bg-[#1c1c1c] text-[#d4af37] font-bold py-3 rounded-xl hover:bg-black transition-colors">{t('contact_sales')}</a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// CERTIFICATE VIEWS (SCREEN & PRINT)
// ==========================================
function ScreenCertificateView({ data, isClientView, t, isRtl }) {
  if(!data) return null;
  const isAuthentic = data.result === 'authentic';
  
  const handlePrint = () => {
    document.title = `${data.id}`;
    window.print();
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-200 relative overflow-hidden print:hidden">
      <div className="absolute top-0 inset-x-0 h-2 bg-[#d4af37]"></div>
      <div className="text-center mb-10">
        <BrandLogo className="w-20 h-20 mx-auto mb-4" />
        <h2 className="text-3xl font-black tracking-widest text-slate-900 uppercase">Certificate of Authentication</h2>
        <p className="text-slate-500 tracking-widest mt-2 uppercase text-sm">Luxury Bags Israel</p>
      </div>

      <div className={`w-full py-5 mb-10 border-y-2 relative z-10 text-center ${isAuthentic ? 'border-green-200 bg-green-50/80 text-green-800' : 'border-red-200 bg-red-50/80 text-red-800'}`}>
        <h3 className="text-3xl font-black tracking-widest uppercase">{isAuthentic ? 'Authentic' : 'Counterfeit'}</h3>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div><span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Brand</span><span className="text-lg font-bold text-slate-900">{data.brand}</span></div>
        <div><span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Model</span><span className="text-lg font-bold text-slate-900">{data.model}</span></div>
        {data.serialNumber && <div><span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Serial Number</span><span className="text-lg font-bold text-slate-900">{data.serialNumber}</span></div>}
        <div><span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date Inspected</span><span className="text-lg font-bold text-slate-900">{data.date}</span></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {data.images && Object.entries(data.images).slice(0, 4).map(([key, url]) => (
          <div key={key} className="text-center">
            <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 mb-2">
              <img src={url} alt={key} className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">{key}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-100 gap-6">
        <div className="text-center md:text-left flex-1">
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">This item has been rigorously inspected by our experts combining decades of human experience and advanced AI protocols.</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <QrCode size={64} className="text-slate-800" />
          <span className="text-[10px] font-mono text-slate-500">{data.id}</span>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-4">
        <button onClick={handlePrint} className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-black">
          <Download size={18} /> הורד כ-PDF / הדפס
        </button>
        {isClientView && isAuthentic && (
          <button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90">
             <InstagramIcon size={18} /> שתף בסטורי
          </button>
        )}
      </div>
    </div>
  );
}

function PrintCertificateView({ data }) {
  if(!data) return null;
  const isAuthentic = data.result === 'authentic';
  return (
    <div id="print-certificate-container" className="hidden">
      <div style={{ width: '210mm', height: '297mm', padding: '20mm', boxSizing: 'border-box', position: 'relative', fontFamily: 'sans-serif' }}>
         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8mm', backgroundColor: '#d4af37' }}></div>
         
         <div style={{ textAlign: 'center', marginBottom: '15mm', marginTop: '10mm' }}>
            <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '4px', textTransform: 'uppercase', color: '#111' }}>Certificate of Authentication</div>
            <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: '#666', marginTop: '4px' }}>Luxury Bags Israel</div>
         </div>

         <div style={{ padding: '8mm 0', marginBottom: '15mm', borderTop: '2px solid #eee', borderBottom: '2px solid #eee', textAlign: 'center', backgroundColor: isAuthentic ? '#f0fdf4' : '#fef2f2' }}>
            <div style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '4px', textTransform: 'uppercase', color: isAuthentic ? '#166534' : '#991b1b' }}>
              {isAuthentic ? 'Authentic' : 'Counterfeit'}
            </div>
         </div>

         <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15mm' }}>
            <div style={{ width: '50%', marginBottom: '6mm' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#888', marginBottom: '2px' }}>Brand</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111' }}>{data.brand}</div>
            </div>
            <div style={{ width: '50%', marginBottom: '6mm' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#888', marginBottom: '2px' }}>Model</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111' }}>{data.model}</div>
            </div>
            {data.serialNumber && (
              <div style={{ width: '50%', marginBottom: '6mm' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#888', marginBottom: '2px' }}>Serial Number</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111' }}>{data.serialNumber}</div>
              </div>
            )}
            <div style={{ width: '50%', marginBottom: '6mm' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#888', marginBottom: '2px' }}>Date Inspected</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111' }}>{data.date}</div>
            </div>
         </div>

         <div style={{ display: 'flex', gap: '4mm', marginBottom: '15mm' }}>
           {data.images && Object.entries(data.images).slice(0, 4).map(([key, url]) => (
             <div key={key} style={{ flex: 1, textAlign: 'center' }}>
               <div style={{ height: '35mm', backgroundColor: '#f8f9fa', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '2px' }}>
                 <img src={url} alt={key} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
               <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase' }}>{key}</div>
             </div>
           ))}
         </div>

         <div style={{ position: 'absolute', bottom: '20mm', left: '20mm', right: '20mm', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '10mm' }}>
            <div style={{ fontSize: '10px', color: '#666', lineHeight: '1.5', maxWidth: '80mm' }}>
              This item has been rigorously inspected by our experts combining decades of human experience and advanced AI protocols.
            </div>
            <div style={{ textAlign: 'center' }}>
               <QrCode size={50} color="#111" />
               <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#666', marginTop: '4px' }}>{data.id}</div>
            </div>
         </div>
      </div>
    </div>
  );
}

// ==========================================
// ADMIN AUTHENTICATION TOOL (ADVANCED)
// ==========================================
function AuthenticationTool({ requests, updateRequest, onSelectCert }) {
  const [selectedReqId, setSelectedReqId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7200);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedParts, setSelectedParts] = useState([]);
  const [customMessage, setCustomMessage] = useState('');
  
  const pendingRequests = requests.filter(r => r.status !== 'completed');
  const activeReq = requests.find(r => r.firestoreId === selectedReqId);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (!isTimerRunning && timeLeft !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleComplete = (result) => {
    updateRequest(activeReq.firestoreId, { status: 'completed', result });
    alert(`הפריט סומן כ-${result === 'authentic' ? 'מקורי' : 'מזויף'} והתעודה הופקה.`);
    setSelectedReqId(null);
  };

  const sendPhotoRequest = () => {
    if (selectedParts.length === 0 && customMessage.trim() === '') return;
    updateRequest(activeReq.firestoreId, { 
       status: 'waiting_for_customer', 
       missingParts: selectedParts, 
       adminMessage: customMessage 
    });
    alert('בקשה לתמונות נוספות נשלחה ללקוח');
    setSelectedReqId(null);
  };

  const simulateAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      updateRequest(activeReq.firestoreId, { 
         aiDraftResponse: `על בסיס ניתוח תמונות של ${activeReq.brand} ${activeReq.model}, מנוע ה-AI מזהה פונט לא תקני בחותמת התאריך. נדרשת החלטת מומחה סופית.`,
         confidence: 88 
      });
    }, 2000);
  };

  const togglePartSelection = (id) => setSelectedParts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);

  if (activeReq) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <button onClick={() => setSelectedReqId(null)} className="text-slate-500 font-medium hover:text-slate-800 flex items-center gap-1 mb-2">
          <ChevronLeft size={18} className="rotate-180" /> חזור לתור המשימות
        </button>

        <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center shadow-lg">
          <div>
            <div className="text-slate-400 text-sm mb-1">משימת אימות מומחה פעילה</div>
            <h2 className="text-2xl font-black">{activeReq.brand} - {activeReq.model}</h2>
            <div className="text-sm font-mono text-slate-400 mt-1">ID: {activeReq.id}</div>
          </div>
          <div className="text-right">
             <div className="text-slate-400 text-sm mb-1">SLA - נותר לבדיקה</div>
             <div className={`text-4xl font-mono font-black ${timeLeft < 1800 ? 'text-red-400' : 'text-teal-400'}`}>{formatTime(timeLeft)}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ImagePlus size={18}/> תמונות שהתקבלו</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {activeReq.images && Object.entries(activeReq.images).map(([k,v]) => (
                    <div key={k} className="relative group rounded-xl overflow-hidden border">
                      <img src={v} alt={k} className="w-full aspect-square object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-xs p-1 text-center font-bold">{k}</div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
               <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><Cpu size={18}/> LBI AI Assistant</h3>
               {activeReq.aiDraftResponse ? (
                 <div className="bg-white p-4 rounded-xl shadow-sm">
                   <p className="text-slate-700">{activeReq.aiDraftResponse}</p>
                   <div className="mt-3 text-xs font-bold text-slate-400">Confidence: {activeReq.confidence}%</div>
                 </div>
               ) : (
                 <button onClick={simulateAIAnalysis} disabled={isAnalyzing} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50">
                    {isAnalyzing ? 'סורק ומנתח...' : 'הפעל סריקת AI'}
                 </button>
               )}
             </div>
          </div>

          <div className="space-y-6">
             {activeReq.status === 'pending_payment' ? (
                <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200 text-center">
                   <Clock size={48} className="mx-auto text-yellow-500 mb-4" />
                   <h3 className="font-bold text-yellow-900 mb-2">ממתין לתשלום הלקוח</h3>
                   <p className="text-sm text-yellow-700 mb-4">הבקשה נוצרה אך טרם התקבל אישור ממערכת פייפאל.</p>
                   <button onClick={() => updateRequest(activeReq.firestoreId, { status: 'reviewing' })} className="w-full bg-yellow-600 text-white font-bold py-3 rounded-xl hover:bg-yellow-700">
                     אשר קבלת תשלום ידנית
                   </button>
                </div>
             ) : activeReq.status === 'waiting_for_customer' ? (
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200 text-center">
                   <PauseCircle size={48} className="mx-auto text-orange-500 mb-4" />
                   <h3 className="font-bold text-orange-900 mb-2">ממתין להשלמת תמונות</h3>
                   <p className="text-sm text-orange-700">הבדיקה הושהתה עד שהלקוח יעלה את התמונות שביקשת.</p>
                </div>
             ) : (
                <>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">קבלת החלטה סופית</h3>
                    <div className="space-y-3">
                      <button onClick={() => handleComplete('authentic')} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-green-700 flex justify-center items-center gap-2">
                        <CheckCircle size={18}/> אשר כמקורי
                      </button>
                      <button onClick={() => handleComplete('fake')} className="w-full bg-red-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-red-700 flex justify-center items-center gap-2">
                        <XCircle size={18}/> פסול כמזויף
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 text-sm">השהיית בדיקה - בקשת תמונות נוספות</h3>
                    <div className="space-y-2 mb-4">
                       {BAG_PARTS.map(p => (
                         <label key={p.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                           <input type="checkbox" checked={selectedParts.includes(p.id)} onChange={() => togglePartSelection(p.id)} className="rounded text-teal-600 focus:ring-teal-500"/>
                           {p.label}
                         </label>
                       ))}
                    </div>
                    <textarea value={customMessage} onChange={e => setCustomMessage(e.target.value)} placeholder="הערה ללקוח (לדוגמה: התמונה מטושטשת)..." className="w-full text-sm bg-slate-50 border border-slate-200 p-3 rounded-xl mb-3 h-24" />
                    <button onClick={sendPhotoRequest} disabled={selectedParts.length === 0 && !customMessage} className="w-full bg-slate-800 text-white text-sm font-bold py-3 rounded-xl hover:bg-slate-900 disabled:opacity-50">
                       השהה ושלח בקשה ללקוח
                    </button>
                  </div>
                </>
             )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-black mb-6">תור משימות למנהל ({pendingRequests.length})</h2>
      <div className="space-y-4">
        {pendingRequests.length === 0 ? <p className="text-slate-500">אין בקשות פתוחות כרגע.</p> : null}
        {pendingRequests.map(req => (
          <div key={req.firestoreId} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{req.brand} - {req.model}</h3>
                <p className="text-sm text-slate-500">ID: {req.id} | לקוח: {req.clientEmail} | סטטוס: {req.status}</p>
              </div>
              <div className="text-lg font-black text-teal-600">{req.paymentTrack}</div>
            </div>
            <div className="flex gap-2 overflow-x-auto py-2 mb-4">
               {req.images && Object.entries(req.images).map(([k,v]) => (
                 <img key={k} src={v} alt={k} className="w-20 h-20 object-cover rounded-lg border" />
               ))}
            </div>
            {req.status === 'pending_payment' ? (
              <button onClick={() => updateRequest(req.firestoreId, { status: 'paid' })} className="w-full bg-yellow-100 text-yellow-800 font-bold py-3 rounded-xl hover:bg-yellow-200">אשר קבלת תשלום ידנית (PayPal.Me)</button>
            ) : req.status === 'waiting_for_customer' ? (
              <div className="w-full bg-orange-100 text-orange-800 font-bold py-3 rounded-xl text-center">הלקוח מתבקש להשלים תמונות...</div>
            ) : (
              <button onClick={() => { setSelectedReqId(req.firestoreId); setIsTimerRunning(true); }} className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700">
                פתח תיק לבדיקה
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// EXPORT WRAPPED APP
// ==========================================
export default function App() {
  return (
    <ErrorBoundary>
      <GlobalStyles />
      <MetaPixel />
      <MainApp />
    </ErrorBoundary>
  );
}
