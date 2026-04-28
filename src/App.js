/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, AlertCircle, CheckCircle, ChevronRight, ChevronLeft,
  LayoutDashboard, Menu, X, PlusCircle, Clock, Camera, FileText, Upload, Mail,
  QrCode, Shield, ShieldCheck, ShieldAlert, AlertTriangle, Smartphone, XCircle,
  Timer, PauseCircle, ImagePlus, PlayCircle, LogOut, ArrowRight, Globe,
  Briefcase, RefreshCcw, HandCoins, Cpu, Award, Zap, Star, Sparkles, Check, CreditCard, Share2
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { 
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, signOut, signInAnonymously, signInWithCustomToken,
  GoogleAuthProvider, signInWithPopup
} from 'firebase/auth';
import { 
  getFirestore, collection, addDoc, updateDoc, doc, onSnapshot, getDocs, runTransaction 
} from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// ==========================================
// WATCHDOG (ERROR BOUNDARY)
// ==========================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 WATCHDOG CAUGHT AN ERROR:", error, errorInfo);
    this.setState({ errorInfo, error });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa] p-6 font-sans" dir="rtl">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-red-100 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-2 bg-red-500"></div>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-3">מערכת ה-Watchdog הופעלה</h1>
            <p className="text-slate-600 mb-6 text-sm">זיהינו בעיה בקוד. מנגנון ההגנה בלם אותה מלקרוס לחלוטין.</p>
            <div className="bg-slate-900 text-red-400 p-4 rounded-xl text-left text-xs font-mono overflow-auto h-32 mb-6 shadow-inner" dir="ltr">
              {this.state.error && this.state.error.toString()}
            </div>
            <button onClick={() => window.location.reload()} className="w-full bg-[#0a0a0a] text-white font-bold py-4 rounded-xl hover:bg-black transition-colors shadow-lg">
              רענן ונסה שוב
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
// TRANSLATIONS & CONSTANTS
// ==========================================
const translations = {
  he: {
    nav_login: "התחברות", nav_start: "התחילו אימות", 
    hero_badge: "פיתוח כחול-לבן 🇮🇱 | הראשון מסוגו בישראל",
    hero_title: "השקט הנפשי שלך.<br />המומחיות שלנו.",
    hero_subtitle_il: "אנו משלבים בינה מלאכותית מתקדמת עם עין אנושית של מומחי יוקרה כדי להבטיח שהפריט שלך – מקורי ב-100%. הסטנדרט העולמי, עכשיו בישראל.",
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
    success_sub: "הבקשה הועברה לבדיקה. במידה וביצעת תשלום, נתחיל בבדיקה מיד.", btn_home: "מסך ראשי", btn_another: "אימות נוסף",
    serial_number: "מספר סידורי (אופציונלי)", serial_placeholder: "לדוגמה: AB123456"
  },
  en: {
    nav_login: "Login", nav_start: "Start Auth", 
    hero_badge: "Global Standard | Premium Service",
    hero_title: "ZERO COMPROMISE.<br />ZERO FAKES.",
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
    success_sub: "Item is under review. If paid, we will begin immediately.", btn_home: "Dashboard", btn_another: "Authenticate Another",
    serial_number: "Serial Number (Optional)", serial_placeholder: "e.g., AB123456"
  }
};

const LUXURY_BRANDS = ["Louis Vuitton", "Chanel", "Hermes", "Dior", "Gucci", "Prada", "Saint Laurent", "Celine", "Fendi", "Balenciaga", "Rolex", "Cartier"];
const ITEM_TYPES = ["Bag/תיק", "Clothing/בגד", "Shoes/נעליים", "Accessories/אקססוריז", "Watch/שעון"];
const BAG_PARTS = [
  { id: 'front', iconType: 'front' }, { id: 'inside', iconType: 'inside' },
  { id: 'base', iconType: 'base' }, { id: 'date-code', iconType: 'date-code' },
  { id: 'zipper', iconType: 'zipper' }, { id: 'buckle-front', iconType: 'buckle-front' },
  { id: 'buckle-back', iconType: 'buckle-back' }, { id: 'metal-stamp', iconType: 'metal-stamp' }
];

const BRAND_MODELS = {
  "Louis Vuitton": ["Neverfull", "Speedy", "Alma", "Pochette Metis", "Keepall", "Capucines", "Onthego", "Noé", "Multi Pochette", "Diane", "Coussin", "Loop", "Twist", "Bumbag", "Dauphine", "לא ידוע / Other"],
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

const HERO_BG_IMAGES = ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=2000&q=80"];

// ==========================================
// ICONS & UI HELPERS
// ==========================================
function InstagramIcon({ size = 24, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

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
    <div className="relative flex items-center justify-center" style={{ width: '80px', height: '80px' }}>
      <div className="absolute inset-0 border-4 border-slate-200 rounded-full opacity-50" style={{ borderStyle: 'double' }}></div>
      <div className="absolute inset-2 border border-slate-300 rounded-full"></div>
      <div className="text-center">
        <p className="font-black tracking-widest text-slate-400 uppercase m-0 p-0" style={{ fontSize: '7px' }}>Certified By</p>
        <p className="font-bold text-[#1c1c1c] tracking-wider m-0 p-0" style={{ fontSize: '11px', marginTop: '2px' }}>LBI</p>
        <p className="font-bold text-[#d4af37] tracking-[0.2em] uppercase m-0 p-0" style={{ fontSize: '6px', marginTop: '2px' }}>Est. 2016</p>
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

// ==========================================
// STYLES FOR FLAWLESS PRINTING
// ==========================================
function GlobalStyles() {
  return <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;600;700;800;900&display=swap'); 
    * { font-family: 'Assistant', system-ui, sans-serif !important; }
    
    @media print {
      @page { size: A4 portrait; margin: 0; }
      
      /* Hide absolutely everything initially */
      body * { visibility: hidden !important; }
      
      /* Only show the dedicated print certificate */
      .print-certificate-a4, .print-certificate-a4 * { 
        visibility: visible !important; 
      }
      
      /* Strip down backgrounds and margins of outer wrappers */
      html, body, #root { 
        margin: 0 !important; 
        padding: 0 !important; 
        background-color: white !important; 
      }
      
      /* Force the dedicated certificate perfectly into the top-left of the A4 page */
      .print-certificate-a4 {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 210mm !important;
        height: 297mm !important; 
        margin: 0 !important;
        padding: 0 !important;
        background-color: white !important;
        box-sizing: border-box !important;
        z-index: 999999 !important;
        page-break-inside: avoid !important;
      }

      main, .flex, .flex-1, .overflow-y-auto, .overflow-hidden, .cert-view-container {
        display: block !important;
        height: auto !important;
        min-height: 0 !important;
        width: auto !important;
        max-width: none !important;
        overflow: visible !important;
        position: static !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        transform: none !important;
      }
      
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }
  `}} />;
}

// Helper Functions
const compressImageToBase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600; 
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

const sendTelegramFrontendAlert = async (reqId, brand, model, paymentTrack) => {
  const token = "8628800853:AAGwwiVHEii4ao5PO93sWN9755BiQkijDH8";
  const chatId = "6397836431";
  const message = `💰 <b>התקבלה בקשת אימות חדשה!</b>\n\n<b>מזהה:</b> #${reqId}\n<b>מותג:</b> ${brand}\n<b>דגם:</b> ${model || 'לא צוין'}\n<b>מסלול:</b> ${paymentTrack}\n\nהיכנס למערכת כדי להתחיל בבדיקה.`;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
    });
  } catch (err) {
    console.error("Telegram alert failed silently", err);
  }
};

