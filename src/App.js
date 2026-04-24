/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, AlertCircle, CheckCircle, ChevronRight, ChevronLeft,
  LayoutDashboard, Menu, X, PlusCircle, Clock, Camera, FileText, Upload, Mail,
  QrCode, Shield, ShieldCheck, ShieldAlert, AlertTriangle, Smartphone, XCircle,
  Timer, PauseCircle, ImagePlus, PlayCircle, LogOut, ArrowRight, Globe,
  Briefcase, RefreshCcw, HandCoins, Cpu, Award, Zap, Star, Sparkles, Check, CreditCard
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { 
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, signOut, signInAnonymously, signInWithCustomToken,
  GoogleAuthProvider, signInWithPopup
} from 'firebase/auth';
import { 
  getFirestore, collection, addDoc, updateDoc, doc, onSnapshot 
} from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

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

let app, auth, db, storage;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (e) {
  console.error("Firebase init failed", e);
}

// ==========================================
// DICTIONARY & I18N (TRANSLATIONS)
// ==========================================
const translations = {
  he: {
    nav_login: "התחברות", nav_start: "התחילו אימות", 
    hero_badge: "פיתוח כחול-לבן 🇮🇱 | הראשון מסוגו בישראל",
    hero_title: "השקט הנפשי שלך.<br />המומחיות שלנו.",
    hero_subtitle_il: "אנו משלבים בינה מלאכותית מתקדמת עם עין אנושית של מומחי יוקרה כדי להבטיח שהפריט שלך – מקורי ב-100%. הסטנדרט העולמי, עכשיו בישראל.",
    hero_subtitle_global: "The Global Standard in Luxury Authentication. AI precision meets human expertise.",
    cta_primary: "אמתו את הפריט שלכם", cta_secondary: "גלו איך זה עובד", trusted_by: "מאמתים את מותגי העל המובילים בעולם",
    stats_items: "פריטים שאומתו", stats_accuracy: "אחוזי דיוק", stats_speed: "שעות לקבלת תעודה", stats_clients: "קניינים ולקוחות",
    israeli_title: "הסטנדרט הישראלי לאימות יוקרה.",
    israeli_desc: "עד היום, כדי לאמת תיק יוקרה נאלצתם להסתמך על קבוצות פייסבוק או לשלוח תמונות לחברות מעבר לים ולהמתין שבועות. Luxury Bags Israel משנה את חוקי המשחק.",
    israeli_point_1: "שירות מהיר ומקומי בשפה העברית.",
    israeli_point_2: "הכרה מלאה מול חברות האשראי בישראל במקרה של זיוף.",
    israeli_point_3: "תעודה דיגיטלית מאובטחת בטכנולוגיית ענן.",
    why_us: "למה קניינים בוחרים בנו?", why_1_title: "טכנולוגיית AI היברידית", why_1_desc: "סריקה ברמת הפיקסל לזיהוי טעויות ייצור בטרם הבדיקה האנושית המעמיקה.",
    why_2_title: "תעודה בעלת תוקף משפטי", why_2_desc: "התעודות שלנו מוכרות ומקובלות על ידי פלטפורמות הסחר הגדולות בעולם למקרי מחלוקת.", why_3_title: "סודיות ודיסקרטיות",
    why_3_desc: "תהליך הבדיקה נעשה בשרתים מאובטחים, כשהמידע שלכם חסוי לחלוטין וללא מעורבות צד ג'.", how_title: "איך התהליך עובד?", 
    how_1_title: "צלמו את הפריט", how_1_desc: "העלו תמונות של התיק, הלוגו, התפרים וקוד התאריך דרך המערכת המאובטחת שלנו.", 
    how_2_title: "ניתוח מעמיק", how_2_desc: "הצוות המומחה שלנו בשילוב מערכות AI בוחן את הפריט מול מאגרי המידע הרשמיים.",
    how_3_title: "קבלת תעודה דיגיטלית", how_3_desc: "תקבלו תעודה רשמית, חתומה דיגיטלית, אותה תוכלו לשתף עם קונים או להציג בגאווה.", 
    reviews_title: "אלפי עסקאות בטוחות",
    b2b_title: "קניינים ובעלי בוטיק? הצטרפו לתוכנית העסקים שלנו",
    welcome: "ברוכים הבאים",
    welcome_sub: "התחברו כדי לעקוב אחר הבקשות.", signup_title: "יצירת חשבון", signup_sub: "הצטרפו והתחילו לאמת.",
    continue_google: "המשך עם Google", continue_fb: "המשך עם Facebook", continue_ig: "המשך עם Instagram",
    no_account: "אין חשבון?", have_account: "כבר יש חשבון?", signup_free: "הירשמו בחינם", login_here: "התחברו כאן",
    full_name: "שם מלא", email: "כתובת אימייל", password: "סיסמה", btn_login: "התחבר", btn_signup: "צור חשבון",
    client_portal: "אזור אישי", my_checks: "הבדיקות שלי", new_request: "בקשה חדשה", hello: "שלום",
    welcome_dash: "ברוך הבא למערכת האימות.", history: "היסטוריית בדיקות", brand: "מותג", item_type: "סוג הפריט",
    model: "דגם", model_placeholder: "לדוגמה: Neverfull", optional: "רשות", select_brand: "בחרו מותג...",
    select_type: "בחרו סוג...", step_1: "שלב 1 מתוך 3", step_2: "שלב 2 מתוך 3", step_3: "שלב 3 מתוך 3",
    continue_photos: "להעלאת תמונות", back: "חזור לאתר", continue_track: "לבחירת מסלול", track_title: "בחירת מסלול",
    track_sub: "בחרו את מהירות הטיפול.", track_reg: "בדיקה רגילה", track_fast: "בדיקה מהירה", track_exp: "אקספרס",
    hours_12: "12 שעות", hours_6: "6 שעות", hours_2: "שעתיים", recommended: "מומלץ", coupon_label: "קוד קופון",
    coupon_placeholder: "הזינו קוד", apply: "הפעל", send_payment: "תשלום באשראי / ביט", send_free: "שלח בחינם",
    authentic: "מקורי", fake: "מזויף", pending_expert: "בבדיקה...", need_photos: "נדרשות תמונות",
    business_pkg: "חבילות לעסקים", pkg_title: "חבילות אימות לעסקים", pkg_sub: "חסכו עד 20%.",
    contact_sales: "דברו איתנו בוואטסאפ", success_title: "הבקשה הוגשה בהצלחה! 🎉",
    success_sub: "הבקשה הועברה לבדיקה. במידה וביצעת תשלום, נתחיל בבדיקה מיד.", btn_home: "מסך ראשי", btn_another: "אימות נוסף"
  },
  en: {
    nav_login: "Login", nav_start: "Start Auth", 
    hero_badge: "Global Standard | Premium Service",
    hero_title: "ZERO COMPROMISE.<br />ZERO FAKES.",
    hero_subtitle_il: "The new global standard in luxury authentication. AI precision meets human expertise.", 
    hero_subtitle_global: "The new global standard in luxury authentication.",
    cta_primary: "Verify Your Item", cta_secondary: "How it works?", trusted_by: "Authenticating prestigious brands",
    stats_items: "Items Authenticated", stats_accuracy: "Accuracy", stats_speed: "Hours Turnaround", stats_clients: "Happy Clients",
    israeli_title: "The Premium Standard of Authentication.",
    israeli_desc: "Stop relying on unverified forums. Luxury Bags Israel brings world-class authentication technology to your fingertips.",
    israeli_point_1: "Fast, localized premium service.",
    israeli_point_2: "Officially recognized for credit card dispute resolution.",
    israeli_point_3: "Secure, blockchain-ready digital certificates.",
    why_us: "Why Buyers Choose Us?", why_1_title: "Hybrid AI Tech", why_1_desc: "Pixel-level scanning before final human expert verdict.",
    why_2_title: "Guaranteed", why_2_desc: "Recognized by PayPal and eBay for dispute resolution.", why_3_title: "Confidentiality",
    why_3_desc: "100% secure processing with no third-party involvement.", how_title: "How It Works?", 
    how_1_title: "1. Upload", how_1_desc: "Upload photos securely.", how_2_title: "2. Analysis", how_2_desc: "Rigorous expert inspection.",
    how_3_title: "3. Certificate", how_3_desc: "Receive official certificate.", reviews_title: "Trusted by Thousands",
    b2b_title: "Boutique Owner? Join our B2B Program",
    welcome: "Welcome Back",
    welcome_sub: "Log in to track requests.", signup_title: "Create Account", signup_sub: "Start authenticating.",
    continue_google: "Continue with Google", continue_fb: "Continue with Facebook", continue_ig: "Continue with Instagram",
    no_account: "No account?", have_account: "Have an account?", signup_free: "Sign up free", login_here: "Log in here",
    full_name: "Full Name", email: "Email", password: "Password", btn_login: "Log In", btn_signup: "Create Account",
    client_portal: "Client Portal", my_checks: "My Authentications", new_request: "New Request", hello: "Hello",
    welcome_dash: "Welcome to the system.", history: "History", brand: "Brand", item_type: "Item Type",
    model: "Model", model_placeholder: "e.g., Neverfull", optional: "Optional", select_brand: "Select brand...",
    select_type: "Select type...", step_1: "Step 1 of 3", step_2: "Step 2 of 3", step_3: "Step 3 of 3",
    continue_photos: "Continue to Photos", back: "Back to Site", continue_track: "Continue to Track", track_title: "Select Track",
    track_sub: "Choose turnaround time.", track_reg: "Standard", track_fast: "Fast Track", track_exp: "Express",
    hours_12: "12 Hours", hours_6: "6 Hours", hours_2: "2 Hours", recommended: "Recommended", coupon_label: "Coupon Code",
    coupon_placeholder: "Enter code", apply: "Apply", send_payment: "Pay Securely", send_free: "Submit Free",
    authentic: "Authentic", fake: "Counterfeit", pending_expert: "Under Review...", need_photos: "Photos Needed",
    business_pkg: "Business Packages", pkg_title: "Business Packages", pkg_sub: "Save up to 20%.",
    contact_sales: "Contact us on WhatsApp", success_title: "Request Submitted! 🎉",
    success_sub: "Item is under review. If paid, we will begin immediately.", btn_home: "Dashboard", btn_another: "Authenticate Another"
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
    default: return <Upload className={baseClasses} />;
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

const BRAND_MODELS = {
  "Louis Vuitton": ["Neverfull", "Speedy", "Alma", "Pochette Metis", "Keepall", "Capucines", "Onthego", "לא ידוע / Other"],
  "Chanel": ["Classic Flap", "Boy Bag", "19 Bag", "Gabrielle", "2.55 Reissue", "Wallet on Chain (WOC)", "לא ידוע / Other"],
  "Hermes": ["Birkin", "Kelly", "Constance", "Evelyne", "Picotin", "Lindy", "לא ידוע / Other"],
  "Dior": ["Lady Dior", "Saddle Bag", "Book Tote", "Diorama", "Caro", "לא ידוע / Other"],
  "Gucci": ["Marmont", "Dionysus", "Jackie", "Soho", "Sylvie", "לא ידוע / Other"],
  "Prada": ["Galleria", "Cleo", "Re-Edition", "Cahier", "לא ידוע / Other"],
  "Saint Laurent": ["Loulou", "College", "Sac de Jour", "Sunset", "Kate", "לא ידוע / Other"],
  "Celine": ["Luggage", "Triomphe", "Belt Bag", "Classic Box", "לא ידוע / Other"],
  "Fendi": ["Baguette", "Peekaboo", "Kan I", "לא ידוע / Other"],
  "Balenciaga": ["City", "Hourglass", "Le Cagole", "לא ידוע / Other"]
};

// Single, high-quality, stable background image
const HERO_BG_IMAGES = [
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=2000&q=80" // Gucci bag
];

// Ensure clean font styles
function GlobalStyles() {
  return <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap'); * { font-family: 'Assistant', system-ui, sans-serif !important; } .font-serif { font-family: 'Playfair Display', 'Assistant', serif !important; }`}} />;
}

// High-speed, aggressive compression. Returns Base64 immediately.
const compressImageToBase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600; // Small size for instant rendering and fast storage sync
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) { height = Math.round(height * MAX_WIDTH / width); width = MAX_WIDTH; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6)); 
      };
    };
  });
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [user, setUser] = useState(null); 
  const [role, setRole] = useState('client'); 
  const [showLanding, setShowLanding] = useState(true); 
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

  // Injects a Dynamic Favicon and Page Title
  useEffect(() => {
    document.title = "AUTHENTICATE YOUR BAG | LBI";
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    // Encode the LBI Logo into an SVG Favicon
    link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="100" fill="%231c1c1c"/><path d="M55 70 L75 120 L125 120 L145 70 Z" fill="none" stroke="%23d4af37" stroke-width="4" stroke-linejoin="round"/><rect x="75" y="70" width="50" height="50" fill="none" stroke="%23d4af37" stroke-width="4"/><path d="M85 70 C85 45, 115 45, 115 70" fill="none" stroke="%23d4af37" stroke-width="4"/></svg>';
  }, []);

  const handleLogout = () => { 
    if(auth) signOut(auth); 
    setUser(null); 
    setShowLanding(true); 
  };

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
        // Set role - Added robust toLowerCase() to prevent case-sensitivity bugs!
        setRole(currentUser.email && currentUser.email.toLowerCase().includes('admin') ? 'admin' : 'client');
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
    }, (error) => {
      console.error("Firestore Listen Error:", error);
      if (error.code === 'permission-denied') {
        alert("שגיאת אבטחה! המערכת מזהה שפיירבייס חוסם גישה למסד הנתונים. יש לוודא שעדכנת את ה-Rules של Firestore Database למצב מאושר.");
      }
    });
    return () => unsubscribe();
  }, [user, role]);

  const addRequest = async (newReqData) => { 
    if (!user || !db) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'auth_requests'), { 
        ...newReqData, clientId: user.uid, clientEmail: user.email || 'Anonymous', createdAt: Date.now() 
      });
      setCurrentView('dashboard'); 
    } catch (err) {
      console.error("Add Request Error:", err);
      alert("שגיאה חמורה בשמירת הנתונים: פיירבייס חוסם את הבקשה.\nכדי שזה יעבוד, היכנס עכשיו למסד הנתונים ב-Firebase -> Firestore Database -> Rules, ושנה את הגישה ל: allow read, write: if request.auth != null;");
      throw err; // מונע מסך הצלחה במקרה של שגיאה אמיתית בשרת
    }
  };
  
  const updateRequest = async (firestoreId, updates) => {
    if (!user || !db) return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'auth_requests', firestoreId), updates);
    } catch (err) {
      console.error("Update Request Error:", err);
      alert("שגיאה בעדכון מסד הנתונים בפיירבייס. בדוק Rules.");
    }
  };

  if (showLanding) {
    return (
      <>
        <GlobalStyles />
        <LandingPage 
          t={t} geo={geo} isRtl={isRtl} lang={lang} setLang={setLang} setGeo={setGeo} hideIsrael={hideIsrael} user={user}
          onGoToLogin={() => {
            setShowLanding(false);
            if (!user) setShowLoginModal(true);
          }}
          onLogout={handleLogout}
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
            t={t} isRtl={isRtl} lang={lang} setLang={setLang} hideIsrael={hideIsrael} 
            onBack={() => { setShowLoginModal(false); setShowLanding(true); }} 
            onLoginSuccess={() => setShowLoginModal(false)}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <div className="flex h-[100dvh] bg-slate-50 text-slate-900 font-sans overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
        {isMobileMenuOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />}
        <Sidebar 
           t={t} currentView={currentView} setCurrentView={(v) => { setCurrentView(v); setIsMobileMenuOpen(false); }} 
           role={role} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} 
           onLogout={handleLogout} hideIsrael={hideIsrael} onBackToSite={() => setShowLanding(true)}
        />
        <main className="flex-1 flex flex-col h-[100dvh] w-full overflow-hidden">
          <Header toggleMenu={() => setIsMobileMenuOpen(true)} role={role} t={t} />
          <div className="flex-1 overflow-y-auto flex flex-col p-4 md:p-8 pb-32">
            {role === 'admin' ? (
              <AuthenticationTool requests={systemRequests} updateRequest={updateRequest} hideIsrael={hideIsrael} />
            ) : currentView === 'new-request' ? (
              <NewAuthenticationRequest t={t} geo={geo} isRtl={isRtl} addRequest={addRequest} setView={setCurrentView} user={user} />
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
function LandingPage({ t, geo, isRtl, lang, setLang, onGoToLogin, setGeo, hideIsrael, user, onLogout }) {
  const [showDev, setShowDev] = useState(false);

  useEffect(() => { if (window.location.search.includes('dev=true')) setShowDev(true); }, []);

  const applyGeoSettings = (region) => {
    if (region === 'IL') { setGeo({ country: 'IL', currency: 'ILS', symbol: '₪' }); setLang('he'); }
    else if (region === 'US') { setGeo({ country: 'US', currency: 'USD', symbol: '$' }); setLang('en'); }
    else if (region === 'AE') { setGeo({ country: 'AE', currency: 'AED', symbol: 'د.إ' }); setLang('ar'); }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col" dir={isRtl ? "rtl" : "ltr"}>
      {showDev && (
        <div className="fixed bottom-4 left-4 bg-white p-2 rounded-xl shadow-2xl border border-slate-200 z-50 text-xs flex gap-2 font-sans" dir="ltr">
           <Globe size={16} className="text-slate-400"/>
           <button onClick={() => applyGeoSettings('IL')} className="hover:text-teal-600 font-bold">IL</button>|
           <button onClick={() => applyGeoSettings('US')} className="hover:text-teal-600 font-bold">US</button>|
           <button onClick={() => applyGeoSettings('AE')} className="hover:text-teal-600 font-bold">AE</button>
        </div>
      )}
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3"><BrandLogo className="w-12 h-12" hideIsrael={hideIsrael} /></div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} className="hidden md:flex items-center gap-1 text-xs font-bold text-white/70 hover:text-white transition-colors"><Globe size={14} /> {lang === 'he' ? 'EN' : 'HE'}</button>
            {user ? (
              <button onClick={onLogout} className="text-sm font-bold text-white/80 hover:text-red-400 transition-colors drop-shadow-md">
                {isRtl ? 'התנתק' : 'Logout'}
              </button>
            ) : (
              <button onClick={onGoToLogin} className="text-sm font-bold text-white hover:text-[#d4af37] transition-colors drop-shadow-md">
                {t('nav_login')}
              </button>
            )}
            <button onClick={onGoToLogin} className="bg-[#d4af37] text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-white transition-colors shadow-lg">
              {user ? t('client_portal') : t('nav_start')}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION WITH STATIC GUCCI BACKGROUND */}
      <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 bg-[#0a0a0a] overflow-hidden flex flex-col justify-center min-h-[85vh]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{ backgroundImage: `url('${HERO_BG_IMAGES[0]}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-transparent to-[#0a0a0a]/90 z-0"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center">
          
          <BrandLogo className="w-32 h-32 md:w-40 md:h-40 mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]" hideIsrael={hideIsrael} />
          
          {(!hideIsrael) && (
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 mb-8 shadow-lg backdrop-blur-sm">
               <Sparkles size={16} className="text-[#d4af37]" />
               <span className="text-[#d4af37] font-bold tracking-[0.15em] text-xs md:text-sm uppercase">{t('hero_badge')}</span>
            </div>
          )}
          
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight tracking-tighter drop-shadow-2xl font-serif" dangerouslySetInnerHTML={{ __html: t('hero_title') }}></h1>
          <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed mb-12" dangerouslySetInnerHTML={{ __html: hideIsrael ? t('hero_subtitle_global') : t('hero_subtitle_il') }}></p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <button onClick={onGoToLogin} className="w-full sm:w-auto bg-[#d4af37] hover:bg-white text-black font-black px-10 py-5 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all text-lg flex items-center justify-center gap-2 group">
              <ShieldCheck size={24} className="group-hover:scale-110 transition-transform" /> {user ? t('my_checks') : t('cta_primary')}
            </button>
            <a href="#how-it-works" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-sm font-bold px-10 py-5 rounded-full transition-colors text-lg flex items-center justify-center gap-2">
              {t('cta_secondary')}
            </a>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-[#0a0a0a] border-t border-white/10 py-10 relative z-20">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10 rtl:divide-x-reverse text-center">
            <div><p className="text-3xl md:text-4xl font-black text-[#d4af37] font-serif mb-1">+12,500</p><p className="text-xs text-slate-400 uppercase tracking-wider">{t('stats_items')}</p></div>
            <div><p className="text-3xl md:text-4xl font-black text-white font-serif mb-1">99.8%</p><p className="text-xs text-slate-400 uppercase tracking-wider">{t('stats_accuracy')}</p></div>
            <div><p className="text-3xl md:text-4xl font-black text-white font-serif mb-1">2-12</p><p className="text-xs text-slate-400 uppercase tracking-wider">{t('stats_speed')}</p></div>
            <div><p className="text-3xl md:text-4xl font-black text-white font-serif mb-1">+4,000</p><p className="text-xs text-slate-400 uppercase tracking-wider">{t('stats_clients')}</p></div>
         </div>
      </section>

      {/* TRUSTED BY */}
      <section className="bg-white py-12 border-b border-slate-100 shadow-sm z-20 relative">
        <p className="text-center text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-8">{t('trusted_by')}</p>
        <div className="flex justify-center flex-wrap gap-10 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
           <span className="font-black text-2xl tracking-widest font-serif">LOUIS VUITTON</span>
           <span className="font-black text-2xl tracking-widest font-serif">CHANEL</span>
           <span className="font-black text-2xl tracking-widest font-serif">HERMÈS</span>
           <span className="font-black text-2xl tracking-widest font-serif">DIOR</span>
           <span className="font-black text-2xl tracking-widest font-serif">GUCCI</span>
        </div>
      </section>

      {/* THE ISRAELI STANDARD (Split Section) */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
           <div className="w-full lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-serif leading-tight">{t('israeli_title')}</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">{t('israeli_desc')}</p>
              <div className="space-y-4">
                 <div className="flex items-start gap-4"><div className="mt-1 bg-teal-50 p-2 rounded-full text-teal-700"><Check size={20}/></div><p className="text-slate-700 font-medium">{t('israeli_point_1')}</p></div>
                 <div className="flex items-start gap-4"><div className="mt-1 bg-teal-50 p-2 rounded-full text-teal-700"><ShieldCheck size={20}/></div><p className="text-slate-700 font-medium">{t('israeli_point_2')}</p></div>
                 <div className="flex items-start gap-4"><div className="mt-1 bg-teal-50 p-2 rounded-full text-teal-700"><QrCode size={20}/></div><p className="text-slate-700 font-medium">{t('israeli_point_3')}</p></div>
              </div>
              <div className="mt-10 flex justify-start">
                 <button onClick={onGoToLogin} className="bg-[#0a0a0a] hover:bg-black text-[#d4af37] font-bold px-10 py-4 rounded-full shadow-xl text-lg flex items-center justify-center gap-2 transition-transform hover:scale-105">
                   <ShieldCheck size={20} /> {user ? t('client_portal') : t('cta_primary')}
                 </button>
              </div>
           </div>
           <div className="w-full lg:w-1/2 relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/30 to-transparent rounded-full blur-[80px] -z-10"></div>
              {/* Fallback to user's uploaded chanel or default bag */}
              <img 
                src="/shopping.webp" 
                onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80"; }}
                alt="Luxury Bag Authentication" 
                className="relative z-10 rounded-3xl shadow-2xl object-cover h-[400px] md:h-[500px] w-full max-w-md border-4 border-white/10" 
              />
              <div className="absolute -bottom-6 -left-6 md:-left-10 bg-white p-5 md:p-6 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-4 animate-bounce z-20">
                 <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle size={28}/></div>
                 <div><p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wider">Status</p><p className="text-lg md:text-xl font-black text-slate-900">100% Authentic</p></div>
              </div>
           </div>
        </div>
      </section>

      {/* WHY US (Glass Cards) */}
      <section className="py-24 bg-[#0a0a0a] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-900/20 rounded-full blur-[100px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-serif">{t('why_us')}</h2>
            <div className="w-24 h-1 bg-[#d4af37] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-all hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-[#d4af37]/20 rounded-2xl flex items-center justify-center text-[#d4af37] mb-8 group-hover:scale-110 transition-transform"><Cpu size={32} /></div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('why_1_title')}</h3>
              <p className="text-slate-400 leading-relaxed text-lg">{t('why_1_desc')}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-all hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-[#d4af37]/20 rounded-2xl flex items-center justify-center text-[#d4af37] mb-8 group-hover:scale-110 transition-transform"><Award size={32} /></div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('why_2_title')}</h3>
              <p className="text-slate-400 leading-relaxed text-lg">{t('why_2_desc')}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-all hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-[#d4af37]/20 rounded-2xl flex items-center justify-center text-[#d4af37] mb-8 group-hover:scale-110 transition-transform"><Shield size={32} /></div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('why_3_title')}</h3>
              <p className="text-slate-400 leading-relaxed text-lg">{t('why_3_desc')}</p>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
             <button onClick={onGoToLogin} className="bg-white text-[#0a0a0a] font-bold px-10 py-4 rounded-full shadow-xl text-lg flex items-center justify-center gap-2 transition-transform hover:scale-105">
               <CheckCircle size={20} /> {user ? t('client_portal') : (isRtl ? 'התחילו אימות עכשיו' : 'Start Authentication')}
             </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-serif">{t('how_title')}</h2>
            <div className="w-24 h-1 bg-slate-900 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-slate-200 -z-10"></div>
             
             <div className="text-center relative z-10 group">
                <div className="w-32 h-32 mx-auto bg-white border-4 border-slate-100 group-hover:border-[#d4af37] text-slate-800 rounded-full flex items-center justify-center mb-8 shadow-xl transition-colors relative">
                   <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#d4af37] text-black font-black flex items-center justify-center rounded-full text-lg">1</div>
                   <Camera size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('how_1_title')}</h3>
                <p className="text-slate-600 text-lg px-4">{t('how_1_desc')}</p>
             </div>
             
             <div className="text-center relative z-10 group">
                <div className="w-32 h-32 mx-auto bg-white border-4 border-slate-100 group-hover:border-[#d4af37] text-slate-800 rounded-full flex items-center justify-center mb-8 shadow-xl transition-colors relative">
                   <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#d4af37] text-black font-black flex items-center justify-center rounded-full text-lg">2</div>
                   <Search size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('how_2_title')}</h3>
                <p className="text-slate-600 text-lg px-4">{t('how_2_desc')}</p>
             </div>
             
             <div className="text-center relative z-10 group">
                <div className="w-32 h-32 mx-auto bg-[#0a0a0a] border-4 border-[#0a0a0a] group-hover:border-[#d4af37] text-[#d4af37] rounded-full flex items-center justify-center mb-8 shadow-xl transition-colors relative">
                   <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#d4af37] text-black font-black flex items-center justify-center rounded-full text-lg">3</div>
                   <FileText size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('how_3_title')}</h3>
                <p className="text-slate-600 text-lg px-4">{t('how_3_desc')}</p>
             </div>
          </div>
          
          <div className="mt-20 text-center">
            <button onClick={onGoToLogin} className="bg-slate-900 hover:bg-black text-white font-bold px-12 py-5 rounded-full shadow-2xl text-xl flex items-center justify-center gap-3 mx-auto transition-transform hover:scale-105">
               {user ? t('client_portal') : t('nav_start')} <ArrowRight size={24} className={`inline ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* REVIEWS (Social Proof) */}
      <section className="bg-[#fafafa] py-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
           <h2 className="text-3xl font-black text-center text-slate-900 mb-12 font-serif">{t('reviews_title')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: isRtl ? 'שירן כ.' : 'Shiran C.', text: isRtl ? 'הצילו אותי מקניית זיוף ב-8,000 ש"ח! שירות מהיר, מקצועי ואמין. התעודה הגיעה תוך כמה שעות.' : 'Saved me from buying a fake! Fast, professional and reliable.', stars: 5 },
                { name: isRtl ? 'נופר א.' : 'Nofar A.', text: isRtl ? 'מוכרת תיקים רק עם התעודה שלהם. זה נותן ביטחון מלא לקונות שלי ומונע ויכוחים על מקוריות.' : 'I only sell bags with their certificate. Gives my buyers 100% confidence.', stars: 5 },
                { name: isRtl ? 'מיכל ד.' : 'Michal D.', text: isRtl ? 'רמה של חו"ל. מדהים שיש סוף סוף שירות כזה ברמה כל כך גבוהה בישראל. ממליצה בחום!' : 'World-class standard. Amazing to finally have this level of service locally.', stars: 5 }
              ].map((rev, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                   <div className="flex gap-1 mb-4 text-[#d4af37]">{[...Array(rev.stars)].map((_,j)=><Star key={j} size={20} fill="currentColor" />)}</div>
                   <p className="text-slate-600 mb-6 text-lg italic">"{rev.text}"</p>
                   <p className="font-bold text-slate-900">- {rev.name}</p>
                </div>
              ))}
           </div>
           
           <div className="mt-16 flex justify-center">
             <button onClick={onGoToLogin} className="bg-[#0a0a0a] hover:bg-black text-[#d4af37] font-bold px-10 py-4 rounded-full shadow-xl text-lg flex items-center justify-center gap-2 transition-transform hover:scale-105">
               <ShieldCheck size={20} /> {user ? t('client_portal') : t('nav_start')}
             </button>
           </div>
        </div>
      </section>
      
      {/* B2B / BUSINESS PACKAGES SECTION */}
      <section className="bg-[#0a0a0a] text-white py-20 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/20 to-transparent opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div>
             <h2 className="text-3xl md:text-4xl font-black mb-4 font-serif">{t('b2b_title') || 'בעלי בוטיק? הצטרפו לתוכנית העסקים'}</h2>
             <p className="text-slate-400 text-lg max-w-xl">רכשו חבילות אימות בכמות גדולה, חסכו עד 20% וקבלו מסלול אקספרס ישיר לצוות המומחים שלנו.</p>
           </div>
           <button onClick={() => window.open('https://wa.me/972540000000?text=שלום, אשמח לשמוע פרטים על חבילות אימות לעסקים', '_blank')} className="bg-[#d4af37] text-black font-black px-8 py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-white transition-colors w-full md:w-auto whitespace-nowrap">
              <Briefcase size={20} /> {isRtl ? 'דברו איתנו בוואטסאפ' : 'Contact via WhatsApp'}
           </button>
        </div>
      </section>

      <footer className="bg-black text-slate-400 py-12 border-t border-white/5">
         <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center">
            <BrandLogo className="w-20 h-20 mb-6 opacity-30 grayscale" hideIsrael={hideIsrael} />
            <p className="text-sm mb-2">&copy; {new Date().getFullYear()} LUXURY BAGS{hideIsrael ? '' : ' ISRAEL'}. All rights reserved.</p>
            <p className="text-xs text-slate-600">Powered by Hybrid AI & Expert Authenticators</p>
         </div>
      </footer>
    </div>
  );
}

// ==========================================
// LOGIN SCREEN
// ==========================================
function LoginScreen({ onBack, onLoginSuccess, t, isRtl, lang, setLang, hideIsrael }) {
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
      onLoginSuccess();
    } catch (err) {
      console.error("Auth error:", err);
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
      onLoginSuccess();
    } catch (err) {
      console.error("Social login error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg(isRtl ? "ההתחברות בוטלה על ידי המשתמש." : "Login cancelled.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setErrorMsg(isRtl ? "הדומיין לא מאושר. הוסף את הכתובת הנוכחית ב-Firebase -> Authentication -> Settings -> Authorized domains." : "Unauthorized domain. Add to Firebase settings.");
      } else {
        setErrorMsg(isRtl ? `שגיאה: ${err.message}` : `Login failed: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white relative overflow-x-hidden">
      <div className={`absolute top-6 ${isRtl ? 'right-6' : 'left-6'} z-50`}>
         <button onClick={onBack} className="flex items-center gap-1 text-slate-500 hover:text-slate-900 font-bold text-sm bg-white/80 px-3 py-1.5 rounded-full shadow-sm"><ChevronLeft size={16} className={isRtl ? 'rotate-180' : ''} /> {t('back') || 'חזור'}</button>
      </div>
      <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} z-50`}>
        <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-slate-200 md:border-white/30 text-slate-800 md:text-white px-4 py-2 rounded-full font-bold text-xs shadow-sm hover:bg-white/30"><Globe size={14} /> {lang === 'he' ? 'EN' : 'עברית'}</button>
      </div>
      <div className="hidden md:flex md:w-1/2 relative bg-[#0a0a0a] items-center justify-center overflow-hidden pt-12">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url('${HERO_BG_IMAGES[0]}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-0"></div>
        <div className="relative z-10 flex flex-col items-center text-center p-12 animate-in fade-in duration-1000">
          <BrandLogo className="w-40 h-40 mb-8 drop-shadow-2xl" hideIsrael={hideIsrael} />
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-4 leading-tight tracking-tighter drop-shadow-lg font-serif" dangerouslySetInnerHTML={{ __html: t('hero_title') }}></h1>
          <p className="text-[#d4af37] text-lg max-w-md font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: hideIsrael ? t('hero_subtitle_global') : t('hero_subtitle_il') }}></p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-24 bg-white relative">
        <div className="md:hidden flex flex-col items-center mb-10 mt-12">
          <BrandLogo className="w-24 h-24 mb-4" hideIsrael={hideIsrael} />
          <h1 className="text-3xl font-black text-slate-900 text-center tracking-tight leading-tight font-serif" dangerouslySetInnerHTML={{ __html: t('hero_title') }}></h1>
        </div>
        <div className="w-full max-w-sm mx-auto animate-in slide-in-from-bottom-8 fade-in duration-700">
          {!showAdminLogin ? (
            <>
              <div className="mb-8"><h2 className="text-2xl font-bold text-slate-900 mb-2">{isSignUp ? t('signup_title') : t('welcome')}</h2><p className="text-slate-500 text-sm">{isSignUp ? t('signup_sub') : t('welcome_sub')}</p></div>
              <div className="space-y-3 mb-4">
                <button type="button" onClick={() => handleSocialLogin(new GoogleAuthProvider())} className="w-full bg-white border border-slate-200 text-slate-700 font-medium py-3 px-4 rounded-xl shadow-sm hover:bg-slate-50 flex items-center justify-center gap-3"><GoogleIcon className="w-5 h-5" /> {t('continue_google')}</button>
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
                {errorMsg && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{errorMsg}</div>}
                <button type="submit" disabled={isLoading} className="w-full bg-[#0a0a0a] hover:bg-black text-[#d4af37] font-bold py-3.5 rounded-xl shadow-md mt-2 disabled:opacity-50">{isLoading ? "..." : (isSignUp ? t('btn_signup') : t('btn_login'))}</button>
              </form>
            </>
          ) : (
            <div className="animate-in fade-in zoom-in-95">
              <div className="mb-8"><h2 className="text-2xl font-bold text-slate-900 mb-2">Admin / Team Access</h2><p className="text-slate-500 text-sm">Secured AI & Backoffice Gateway</p></div>
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4" placeholder="Admin Email" required />
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4" placeholder="Password" required />
                {errorMsg && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{errorMsg}</div>}
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
function Sidebar({ t, currentView, setCurrentView, role, isOpen, onClose, onLogout, hideIsrael, onBackToSite }) {
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
          <button key={item.id} onClick={() => setCurrentView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${currentView === item.id ? 'bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] shadow-sm' : 'hover:bg-white/5 hover:text-white'}`}>{item.icon} <span className="font-medium text-sm">{item.label}</span></button>
        ))}
        <div className="my-4 border-t border-slate-800"></div>
        <button onClick={onBackToSite} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all hover:bg-white/5 hover:text-white`}>
          <Globe size={20} /> <span className="font-medium text-sm">{t('back') || 'חזרה לאתר'}</span>
        </button>
      </nav>
      <div className="p-4 border-t border-slate-800 bg-black/20"><div className="flex items-center justify-between"><button onClick={onLogout} className="text-slate-500 hover:text-red-400 p-2 transition-colors flex items-center gap-2 text-sm"><LogOut size={18} className={t('hello')==='שלום' ? 'transform rotate-180' : ''} /> התנתקות</button></div></div>
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
      <div className="bg-[#0a0a0a] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-[#d4af37]/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-[50px] -z-10"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-black mb-2 font-serif">{t('hello')}! 👋</h2><p className="text-slate-400 text-sm mb-8">{t('welcome_dash')}</p>
          <button onClick={() => setView('new-request')} className="bg-[#d4af37] text-black font-bold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm w-full md:w-auto justify-center hover:bg-white transition-colors"><PlusCircle size={18} /> {t('new_request')}</button>
        </div>
      </div>
      <div>
        <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2"><Clock size={18} className="text-[#d4af37]" /> {t('history')}</h3>
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.firestoreId || req.id} onClick={() => req.status === 'completed' && onSelectCert(req)} className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 ${req.status === 'completed' ? 'cursor-pointer hover:shadow-md active:scale-[0.99] hover:border-[#d4af37]/50 transition-all' : 'opacity-90'}`}>
              <img src={req.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=200&q=80'} alt={req.brand} className="w-16 h-16 rounded-xl object-cover border border-slate-100" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1"><h4 className="font-bold text-slate-800 text-sm truncate">{req.brand}</h4><span className="text-[10px] text-slate-400">{req.date}</span></div>
                <p className="text-xs text-slate-500 truncate mb-2">{req.model} • {req.id}</p>
                {req.status === 'completed' ? (<span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border ${req.result === 'authentic' ? 'bg-green-50 text-green-700 border-green-100' : req.result === 'refunded' ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-red-50 text-red-700 border-red-100'}`}>{req.result === 'authentic' ? <><CheckCircle size={12} /> {t('authentic')}</> : req.result === 'refunded' ? <><X size={12}/> בוטל</> : <><XCircle size={12} /> {t('fake')}</>}</span>) : req.status === 'pending_payment' ? (<span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-[10px] font-bold border border-blue-200"><CreditCard size={12} /> ממתין לתשלום</span>) : req.status === 'waiting_for_customer' ? (<span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-[10px] font-bold border border-amber-100"><AlertCircle size={12} /> {t('need_photos')}</span>) : (<span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold border border-slate-200"><Clock size={12} /> {t('pending_expert')}</span>)}
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

  // Divide requests into pending and completed for Admin history view
  const pendingRequests = requests.filter(r => r.status !== 'completed' && r.status !== 'refunded');
  const completedRequests = requests.filter(r => r.status === 'completed' || r.status === 'refunded');

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
  
  const togglePartSelection = (id) => setSelectedParts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);

  if (!activeReq) {
    return (
      <div className="max-w-6xl mx-auto animate-in fade-in pb-24" dir="rtl">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-6">
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
            <h3 className="text-slate-500 text-xs md:text-sm font-medium mb-1">בקשות ממתינות לבדיקה</h3>
            <p className="text-2xl md:text-3xl font-bold text-slate-800">{pendingRequests.length}</p>
          </div>
          <div className="bg-teal-900 p-4 md:p-6 rounded-2xl shadow-md text-white col-span-2 md:col-span-2 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-teal-100 text-xs md:text-sm font-medium mb-1">סטטוס מנוע AI Core</h3>
              <p className="text-xl md:text-2xl font-bold flex items-center gap-2">מערכת יציבה ופעילה</p>
              <p className="text-xs text-teal-200 mt-2">סה"כ רשומות במסד הנתונים: {requests.length}</p>
            </div>
            <BrandLogo className="absolute top-0 left-0 w-48 h-48 opacity-10 transform -translate-x-1/4 -translate-y-1/4" hideIsrael={hideIsrael} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-6">תור משימות לבדיקה</h2>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-500">אין בקשות פתוחות כרגע. הכל נבדק!</p>
              {requests.length === 0 && <p className="text-xs text-slate-400 mt-2">(אם העלית בקשה כרגע, ודא שאתה מחובר באותה סביבת עבודה בדיוק - Vercel או Canvas)</p>}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingRequests.map(req => (
                <div key={req.firestoreId || req.id} onClick={() => startReviewing(req)} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer group">
                  <div className="flex items-center gap-4"><img src={req.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=200&q=80'} alt={req.brand} className="w-12 h-12 rounded object-cover border border-slate-200" /><div><h4 className="font-bold text-slate-800 text-sm">{req.brand} <span className="text-xs text-slate-500 font-normal">{req.model}</span></h4><p className="text-xs text-slate-500">{req.id} • <span className="font-bold">{req.paymentTrack}</span></p></div></div>
                  <div className="flex items-center gap-3"><span className={`text-[10px] px-2 py-1 rounded-full font-bold ${req.status === 'waiting_for_customer' ? 'bg-amber-100 text-amber-700' : req.status === 'pending_payment' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>{req.status === 'waiting_for_customer' ? 'ממתין לתמונות' : req.status === 'pending_payment' ? 'ממתין לתשלום' : 'ממתין ל-AI'}</span><button className="text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100">פתח תיק <ArrowRight size={14} className="inline ml-1"/></button></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ADMIN HISTORY VIEW */}
        {completedRequests.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Clock size={20}/> היסטוריית בדיקות עבר</h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden opacity-80">
              <div className="divide-y divide-slate-100">
                {completedRequests.map(req => (
                  <div key={req.firestoreId || req.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4"><img src={req.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=200&q=80'} alt={req.brand} className="w-12 h-12 rounded object-cover border border-slate-200 grayscale" /><div><h4 className="font-bold text-slate-800 text-sm">{req.brand} <span className="text-xs text-slate-500 font-normal">{req.model}</span></h4><p className="text-xs text-slate-500">{req.id} • {new Date(req.createdAt).toLocaleDateString('he-IL')}</p></div></div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold border ${req.result === 'authentic' ? 'bg-green-50 text-green-700 border-green-100' : req.result === 'refunded' ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-red-50 text-red-700 border-red-100'}`}>
                        {req.result === 'authentic' ? 'מקורי' : req.result === 'refunded' ? 'בוטל/זוכה' : 'מזויף'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 animate-in fade-in duration-500" dir="rtl">
      <button onClick={() => setSelectedReqId(null)} className="text-slate-500 font-medium hover:text-slate-800 flex items-center gap-1 mb-2"><ChevronRight size={18} /> חזור לתור המשימות</button>
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4"><img src={activeReq.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=200&q=80'} className="w-16 h-16 rounded-xl border border-slate-200 object-cover" /><div><h2 className="font-bold text-slate-800 text-lg">בקשה {activeReq.id}</h2><p className="text-sm text-slate-500">{activeReq.brand} • מסלול: <span className="font-bold text-red-500">{activeReq.paymentTrack}</span></p></div></div>
        <div className={`flex items-center gap-3 px-5 py-3 rounded-xl font-mono text-2xl font-bold border-2 shadow-inner ${activeReq.status === 'waiting_for_customer' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-900 text-teal-400 border-slate-800'}`}><span dir="ltr">{formatTime(timeLeft)}</span>{activeReq.status === 'waiting_for_customer' ? <PauseCircle size={24} /> : <Timer size={24} className="animate-pulse" />}</div>
      </div>

      {activeReq.status === 'pending' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm"><h2 className="text-xl font-bold text-slate-800 mb-2">שלב 1: סריקת AI</h2><button onClick={simulateAIAnalysis} disabled={isAnalyzing} className="px-6 py-3.5 bg-teal-800 text-white rounded-xl font-bold flex gap-2">{isAnalyzing ? 'מנתח...' : 'הפעל סריקה'}</button></div>
      )}

      {(activeReq.status === 'reviewing' || activeReq.status === 'waiting_for_customer' || activeReq.status === 'pending_payment') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-[#1c1c1c] p-4 text-white flex justify-between items-center"><h3 className="font-bold flex items-center gap-2 text-sm text-[#d4af37]"><CheckCircle size={18} className="mr-1" /> ממצאי סריקת ה-AI</h3><span className="bg-white/10 px-3 py-1 rounded-full text-xs">ודאות: {activeReq.confidence || 'ממתין'}</span></div>
              <div className="p-5 md:p-6 space-y-6">
                <div><h4 className="text-xs font-bold text-slate-400 uppercase mb-2">המלצת המערכת</h4><div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm whitespace-pre-wrap">{activeReq.aiDraftResponse || 'ממתין לבדיקה'}</div></div>
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="font-black text-slate-800 mb-4 text-lg">החלטת מומחה סופית</h4>
                  <div className="flex gap-3 mb-4"><button onClick={() => handleIssueCertificate('authentic')} disabled={activeReq.status === 'waiting_for_customer' || activeReq.status === 'pending_payment'} className="flex-1 py-4 bg-green-50 text-green-800 font-bold rounded-xl disabled:opacity-50"><ShieldCheck className="inline mr-2"/>אשר כמקורי</button><button onClick={() => handleIssueCertificate('fake')} disabled={activeReq.status === 'waiting_for_customer' || activeReq.status === 'pending_payment'} className="flex-1 py-4 bg-red-50 text-red-800 font-bold rounded-xl disabled:opacity-50"><ShieldAlert className="inline mr-2"/>פסול כמזויף</button></div>
                  <div className="flex gap-4 border-t border-slate-100 pt-4 mt-2"><button onClick={() => setShowCancelModal(true)} className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline">לא ניתן לאימות? בטל וזכה לקוח</button></div>
                </div>
              </div>
            </div>
            
            {/* ADMIN IMAGE GALLERY */}
            {activeReq.images && Object.keys(activeReq.images).length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-5">
                <h3 className="font-bold text-slate-800 mb-4">תמונות הלקוח ({Object.keys(activeReq.images).length})</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(activeReq.images).map(([part, url]) => (
                    <div key={part} className="relative group">
                       <img src={url} alt={part} className="w-full h-24 object-cover border border-slate-200 rounded" />
                       <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm">{part}</span>
                       <a href={url} target="_blank" className="absolute inset-0 bg-black/0 hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100"><Search className="text-white w-6 h-6" /></a>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                  <div className="text-center"><div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-500 animate-pulse"><Clock size={28} /></div><h4 className="font-bold text-amber-600 mb-2">ממתין לתמונות מהלקוח</h4><p className="text-xs text-slate-500 mb-2">הלקוח קיבל מייל ויכול להעלות את התמונות מהאזור האישי שלו.</p></div>
                )}
                {activeReq.status === 'pending_payment' && (
                  <div className="text-center"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-500 animate-pulse"><CreditCard size={28} /></div><h4 className="font-bold text-blue-600 mb-2">ממתין לאישור תשלום</h4><p className="text-xs text-slate-500 mb-2">ברגע שהלקוח יאשר את התשלום במיניסייט, הבקשה תשתחרר אוטומטית לבדיקה.</p>
                    <button onClick={() => updateRequest(activeReq.firestoreId || activeReq.id, { status: 'pending' })} className="mt-4 w-full py-2 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-200">עקוף ידנית ואשר תשלום</button>
                  </div>
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