// ==========================================
// DEDICATED PRINT TEMPLATE
// ==========================================
function PrintOnlyView({ data, hideIsrael }) {
  if (!data) return null;
  const isAuthentic = data.result === 'authentic';
  const imagesToDisplay = data.images ? Object.entries(data.images).slice(0, 4) : [];
  const verifyUrl = `${window.location.origin}${window.location.pathname}?verify=${data.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}&margin=0`;

  return (
    <div className="hidden print:block print-certificate-a4 bg-white" dir="rtl">
      <div style={{ width: '210mm', height: '296mm', margin: '0 auto', boxSizing: 'border-box', padding: '10mm' }}>
        <div style={{ width: '100%', height: '100%', border: '8px solid #0a0a0a', padding: '4mm', boxSizing: 'border-box' }}>
          <div style={{ width: '100%', height: '100%', border: '2px solid #d4af37', padding: '8mm', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative', backgroundColor: 'white', overflow: 'hidden' }}>
            
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.03, pointerEvents: 'none' }}>
              <BrandLogo className="" style={{ width: '160mm', height: '160mm' }} hideIsrael={hideIsrael} />
            </div>
            
            <div style={{ position: 'absolute', top: '6mm', right: '6mm', textAlign: 'right' }}>
               <p style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '0.1em', color: '#94a3b8', textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>Certificate No.</p>
               <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', fontFamily: 'monospace', letterSpacing: '0.05em', margin: 0, marginTop: '2px', lineHeight: 1 }}>{data.id}</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8mm', paddingTop: '6mm', position: 'relative', zIndex: 10 }}>
              <BrandLogo className="" style={{ width: '20mm', height: '20mm', marginBottom: '3mm' }} hideIsrael={hideIsrael} />
              <h1 style={{ fontSize: '28px', fontFamily: 'serif', letterSpacing: '0.1em', color: '#0a0a0a', textTransform: 'uppercase', margin: 0, marginBottom: '2px', lineHeight: 1 }}>Certificate of Authentication</h1>
              <p style={{ color: '#d4af37', fontWeight: 'bold', letterSpacing: '0.4em', fontSize: '10px', textTransform: 'uppercase', margin: 0 }}>Luxury Bags Israel</p>
            </div>
            
            <div style={{ width: '100%', padding: '4mm 0', marginBottom: '8mm', borderTop: '2px solid #e2e8f0', borderBottom: '2px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', backgroundColor: isAuthentic ? '#f0fdf4' : '#fef2f2', borderColor: isAuthentic ? '#bbf7d0' : '#fecaca', color: isAuthentic ? '#166534' : '#991b1b', position: 'relative', zIndex: 10 }}>
                {isAuthentic ? <ShieldCheck size={28} /> : <ShieldAlert size={28} />}
                <h2 style={{ fontSize: '22px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, lineHeight: 1 }}>{isAuthentic ? 'Authentic' : 'Counterfeit'}</h2>
            </div>
            
            <div style={{ width: '100%', maxWidth: '140mm', margin: '0 auto', marginBottom: '8mm', position: 'relative', zIndex: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '4mm', textAlign: 'left', borderBottom: '1px solid #e2e8f0', paddingBottom: '5mm', marginBottom: '5mm' }} dir="ltr">
                <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Brand</div>
                <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '15px', lineHeight: 1 }}>{data.brand}</div>
                
                <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Model</div>
                <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '15px', lineHeight: 1 }}>{data.model}</div>
                
                {data.serialNumber && (
                  <>
                    <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Serial Number</div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '15px', lineHeight: 1 }}>{data.serialNumber}</div>
                  </>
                )}
                
                <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Date Inspected</div>
                <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '15px', lineHeight: 1 }}>{new Date(data.createdAt).toLocaleDateString('en-GB')}</div>
              </div>
              <p style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic', textAlign: 'center', maxWidth: '120mm', margin: '0 auto', lineHeight: 1.5 }}>This item has been rigorously inspected by our experts combining decades of human experience and advanced AI protocols.</p>
            </div>
            
            <div style={{ width: '100%', position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #e2e8f0', paddingBottom: '2mm', marginBottom: '4mm', textAlign: 'left', margin: 0 }} dir="ltr">Inspected Elements</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '4mm', width: '100%' }}>
                {imagesToDisplay.map(([part, url]) => (
                   <div key={part} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <img src={url} alt={part} style={{ width: '100%', height: '22mm', objectFit: 'cover', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                      <span style={{ marginTop: '2mm', fontSize: '9px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{part}</span>
                   </div>
                ))}
                {imagesToDisplay.length === 0 && (
                   <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                     <img src={data.image} style={{ width: '60mm', height: '22mm', objectFit: 'cover', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                     <span style={{ marginTop: '2mm', fontSize: '9px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>MAIN</span>
                   </div>
                )}
              </div>
            </div>
            
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 10, marginTop: 'auto', paddingTop: '4mm', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ textAlign: 'left', paddingBottom: '4px' }} dir="ltr"><CertificateStamp /></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'white', padding: '4px', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '4px' }}>
                  <img src={qrCodeUrl} alt="QR Code" style={{ width: '14mm', height: '14mm', objectFit: 'contain', mixBlendMode: 'multiply' }} crossOrigin="anonymous" />
                </div>
                <p style={{ fontSize: '8px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, padding: 0 }}>Scan to Verify</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CORE COMPONENT FOR DISPLAYING CERT ON SCREEN
// ==========================================
function DigitalCertificate({ data, onBack, isClientView, isRtl, hideIsrael, isPublicVerification }) {
  if (!data) return null;
  const isAuthentic = data.result === 'authentic';
  const verifyUrl = `${window.location.origin}${window.location.pathname}?verify=${data.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}&margin=0`;
  const imagesToDisplay = data.images ? Object.entries(data.images).slice(0, 4) : [];

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = data.id || 'LBI-Certificate';
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-24 animate-in zoom-in-95 no-print print:hidden">
      {!isPublicVerification && (
        <button onClick={onBack} className="no-print text-slate-500 font-medium flex items-center gap-1 mb-4 hover:text-slate-800 transition-colors">
          <ChevronLeft size={18} className={isRtl ? 'rotate-180' : ''}/> חזור
        </button>
      )}
      
      <div className="w-full overflow-x-auto flex justify-center pb-4 scrollbar-hide no-print">
         <div className="shrink-0 border-[10px] border-[#0a0a0a] shadow-2xl relative w-full sm:w-[210mm] max-w-full bg-white">
            <div className="border-[3px] border-[#d4af37] p-8 md:p-14 relative flex flex-col items-center text-center overflow-hidden bg-white">
              <BrandLogo className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] opacity-5 pointer-events-none" />
              
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-right">
                 <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase m-0 leading-none">Certificate No.</p>
                 <p className="text-sm font-bold text-slate-800 font-mono tracking-wider mt-1 m-0 leading-none">{data.id}</p>
              </div>
              
              <div className="mb-8 relative z-10 pt-6">
                <BrandLogo className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 drop-shadow-xl" hideIsrael={hideIsrael} />
                <h1 className="text-2xl sm:text-4xl font-serif tracking-widest text-[#0a0a0a] uppercase mb-2">Certificate of Authentication</h1>
                <p className="text-[#d4af37] font-bold tracking-[0.4em] text-xs uppercase">Luxury Bags Israel</p>
              </div>
              
              <div className={`w-full py-4 mb-8 border-y-2 relative z-10 flex items-center justify-center gap-3 ${isAuthentic ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
                  {isAuthentic ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
                  <h2 className="text-2xl font-black uppercase tracking-widest m-0 leading-none">{isAuthentic ? 'Authentic' : 'Counterfeit'}</h2>
              </div>
              
              <div className="w-full max-w-xl mb-8 relative z-10">
                <div className="grid grid-cols-2 gap-y-4 text-left border-b border-slate-200 pb-4 mb-4" dir="ltr">
                  <div className="text-slate-500 text-sm uppercase tracking-widest">Brand</div>
                  <div className="font-bold text-slate-900 text-lg leading-none">{data.brand}</div>
                  <div className="text-slate-500 text-sm uppercase tracking-widest">Model</div>
                  <div className="font-bold text-slate-900 text-lg leading-none">{data.model}</div>
                  {data.serialNumber && (
                    <>
                      <div className="text-slate-500 text-sm uppercase tracking-widest">Serial Number</div>
                      <div className="font-bold text-slate-900 text-lg leading-none">{data.serialNumber}</div>
                    </>
                  )}
                  <div className="text-slate-500 text-sm uppercase tracking-widest">Date Inspected</div>
                  <div className="font-bold text-slate-900 text-lg leading-none">{new Date(data.createdAt).toLocaleDateString('en-GB')}</div>
                </div>
                <p className="text-xs text-slate-500 italic text-center max-w-md mx-auto">This item has been rigorously inspected by our experts combining decades of human experience and advanced AI protocols.</p>
              </div>
              
              <div className="w-full relative z-10 flex-1">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4 text-left" dir="ltr">Inspected Elements</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                  {imagesToDisplay.map(([part, url]) => (
                     <div key={part} className="flex flex-col items-center">
                        <img src={url} alt={part} className="w-full h-24 sm:h-28 object-cover border border-slate-200 rounded-md shadow-sm" style={{ objectFit: 'cover' }} />
                        <span className="mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{part}</span>
                     </div>
                  ))}
                  {imagesToDisplay.length === 0 && (
                     <div className="col-span-2 sm:col-span-4 flex flex-col items-center">
                       <img src={data.image} className="w-full max-w-[250px] h-32 object-cover border border-slate-200 rounded-md shadow-sm" style={{ objectFit: 'cover' }} />
                       <span className="mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">MAIN</span>
                     </div>
                  )}
                </div>
              </div>
              
              <div className="w-full flex justify-between items-end relative z-10 mt-auto pt-6 border-t border-slate-100">
                <div className="text-left" dir="ltr"><CertificateStamp /></div>
                <div className="flex flex-col items-center">
                  <div className="bg-white p-2 border border-slate-200 rounded-xl shadow-md mb-2">
                    <img src={qrCodeUrl} alt="QR Code Verification" className="w-16 h-16 object-contain mix-blend-multiply" crossOrigin="anonymous" />
                  </div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest m-0">Scan to Verify</p>
                </div>
              </div>
            </div>
         </div>
      </div>
      
      {!isClientView && (
        <div className="flex justify-center sm:justify-end pt-6 no-print">
          <button onClick={handlePrint} className="bg-[#0a0a0a] hover:bg-black text-[#d4af37] px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-colors shadow-lg">
            <Upload size={20} /> הדפס / יצא ל-PDF
          </button>
        </div>
      )}
      
      {isClientView && !isPublicVerification && isAuthentic && (
        <div className="no-print bg-white border border-slate-200 p-8 rounded-3xl shadow-lg mt-8 text-center animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -z-10"></div>
          <h3 className="font-black text-slate-900 text-2xl mb-3 flex items-center justify-center gap-2">איזה יופי, הפריט מקורי! <Sparkles className="text-[#d4af37]" /></h3>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">שתפו את התעודה עם העוקבים שלכם או השתמשו בה כדי למכור את הפריט בביטחון מלא. סמנו אותנו! <span className="font-bold text-slate-900">@LuxuryBagsIsrael</span></p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button className="flex items-center justify-center gap-3 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold py-4 px-8 rounded-xl shadow-md hover:scale-105 transition-transform"><InstagramIcon size={20}/> שתפו בסטורי</button>
             <button onClick={() => { navigator.clipboard.writeText(verifyUrl); alert('הקישור הועתק!'); }} className="flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-4 px-8 rounded-xl shadow-sm transition-colors"><Upload size={20} /> העתק קישור</button>
             <button onClick={handlePrint} className="flex items-center justify-center gap-3 bg-[#0a0a0a] hover:bg-black text-[#d4af37] font-bold py-4 px-8 rounded-xl shadow-md transition-colors"><Upload size={20} /> הורד תעודה (PDF)</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// STATE MANAGER (MainApp)
// ==========================================
function MainApp() {
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
  
  const [verifyId, setVerifyId] = useState(null);
  const [verifyData, setVerifyData] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState('loading');

  const t = (key) => translations[lang]?.[key] || translations['en'][key] || key;
  const isRtl = lang === 'he' || lang === 'ar';
  const hideIsrael = geo.country !== 'IL'; 

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vId = params.get('verify');
    if (vId) {
      setVerifyId(vId);
      setShowLanding(false);
    }
  }, []);

  const handleLogout = () => { 
    if(auth) signOut(auth); 
    setUser(null); 
    setShowLanding(true); 
  };

  useEffect(() => {
    let sessionTimer;
    if (user && !verifyId) {
      sessionTimer = setTimeout(() => {
        handleLogout();
        setShowLoginModal(true);
        alert(isRtl ? 'פג תוקף החיבור (שעתיים). אנא התחברו מחדש.' : 'Session expired. Please log in again.');
      }, 7200000); 
    }
    return () => clearTimeout(sessionTimer);
  }, [user, isRtl, verifyId]);

  useEffect(() => {
    if (!auth) return;
    const initCanvasAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch(e) { console.warn("Auth Failed", e); }
    };
    initCanvasAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setRole(currentUser.email && currentUser.email.toLowerCase().includes('admin') ? 'admin' : 'client');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (verifyId && user && db) {
      const fetchVerification = async () => {
        try {
          const snapshot = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'auth_requests'));
          const reqs = snapshot.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
          const found = reqs.find(r => r.id === verifyId && (r.status === 'completed' || r.status === 'refunded'));
          if (found) {
            setVerifyData(found);
            setVerifyStatus('found');
          } else {
            setVerifyStatus('error');
          }
        } catch (e) {
          setVerifyStatus('error');
        }
      };
      fetchVerification();
    }
  }, [verifyId, user, db]);

  useEffect(() => {
    if (!user || !db || verifyId) return;
    const requestsRef = collection(db, 'artifacts', appId, 'public', 'data', 'auth_requests');
    const unsubscribe = onSnapshot(requestsRef, (snapshot) => {
      try {
        const allReqs = snapshot.docs.map(document => ({ firestoreId: document.id, ...document.data() }));
        allReqs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setSystemRequests(role === 'admin' ? allReqs : allReqs.filter(req => req?.clientId === user.uid));
      } catch (err) {
        console.error("Error processing snapshot data:", err);
      }
    }, (error) => {
      console.error("Firestore Listen Error:", error);
    });
    return () => unsubscribe();
  }, [user, role, verifyId]);

  const addRequest = async (newReqData) => { 
    if (!user || !db) return;
    try {
      let newIdNum = 19201; 
      
      try {
        const counterRef = doc(db, 'artifacts', appId, 'public', 'data', 'counters', 'main_counter');
        await runTransaction(db, async (transaction) => {
          const counterDoc = await transaction.get(counterRef);
          if (!counterDoc.exists()) {
            transaction.set(counterRef, { currentSequence: 19201 });
          } else {
            newIdNum = (counterDoc.data().currentSequence || 19200) + 1;
            transaction.update(counterRef, { currentSequence: newIdNum });
          }
        });
      } catch (e) {
        console.warn("Transaction failed, using fallback query", e);
        try {
          const querySnapshot = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'auth_requests'));
          let maxId = 19200;
          querySnapshot.forEach(d => {
             const data = d.data();
             if (data.id && data.id.startsWith('LBI-')) {
                 const num = parseInt(data.id.replace('LBI-', ''));
                 if (!isNaN(num) && num > maxId) maxId = num;
             }
          });
          newIdNum = maxId + 1;
        } catch(err2) {
          newIdNum = 19201 + Math.floor(Math.random() * 1000);
        }
      }
      
      const finalReqId = `LBI-${newIdNum}`;

      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'auth_requests'), { 
        ...newReqData, 
        id: finalReqId, 
        clientId: user.uid, 
        clientEmail: user.email || 'Anonymous', 
        createdAt: Date.now() 
      });
      setCurrentView('dashboard'); 
      return finalReqId; 
    } catch (err) {
      console.error("Add Request Error:", err);
      alert("שגיאה בשמירת הבקשה במסד הנתונים.");
      throw err; 
    }
  };
  
  const updateRequest = async (firestoreId, updates) => {
    if (!user || !db) return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'auth_requests', firestoreId), updates);
    } catch (err) {
      console.error("Update Request Error:", err);
    }
  };

  // public verification view
  if (verifyId) {
    if (verifyStatus === 'loading') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans" dir="rtl">
           <div className="text-center animate-pulse"><RefreshCcw className="w-12 h-12 text-[#d4af37] mx-auto mb-4 animate-spin"/>טוען נתוני תעודה...</div>
        </div>
      );
    }
    if (verifyStatus === 'error') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-6" dir="rtl">
           <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
             <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
             <h2 className="text-2xl font-bold text-slate-800 mb-2">התעודה לא נמצאה</h2>
             <p className="text-slate-600 mb-6">המספר שהוזן שגוי, התעודה מזויפת, או שהבדיקה טרם הסתיימה.</p>
             <button onClick={() => window.location.href = window.location.origin + window.location.pathname} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">חזור לדף הבית</button>
           </div>
        </div>
      );
    }
    if (verifyStatus === 'found') {
      return (
        <div className="min-h-screen bg-slate-50 py-10 font-sans print:bg-white print:py-0" dir="rtl">
           <GlobalStyles />
           
           <PrintOnlyView data={verifyData} hideIsrael={hideIsrael} />

           <div className="max-w-3xl mx-auto mb-6 text-center animate-in slide-in-from-top-4 no-print">
             <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 text-green-800 px-6 py-3 rounded-full font-bold text-sm shadow-sm">
               <CheckCircle size={20}/> אומת בהצלחה מול שרתי LBI
             </div>
             <p className="text-slate-500 mt-4 text-sm">התעודה המוצגת מטה היא רשמית ואושרה על ידי מערכות Luxury Bags Israel.</p>
           </div>
           
           <DigitalCertificate data={verifyData} onBack={() => window.location.href = window.location.origin + window.location.pathname} isClientView={false} t={t} isRtl={isRtl} hideIsrael={hideIsrael} isPublicVerification={true} />
        </div>
      );
    }
  }

  if (showLanding) {
    return (
      <>
        <GlobalStyles />
        <LandingPage t={t} geo={geo} isRtl={isRtl} lang={lang} setLang={setLang} setGeo={setGeo} hideIsrael={hideIsrael} user={user} onGoToLogin={() => { setShowLanding(false); if (!user) setShowLoginModal(true); }} onLogout={handleLogout} />
      </>
    );
  }

  if (!user && showLoginModal) {
    return (
      <>
        <GlobalStyles />
        <div dir={isRtl ? "rtl" : "ltr"} className="relative">
          <LoginScreen t={t} isRtl={isRtl} lang={lang} setLang={setLang} hideIsrael={hideIsrael} onBack={() => { setShowLoginModal(false); setShowLanding(true); }} onLoginSuccess={() => setShowLoginModal(false)} />
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      
      {selectedCertificate && currentView === 'certificate-view' && (
        <PrintOnlyView data={selectedCertificate} hideIsrael={hideIsrael} />
      )}
      
      <div className="flex h-[100dvh] bg-slate-50 text-slate-900 font-sans overflow-hidden print:hidden" dir={isRtl ? "rtl" : "ltr"}>
        <div className="no-print">
          {isMobileMenuOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />}
        </div>
        <Sidebar t={t} currentView={currentView} setCurrentView={(v) => { setCurrentView(v); setIsMobileMenuOpen(false); }} role={role} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} onLogout={handleLogout} hideIsrael={hideIsrael} onBackToSite={() => setShowLanding(true)} />
        <main className="flex-1 flex flex-col h-[100dvh] w-full overflow-hidden print:h-auto print:overflow-visible">
          <Header toggleMenu={() => setIsMobileMenuOpen(true)} role={role} t={t} />
          <div className="flex-1 overflow-y-auto flex flex-col p-4 md:p-8 pb-32 cert-view-container print:p-0 print:h-auto">
            {role === 'admin' && currentView !== 'certificate-view' ? (
              <AuthenticationTool requests={systemRequests} updateRequest={updateRequest} hideIsrael={hideIsrael} t={t} isRtl={isRtl} onSelectCert={(req) => { setSelectedCertificate(req); setCurrentView('certificate-view'); }} />
            ) : currentView === 'new-request' ? (
              <NewAuthenticationRequest t={t} geo={geo} isRtl={isRtl} addRequest={addRequest} setView={setCurrentView} user={user} />
            ) : currentView === 'business-pkgs' ? (
              <BusinessPackages t={t} geo={geo} isRtl={isRtl} setView={setCurrentView} />
            ) : currentView === 'certificate-view' ? (
              <DigitalCertificate data={selectedCertificate} onBack={() => setCurrentView('dashboard')} isClientView={role !== 'admin'} t={t} isRtl={isRtl} hideIsrael={hideIsrael} />
            ) : currentView === 'missing-photos' ? (
              <MissingPhotosUploader t={t} geo={geo} isRtl={isRtl} req={selectedCertificate} setView={setCurrentView} user={user} updateRequest={updateRequest} />
            ) : (
              <ClientDashboard t={t} requests={systemRequests} setView={setCurrentView} onSelectCert={(req) => { setSelectedCertificate(req); setCurrentView('certificate-view'); }} onProvidePhotos={(req) => { setSelectedCertificate(req); setCurrentView('missing-photos'); }} />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

// ==========================================
// VIEWS & SCREENS
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

      <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 bg-[#0a0a0a] overflow-hidden flex flex-col justify-center min-h-[85vh]">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50" style={{ backgroundImage: `url('${HERO_BG_IMAGES[0]}')` }} />
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
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight tracking-tighter drop-shadow-2xl font-bold" dangerouslySetInnerHTML={{ __html: t('hero_title') }}></h1>
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

      <section className="bg-[#0a0a0a] border-t border-white/10 py-10 relative z-20">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10 rtl:divide-x-reverse text-center">
            <div><p className="text-3xl md:text-4xl font-black text-[#d4af37] font-bold mb-1">+12,500</p><p className="text-xs text-slate-400 uppercase tracking-wider">{t('stats_items')}</p></div>
            <div><p className="text-3xl md:text-4xl font-black text-white font-bold mb-1">99.8%</p><p className="text-xs text-slate-400 uppercase tracking-wider">{t('stats_accuracy')}</p></div>
            <div><p className="text-3xl md:text-4xl font-black text-white font-bold mb-1">2-12</p><p className="text-xs text-slate-400 uppercase tracking-wider">{t('stats_speed')}</p></div>
            <div><p className="text-3xl md:text-4xl font-black text-white font-bold mb-1">+4,000</p><p className="text-xs text-slate-400 uppercase tracking-wider">{t('stats_clients')}</p></div>
         </div>
      </section>

      <section className="bg-white py-12 border-b border-slate-100 shadow-sm z-20 relative">
        <p className="text-center text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-8">{t('trusted_by')}</p>
        <div className="flex justify-center flex-wrap gap-10 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
           <span className="font-black text-2xl tracking-widest font-bold">LOUIS VUITTON</span>
           <span className="font-black text-2xl tracking-widest font-bold">CHANEL</span>
           <span className="font-black text-2xl tracking-widest font-bold">HERMÈS</span>
           <span className="font-black text-2xl tracking-widest font-bold">DIOR</span>
           <span className="font-black text-2xl tracking-widest font-bold">GUCCI</span>
        </div>
      </section>

      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
           <div className="w-full lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-bold leading-tight">{t('israeli_title')}</h2>
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

      <section className="py-24 bg-[#0a0a0a] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-900/20 rounded-full blur-[100px] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-bold">{t('why_us')}</h2>
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

      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-bold">{t('how_title')}</h2>
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

      <section className="bg-[#fafafa] py-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
           <h2 className="text-3xl font-black text-center text-slate-900 mb-12 font-bold">{t('reviews_title')}</h2>
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
      
      <section className="bg-[#0a0a0a] text-white py-20 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/20 to-transparent opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div>
             <h2 className="text-3xl md:text-4xl font-black mb-4 font-bold">{t('b2b_title') || 'בעלי בוטיק? הצטרפו לתוכנית העסקים'}</h2>
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
         <button onClick={onBack} className="no-print flex items-center gap-1 text-slate-500 hover:text-slate-900 font-bold text-sm bg-white/80 px-3 py-1.5 rounded-full shadow-sm"><ChevronLeft size={16} className={isRtl ? 'rotate-180' : ''} /> {t('back') || 'חזור'}</button>
      </div>
      <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} z-50`}>
        <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} className="no-print flex items-center gap-2 bg-white/20 backdrop-blur-md border border-slate-200 md:border-white/30 text-slate-800 md:text-white px-4 py-2 rounded-full font-bold text-xs shadow-sm hover:bg-white/30"><Globe size={14} /> {lang === 'he' ? 'EN' : 'עברית'}</button>
      </div>
      <div className="hidden md:flex md:w-1/2 relative bg-[#0a0a0a] items-center justify-center overflow-hidden pt-12">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" style={{ backgroundImage: `url('${HERO_BG_IMAGES[0]}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-0"></div>
        <div className="relative z-10 flex flex-col items-center text-center p-12 animate-in fade-in duration-1000">
          <BrandLogo className="w-40 h-40 mb-8 drop-shadow-2xl" hideIsrael={hideIsrael} />
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-4 leading-tight tracking-tighter drop-shadow-lg font-bold" dangerouslySetInnerHTML={{ __html: t('hero_title') }}></h1>
          <p className="text-[#d4af37] text-lg max-w-md font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: hideIsrael ? t('hero_subtitle_global') : t('hero_subtitle_il') }}></p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-24 bg-white relative">
        <div className="md:hidden flex flex-col items-center mb-10 mt-12">
          <BrandLogo className="w-24 h-24 mb-4" hideIsrael={hideIsrael} />
          <h1 className="text-3xl font-black text-slate-900 text-center tracking-tight leading-tight font-bold" dangerouslySetInnerHTML={{ __html: t('hero_title') }}></h1>
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

function Sidebar({ t, currentView, setCurrentView, role, isOpen, onClose, onLogout, hideIsrael, onBackToSite }) {
  const adminMenu = [{ id: 'auth-tool', label: 'תור משימות לבדיקה', icon: <Search size={20} /> }];
  const clientMenu = [{ id: 'dashboard', label: t('my_checks'), icon: <LayoutDashboard size={20} /> }, { id: 'new-request', label: t('new_request'), icon: <PlusCircle size={20} /> }];
  const menuItems = role === 'admin' ? adminMenu : clientMenu;
  return (
    <aside className={`no-print fixed md:static inset-y-0 ${t('hello') === 'שלום' ? 'right-0' : 'left-0'} w-72 md:w-64 bg-[#1c1c1c] text-slate-300 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : (t('hello') === 'שלום' ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0')}`}>
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
    <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm sticky top-0 z-30 no-print">
      <div className="flex items-center gap-3"><button onClick={toggleMenu} className="md:hidden text-slate-600 p-1 rounded-lg"><Menu size={24} /></button><h1 className="text-lg font-bold text-slate-800 hidden md:block">{role === 'admin' ? 'System Admin / AI Core' : t('client_portal')}</h1></div>
    </header>
  );
}

function ClientDashboard({ t, requests, setView, onSelectCert, onProvidePhotos }) {
  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-4xl animate-in fade-in duration-500">
      <div className="bg-[#0a0a0a] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-[#d4af37]/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-[50px] -z-10"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-black mb-2 font-bold">{t('hello')}! 👋</h2><p className="text-slate-400 text-sm mb-8">{t('welcome_dash')}</p>
          <button onClick={() => setView('new-request')} className="bg-[#d4af37] text-black font-bold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm w-full md:w-auto justify-center hover:bg-white transition-colors"><PlusCircle size={18} /> {t('new_request')}</button>
        </div>
      </div>
      <div>
        <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2"><Clock size={18} className="text-[#d4af37]" /> {t('history')}</h3>
        <div className="space-y-4">
          {(requests || []).map(req => {
            if (!req) return null;
            return (
              <div key={req.firestoreId || req.id || Math.random().toString()} 
                   onClick={() => {
                     if(req?.status === 'completed' || req?.status === 'refunded') onSelectCert(req);
                     if(req?.status === 'waiting_for_customer') onProvidePhotos(req);
                   }} 
                   className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 ${(req?.status === 'completed' || req?.status === 'refunded' || req?.status === 'waiting_for_customer') ? 'cursor-pointer hover:shadow-md active:scale-[0.99] hover:border-[#d4af37]/50 transition-all' : 'opacity-90'}`}>
                <img src={req?.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=200&q=80'} alt={req?.brand || 'Item'} className="w-16 h-16 rounded-xl object-cover border border-slate-100" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{req?.brand || 'מותג לא צוין'} <span className="text-xs text-slate-500 font-normal">{req?.model || ''}</span></h4>
                    <span className="text-[10px] text-slate-400">{req?.date || ''}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mb-2">{req?.model || ''} • {req?.id || 'ללא מזהה'}</p>
                  
                  {req?.status === 'completed' || req?.status === 'refunded' ? (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border ${req.result === 'authentic' ? 'bg-green-50 text-green-700 border-green-100' : req.result === 'refunded' ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-red-50 text-red-700 border-red-100'}`}>
                      {req.result === 'authentic' ? <><CheckCircle size={12} /> {t('authentic')}</> : req.result === 'refunded' ? <><X size={12}/> בוטל</> : <><XCircle size={12} /> {t('fake')}</>}
                    </span>
                  ) : req?.status === 'pending_payment' ? (
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-[10px] font-bold border border-blue-200">
                      <CreditCard size={12} /> ממתין לתשלום
                    </span>
                  ) : req?.status === 'waiting_for_customer' ? (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-[10px] font-bold border border-amber-100">
                      <AlertCircle size={12} /> לחץ כאן להשלמת תמונות
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold border border-slate-200">
                      <Clock size={12} /> {t('pending_expert')}
                    </span>
                  )}
                </div>
                <ChevronRight size={20} className={`text-slate-300 ${t('hello') === 'שלום' ? '' : 'transform rotate-180'}`} />
              </div>
            );
          })}
          {(!requests || requests.length === 0) && <p className="text-center text-slate-500 text-sm py-10">אין בקשות עדיין.</p>}
        </div>
      </div>
    </div>
  );
}

function NewAuthenticationRequest({ t, geo, isRtl, addRequest, setView, user }) {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [brand, setBrand] = useState('');
  const [itemType, setItemType] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [paymentTrack, setPaymentTrack] = useState('regular');
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const [uploadedImages, setUploadedImages] = useState({});
  const [uploadingPart, setUploadingPart] = useState(null);
  const [activeUploads, setActiveUploads] = useState(0);
  const fileInputRef = useRef(null);

  const handleApplyCoupon = () => {
    if (['LUXBAGFREE', 'LUXBAGCHECK'].includes(couponCode.trim().toUpperCase())) {
      setCouponMessage({ type: 'success', text: isRtl ? 'קופון אומת בהצלחה!' : 'Coupon applied successfully!' }); setIsDiscountApplied(true);
    } else { setCouponMessage({ type: 'error', text: isRtl ? 'קוד שגוי' : 'Invalid code' }); setIsDiscountApplied(false); }
  };

  const triggerFileInput = (partId) => {
    setUploadingPart(partId);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const removeImage = (partId) => {
    setUploadedImages(prev => {
      const newImgs = {...prev};
      delete newImgs[partId];
      return newImgs;
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const currentPart = uploadingPart;
    setUploadingPart(null);

    const base64Data = await compressImageToBase64(file);
    setUploadedImages(prev => ({ ...prev, [currentPart]: base64Data }));
    e.target.value = null;

    if (storage && user) {
      setActiveUploads(prev => prev + 1);
      try {
        const res = await fetch(base64Data);
        const blob = await res.blob();
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const fileRef = storageRef(storage, `artifacts/${appId}/users/${user.uid}/images/${Date.now()}_${safeName}.jpg`);
        const snapshot = await uploadBytes(fileRef, blob);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setUploadedImages(prev => {
          if (prev[currentPart] && prev[currentPart].startsWith('data:image')) {
            return { ...prev, [currentPart]: downloadURL };
          }
          return prev;
        });
      } catch (err) {
        console.warn("Storage sync failed, silently falling back to local Base64 string.", err);
      } finally {
        setActiveUploads(prev => Math.max(0, prev - 1));
      }
    }
  };

  useEffect(() => {
    if (step !== 3 || isDiscountApplied || showSuccess || activeUploads > 0) return;

    let hasRendered = false;

    const renderPayPal = () => {
      if (hasRendered || !window.paypal) return;
      const container = document.getElementById('paypal-button-container');
      if (container) {
        hasRendered = true;
        container.innerHTML = ''; 
        setPaypalLoaded(true);
        
        const amountToCharge = paymentTrack === 'express' ? (geo.currency === 'ILS' ? 149 : 49) : paymentTrack === 'fast' ? (geo.currency === 'ILS' ? 129 : 39) : (geo.currency === 'ILS' ? 99 : 29);

        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({ purchase_units: [{ amount: { value: amountToCharge.toString() } }] });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(async () => {
               const finalReqId = await addRequest({
                 brand, model: model || 'N/A',
                 serialNumber: serialNumber || '',
                 date: new Date().toLocaleDateString('en-GB'), status: 'pending', paymentTrack,
                 image: uploadedImages['front'] || Object.values(uploadedImages)[0] || 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=200&q=80',
                 images: uploadedImages
               });
               await sendTelegramFrontendAlert(finalReqId, brand, model, paymentTrack);
               setShowSuccess(true);
            });
          },
          onError: (err) => {
            console.error("PayPal Error:", err);
            alert("שגיאה במערכת התשלומים, נסה שנית.");
          }
        }).render('#paypal-button-container');
      }
    };

    if (window.paypal) {
      renderPayPal();
    } else {
      const scriptId = 'paypal-sdk-script';
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://www.paypal.com/sdk/js?client-id=Abl9tf9osl-4AxIDVVUNAGaWU3O-AaZiSexD6BGVw7VmLpb5ecU25xRWcEwR0JHT_nU10LbKcegIn3zE&currency=${geo.currency === 'ILS' ? 'ILS' : 'USD'}`;
        script.async = true;
        document.body.appendChild(script);
      }
      
      script.addEventListener('load', renderPayPal);
      const interval = setInterval(() => {
        if (window.paypal) {
          renderPayPal();
          clearInterval(interval);
        }
      }, 500);

      return () => {
        script.removeEventListener('load', renderPayPal);
        clearInterval(interval);
      };
    }
  }, [step, isDiscountApplied, paymentTrack, showSuccess, geo.currency, addRequest, brand, model, serialNumber, uploadedImages, activeUploads]);

  const handlePaymentSuccessFree = async () => {
    const finalReqId = await addRequest({
      brand, model: model || 'N/A',
      serialNumber: serialNumber || '',
      date: new Date().toLocaleDateString('en-GB'), status: 'pending', paymentTrack,
      image: uploadedImages['front'] || Object.values(uploadedImages)[0] || 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=200&q=80',
      images: uploadedImages
    });
    setShowSuccess(true);
  };

  const handleReset = () => { setBrand(''); setItemType(''); setModel(''); setSerialNumber(''); setCouponCode(''); setIsDiscountApplied(false); setPaymentTrack('regular'); setShowSuccess(false); setUploadedImages({}); setStep(1); };

  if (showSuccess) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in zoom-in-95 text-center p-10 mb-24">
        <div className="w-24 h-24 bg-[#d4af37]/20 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-12 h-12 text-[#d4af37]" /></div>
        <h2 className="text-2xl font-black text-slate-800 mb-3">{t('success_title')}</h2><p className="text-slate-600 mb-8">{t('success_sub')}</p>
        <div className="space-y-3"><button onClick={() => setView('dashboard')} className="w-full bg-[#0a0a0a] text-[#d4af37] font-bold py-4 rounded-xl hover:bg-black transition-colors">{t('btn_home')}</button><button onClick={handleReset} className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-100 transition-colors">{t('btn_another')} <PlusCircle size={18} className="inline ml-1" /></button></div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto w-full md:max-w-3xl bg-white rounded-3xl shadow-sm border border-slate-100 overflow-visible animate-in fade-in pb-6 mb-24">
      <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between mb-2 rounded-t-3xl">
        <h2 className="font-bold text-slate-800">{t('new_request')}</h2><span className="text-xs font-medium text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-full uppercase tracking-wider">{step === 1 ? t('step_1') : step === 2 ? t('step_2') : t('step_3')}</span>
      </div>
      <div className="p-5 md:p-8">
        {step === 1 ? (
          <div className="space-y-5">
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">{t('brand')} *</label>
               <select value={brand} onChange={e => { setBrand(e.target.value); setModel(''); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-[#d4af37] transition-colors">
                 <option value="">{t('select_brand')}</option>
                 {LUXURY_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
               </select>
             </div>
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">{t('item_type')} *</label>
               <select value={itemType} onChange={e => { setItemType(e.target.value); setModel(''); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-[#d4af37] transition-colors">
                 <option value="">{t('select_type')}</option>
                 {ITEM_TYPES.map(type => <option key={type} value={type}>{type.split('/')[isRtl ? 1 : 0]}</option>)}
               </select>
             </div>

             {brand && itemType && (
               <div className="animate-in fade-in slide-in-from-top-4 space-y-5">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">
                     {t('model')} <span className="font-normal text-slate-400">({t('optional')})</span>
                   </label>

                   {itemType === 'Bag/תיק' && BRAND_MODELS[brand] ? (
                     <select
                       value={model}
                       onChange={e => setModel(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-[#d4af37] transition-colors"
                     >
                       <option value="">{isRtl ? "בחרו דגם מתוך הרשימה" : "Select model"}</option>
                       {BRAND_MODELS[brand].map(m => <option key={m} value={m}>{m}</option>)}
                     </select>
                   ) : (
                     <input
                       type="text"
                       value={model}
                       onChange={e => setModel(e.target.value)}
                       placeholder={t('model_placeholder')}
                       className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-3 px-4 outline-none focus:border-[#d4af37] transition-colors"
                     />
                   )}
                 </div>
                 
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">
                     {t('serial_number')}
                   </label>
                   <input
                     type="text"
                     value={serialNumber}
                     onChange={e => setSerialNumber(e.target.value)}
                     placeholder={t('serial_placeholder')}
                     className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-3 px-4 outline-none focus:border-[#d4af37] transition-colors"
                   />
                 </div>
               </div>
             )}

             <button onClick={() => setStep(2)} disabled={!brand || !itemType} className="w-full mt-8 bg-[#0a0a0a] hover:bg-black text-[#d4af37] font-bold py-4 rounded-xl disabled:opacity-50 transition-colors">{t('continue_photos')}</button>
          </div>
        ) : step === 2 ? (
          <div className="space-y-6">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

            {activeUploads > 0 && (
              <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 text-slate-800 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
                <RefreshCcw size={14} className="animate-spin text-[#d4af37]" />
                {isRtl ? `מסנכרן לשרת מאובטח (${activeUploads})...` : `Syncing securely (${activeUploads})...`}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {BAG_PARTS.map(part => {
                const partDef = BAG_PARTS.find(p => p.id === part.id);
                return (
                  <div key={part.id} className="relative group">
                    {uploadedImages[part.id] ? (
                      <div className="border-2 border-slate-200 rounded-xl p-1 relative overflow-hidden">
                        <img src={uploadedImages[part.id]} alt={part.id} className="w-full h-20 object-cover rounded-lg" />
                        <button onClick={(e) => { e.stopPropagation(); removeImage(part.id); }} className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md z-10 transition-colors">
                          <X size={14} />
                        </button>
                        <span className="absolute bottom-1 right-1 z-10 bg-black/70 text-white text-[10px] px-1.5 rounded">{part.id}</span>
                      </div>
                    ) : (
                      <div onClick={() => triggerFileInput(part.id)} className="border-2 border-dashed border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center text-center bg-slate-50 hover:border-[#d4af37]/50 cursor-pointer h-[92px] transition-colors">
                         <BagPartIcon type={partDef.iconType} className="w-8 h-8 mb-2 text-slate-400 group-hover:text-[#d4af37] transition-colors" />
                         <span className="text-[10px] font-bold text-slate-500">{part.id}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="pt-6 flex gap-3"><button onClick={() => setStep(1)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-colors">{t('back')}</button><button onClick={() => setStep(3)} disabled={Object.keys(uploadedImages).length === 0} className="flex-[2] bg-[#0a0a0a] hover:bg-black text-[#d4af37] font-bold py-3.5 rounded-xl disabled:opacity-50 transition-colors">{t('continue_track')}</button></div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in">
            <div className="mb-4"><h3 className="text-xl font-bold text-slate-800 mb-1">{t('track_title')}</h3><p className="text-sm text-slate-500">{t('track_sub')}</p></div>
            <div className="space-y-4">
              <TrackOption id="regular" title={t('track_reg')} hours={t('hours_12')} price={geo.currency === 'ILS' ? 99 : 29} geo={geo} current={paymentTrack} onSelect={setPaymentTrack} />
              <TrackOption id="fast" title={t('track_fast')} hours={t('hours_6')} price={geo.currency === 'ILS' ? 129 : 39} geo={geo} current={paymentTrack} onSelect={setPaymentTrack} highlight="text-orange-500" />
              <TrackOption id="express" title={t('track_exp')} hours={t('hours_2')} price={geo.currency === 'ILS' ? 149 : 49} geo={geo} current={paymentTrack} onSelect={setPaymentTrack} tag={t('recommended')} highlight="text-red-500" />
            </div>
            <div className="bg-slate-50 p-5 rounded-xl text-sm border border-slate-100 mt-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('coupon_label')}</label>
              <div className="flex gap-2"><input type="text" value={couponCode} onChange={e => { setCouponCode(e.target.value); setCouponMessage(null); }} placeholder={t('coupon_placeholder')} className="flex-1 bg-white border border-slate-200 rounded-lg py-3 px-4 uppercase text-sm outline-none focus:border-[#d4af37]" disabled={isDiscountApplied} /><button onClick={handleApplyCoupon} disabled={!couponCode || isDiscountApplied} className="bg-slate-800 text-[#d4af37] font-bold py-3 px-6 rounded-lg disabled:opacity-50 hover:bg-slate-900 transition-colors">{t('apply')}</button></div>
              {couponMessage && <p className={`mt-2 text-xs font-bold ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{couponMessage.text}</p>}
            </div>
            <div className="pt-6 flex flex-col gap-3 border-t border-slate-100 mt-6">
              <button onClick={() => setStep(2)} className="w-full bg-slate-100 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors">{t('back')}</button>

              {isDiscountApplied ? (
                <button onClick={handlePaymentSuccessFree} className="w-full bg-[#0a0a0a] text-[#d4af37] font-bold py-4 rounded-xl hover:bg-black transition-colors">{t('send_free')}</button>
              ) : (
                <div className="relative z-0 min-h-[150px] w-full bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                  {!paypalLoaded && <div className="flex justify-center p-8"><RefreshCcw className="animate-spin text-slate-400" /></div>}
                  <div id="paypal-button-container" className="w-full"></div>
                </div>
              )}

              <button onClick={() => setView('business-pkgs')} className="text-sm font-bold text-slate-500 hover:text-slate-800 mt-4 flex justify-center items-center gap-2"><Briefcase size={16} /> {t('business_pkg')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MissingPhotosUploader({ t, geo, isRtl, req, setView, user, updateRequest }) {
  const [uploadedImages, setUploadedImages] = useState({});
  const [uploadingPart, setUploadingPart] = useState(null);
  const [activeUploads, setActiveUploads] = useState(0);
  const fileInputRef = useRef(null);

  const missingParts = req?.missingParts?.length > 0 ? req.missingParts : ['front', 'inside', 'metal-stamp', 'date-code'];
  const msg = req?.missingPhotosMsg || 'אנא העלה תמונות ברורות יותר של האזורים הבאים:';

  const triggerFileInput = (partId) => {
    setUploadingPart(partId);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const removeImage = (partId) => {
    setUploadedImages(prev => {
      const newImgs = {...prev};
      delete newImgs[partId];
      return newImgs;
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const currentPart = uploadingPart;
    setUploadingPart(null);

    const base64Data = await compressImageToBase64(file);
    setUploadedImages(prev => ({ ...prev, [currentPart]: base64Data }));
    e.target.value = null;

    if (storage && user) {
      setActiveUploads(prev => prev + 1);
      try {
        const res = await fetch(base64Data);
        const blob = await res.blob();
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const fileRef = storageRef(storage, `artifacts/${appId}/users/${user.uid}/images/${Date.now()}_${safeName}.jpg`);
        const snapshot = await uploadBytes(fileRef, blob);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setUploadedImages(prev => {
          if (prev[currentPart] && prev[currentPart].startsWith('data:image')) {
            return { ...prev, [currentPart]: downloadURL };
          }
          return prev;
        });
      } catch (err) {
        console.warn("Storage sync failed, silently falling back to local Base64 string.", err);
      } finally {
        setActiveUploads(prev => Math.max(0, prev - 1));
      }
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(uploadedImages).length === 0) return;
    await updateRequest(req.firestoreId, {
      status: 'reviewing',
      images: { ...req.images, ...uploadedImages },
      missingParts: [],
      missingPhotosMsg: null,
      clientNotes: 'הלקוח העלה תמונות משלימות'
    });
    setView('dashboard');
  };

  const handleNoBetterPhotos = async () => {
    await updateRequest(req.firestoreId, {
      status: 'reviewing',
      missingParts: [],
      missingPhotosMsg: null,
      clientNotes: 'הלקוח ציין שאין ברשותו תמונות טובות יותר'
    });
    setView('dashboard');
  };

  return (
    <div className="max-w-lg mx-auto w-full md:max-w-3xl bg-white rounded-3xl shadow-sm border border-amber-200 overflow-visible animate-in fade-in pb-6 mb-24">
      <div className="bg-amber-50 p-4 border-b border-amber-100 flex items-center justify-between mb-2 rounded-t-3xl">
        <h2 className="font-bold text-amber-800 flex items-center gap-2"><AlertCircle size={20}/> השלמת תמונות נדרשת</h2>
      </div>
      <div className="p-5 md:p-8 space-y-6">
        <p className="text-slate-700 bg-slate-50 p-4 rounded-xl text-sm border border-slate-200"><strong>הודעת הבודק:</strong><br/>{msg}</p>
        
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        
        {activeUploads > 0 && (
          <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 text-slate-800 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
            <RefreshCcw size={14} className="animate-spin text-[#d4af37]" />
            {isRtl ? `מסנכרן תמונות...` : `Syncing securely...`}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {missingParts.map(partId => {
            const partDef = BAG_PARTS.find(p => p.id === partId) || { id: partId, iconType: 'upload' };
            return (
              <div key={partId} className="relative group">
                {uploadedImages[partId] ? (
                  <div className="border-2 border-slate-200 rounded-xl p-1 relative overflow-hidden">
                    <img src={uploadedImages[partId]} alt={partId} className="w-full h-20 object-cover rounded-lg" />
                    <button onClick={(e) => { e.stopPropagation(); removeImage(partId); }} className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md z-10 transition-colors">
                      <X size={14} />
                    </button>
                    <span className="absolute bottom-1 right-1 z-10 bg-black/70 text-white text-[10px] px-1.5 rounded">{partId}</span>
                  </div>
                ) : (
                  <div onClick={() => triggerFileInput(partId)} className="border-2 border-dashed border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center text-center bg-slate-50 hover:border-[#d4af37]/50 cursor-pointer h-[92px] transition-colors">
                     <BagPartIcon type={partDef.iconType} className="w-8 h-8 mb-2 text-slate-400 group-hover:text-[#d4af37] transition-colors" />
                     <span className="text-[10px] font-bold text-slate-500">{partId}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-6 flex flex-col gap-3 border-t border-slate-100 mt-6">
          <button onClick={handleSubmit} disabled={Object.keys(uploadedImages).length === 0 || activeUploads > 0} className="w-full bg-[#0a0a0a] hover:bg-black text-[#d4af37] font-bold py-4 rounded-xl disabled:opacity-50 transition-colors">שלח תמונות לבדיקה חוזרת</button>
          <button onClick={handleNoBetterPhotos} className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors">אין לי אפשרות לצלם תמונה טובה יותר</button>
          <button onClick={() => setView('dashboard')} className="w-full text-slate-400 text-sm mt-2 hover:text-slate-600 font-bold transition-colors">חזור</button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// EXPORT APP
// ==========================================
export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
