export const mockPharmacies = [
  {
    id: "ph-1",
    name_en: "Al-Dawaa Pharmacy",
    name_ar: "صيدلية الدواء",
    logo: "💊",
    rating: 4.8,
    reviewsCount: 124,
    distance: 1.2,
    deliveryFee: 10,
    deliveryEta_en: "20-30 mins",
    deliveryEta_ar: "٢٠-٣٠ دقيقة",
    is24Hours: true,
    hasFreeDelivery: false,
    banner: "🏥"
  },
  {
    id: "ph-2",
    name_en: "Nahdi Pharmacy",
    name_ar: "صيدلية النهدي",
    logo: "🏢",
    rating: 4.9,
    reviewsCount: 310,
    distance: 2.1,
    deliveryFee: 5,
    deliveryEta_en: "15-25 mins",
    deliveryEta_ar: "١٥-٢٥ دقيقة",
    is24Hours: true,
    hasFreeDelivery: true,
    banner: "🏥"
  },
  {
    id: "ph-3",
    name_en: "Whites Pharmacy",
    name_ar: "صيدلية وايتس",
    logo: "💅",
    rating: 4.7,
    reviewsCount: 89,
    distance: 3.5,
    deliveryFee: 12,
    deliveryEta_en: "30-40 mins",
    deliveryEta_ar: "٣٠-٤٠ دقيقة",
    is24Hours: false,
    hasFreeDelivery: false,
    banner: "🏥"
  },
  {
    id: "ph-4",
    name_en: "Al-Safaa Pharmacy",
    name_ar: "صيدلية الصفا",
    logo: "⚕️",
    rating: 4.5,
    reviewsCount: 45,
    distance: 4.8,
    deliveryFee: 15,
    deliveryEta_en: "45-60 mins",
    deliveryEta_ar: "٤٥-٦٠ دقيقة",
    is24Hours: false,
    hasFreeDelivery: false,
    banner: "🏥"
  },
  {
    id: "ph-5",
    name_en: "Community Care Pharmacy",
    name_ar: "صيدلية رعاية المجتمع",
    logo: "❤️",
    rating: 4.6,
    reviewsCount: 67,
    distance: 2.8,
    deliveryFee: 8,
    deliveryEta_en: "25-35 mins",
    deliveryEta_ar: "٢٥-٣٥ دقيقة",
    is24Hours: true,
    hasFreeDelivery: true,
    banner: "🏥"
  }
];

export const mockProducts = [
  {
    id: "pr-1",
    name_en: "Panadol Extra Soluble (Pain Relief)",
    name_ar: "بنادول إكسترا فوار (مسكن للألم)",
    description_en: "Effective relief from headache, migraine, backache, and toothache. Soluble format for faster absorption.",
    description_ar: "تسكين فعال للصداع، الشقيقة، آلام الظهر والأسنان. فوار لسرعة الامتصاص.",
    price: 12.50,
    originalPrice: 15.00,
    isRx: false,
    isColdChain: false,
    rating: 4.9,
    reviewsCount: 184,
    image: "🔴",
    category: "medications",
    pharmacyId: "ph-1",
    pharmacyName_en: "Al-Dawaa Pharmacy",
    pharmacyName_ar: "صيدلية الدواء",
    availability: true
  },
  {
    id: "pr-2",
    name_en: "Solgar Vitamin D3 1000 IU (90 Caps)",
    name_ar: "سولجار فيتامين د٣ ١٠٠٠ وحدة دولية (٩٠ كبسولة)",
    description_en: "Helps maintain healthy bones and teeth, supports the immune system, and promotes tissue health.",
    description_ar: "يساعد في الحفاظ على صحة العظام والأسنان، ويدعم جهاز المناعة، ويعزز صحة الأنسجة.",
    price: 65.00,
    originalPrice: 80.00,
    isRx: false,
    isColdChain: false,
    rating: 4.8,
    reviewsCount: 95,
    image: "💛",
    category: "vitamins",
    pharmacyId: "ph-1",
    pharmacyName_en: "Al-Dawaa Pharmacy",
    pharmacyName_ar: "صيدلية الدواء",
    availability: true
  },
  {
    id: "pr-3",
    name_en: "Ventolin Inhaler 100mcg (Asthma)",
    name_ar: "بخاخ فنتولين ١٠٠ ميكروجرام (للربو)",
    description_en: "Prescription-only bronchodilator. Rapid relief of asthma symptoms and prevention of bronchospasm.",
    description_ar: "موسع شعب هوائية يستلزم وصفة طبية. راحة سريعة لأعراض الربو والوقاية من تشنج الشعب الهوائية.",
    price: 24.30,
    isRx: true,
    isColdChain: false,
    rating: 4.9,
    reviewsCount: 312,
    image: "💨",
    category: "medications",
    pharmacyId: "ph-2",
    pharmacyName_en: "Nahdi Pharmacy",
    pharmacyName_ar: "صيدلية النهدي",
    availability: true
  },
  {
    id: "pr-4",
    name_en: "Baby Milk Similac Gold 1 (400g)",
    name_ar: "حليب أطفال سيميلاك جولد ١ (٤٠٠ جم)",
    description_en: "Infant formula for babies from birth to 6 months. Formulated with HMO to support immunity.",
    description_ar: "تركيبة حليب للرضع من الولادة وحتى ٦ أشهر. معزز بـ HMO لدعم المناعة.",
    price: 85.00,
    isRx: false,
    isColdChain: false,
    rating: 4.7,
    reviewsCount: 78,
    image: "🍼",
    category: "baby",
    pharmacyId: "ph-2",
    pharmacyName_en: "Nahdi Pharmacy",
    pharmacyName_ar: "صيدلية النهدي",
    availability: true
  },
  {
    id: "pr-5",
    name_en: "Lantus SoloStar Insulin Pen",
    name_ar: "قلم أنسولين لانتوس سولوشتار",
    description_en: "Long-acting insulin injection for diabetes management. Must be kept refrigerated (2°C - 8°C).",
    description_ar: "حقن أنسولين طويل المفعول لعلاج السكري. يجب حفظه مبرداً (٢ - ٨ درجات مئوية).",
    price: 185.00,
    isRx: true,
    isColdChain: true,
    rating: 4.9,
    reviewsCount: 145,
    image: "💉",
    category: "medications",
    pharmacyId: "ph-1",
    pharmacyName_en: "Al-Dawaa Pharmacy",
    pharmacyName_ar: "صيدلية الدواء",
    availability: true
  },
  {
    id: "pr-6",
    name_en: "CeraVe Hydrating Cleanser (236ml)",
    name_ar: "سيرافي غسول مرطب للوجه (٢٣٦ مل)",
    description_en: "Cleanses and hydrates normal to dry skin without disrupting the protective skin barrier.",
    description_ar: "ينظف ويرطب البشرة العادية إلى الجافة دون الإضرار بالحاجز الواقي للبشرة.",
    price: 78.00,
    originalPrice: 90.00,
    isRx: false,
    isColdChain: false,
    rating: 4.6,
    reviewsCount: 220,
    image: "🧴",
    category: "beauty",
    pharmacyId: "ph-3",
    pharmacyName_en: "Whites Pharmacy",
    pharmacyName_ar: "صيدلية وايتس",
    availability: true
  },
  {
    id: "pr-7",
    name_en: "Omron M3 Comfort Blood Pressure Monitor",
    name_ar: "جهاز قياس ضغط الدم أومرون M3",
    description_en: "Fully automatic upper arm blood pressure monitor. Intelli Wrap Cuff for accurate readings.",
    description_ar: "جهاز آلي بالكامل لقياس ضغط الدم من العضد. سوار ذكي لدقة القراءة.",
    price: 349.00,
    originalPrice: 399.00,
    isRx: false,
    isColdChain: false,
    rating: 4.8,
    reviewsCount: 52,
    image: "⌚",
    category: "devices",
    pharmacyId: "ph-3",
    pharmacyName_en: "Whites Pharmacy",
    pharmacyName_ar: "صيدلية وايتس",
    availability: true
  },
  {
    id: "pr-8",
    name_en: "Eucerin Sun Gel-Cream Oil Control SPF50+",
    name_ar: "يوسيرين جل-كريم واقي شمس للتحكم بالدهون SPF50+",
    description_en: "Very high sun protection for oily and acne-prone skin with long-lasting anti-shine effect.",
    description_ar: "حماية عالية جداً من الشمس للبشرة الدهنية والمعرضة لحب الشباب مع تأثير مضاد للمعان يدوم طويلاً.",
    price: 115.00,
    isRx: false,
    isColdChain: false,
    rating: 4.7,
    reviewsCount: 142,
    image: "🌞",
    category: "beauty",
    pharmacyId: "ph-3",
    pharmacyName_en: "Whites Pharmacy",
    pharmacyName_ar: "صيدلية وايتس",
    availability: true
  },
  {
    id: "pr-9",
    name_en: "GNC Triple Strength Fish Oil (90 Softgels)",
    name_ar: "جي إن سي زيت السمك ثلاثي القوة (٩٠ كبسولة)",
    description_en: "Provides 1000mg of active EPA/DHA Omega-3s per serving to support heart, brain, and joint health.",
    description_ar: "يوفر ١٠٠٠ ملجم من أوميجا-٣ النشط لدعم صحة القلب والدماغ والمفاصل.",
    price: 145.00,
    isRx: false,
    isColdChain: false,
    rating: 4.5,
    reviewsCount: 38,
    image: "🐟",
    category: "vitamins",
    pharmacyId: "ph-4",
    pharmacyName_en: "Al-Safaa Pharmacy",
    pharmacyName_ar: "صيدلية الصفا",
    availability: true
  },
  {
    id: "pr-10",
    name_en: "Bioderma Atoderm Intensive Baume (75ml)",
    name_ar: "بيوديرما أتوديرم بلسم مغذي ومكثف (٧٥ مل)",
    description_en: "Ultra-soothing skin barrier therapy for very dry, irritated, and atopic sensitive skin.",
    description_ar: "علاج مهدئ للغاية لحاجز البشرة شديدة الجفاف، المتهيجة والحساسة.",
    price: 59.00,
    isRx: false,
    isColdChain: false,
    rating: 4.8,
    reviewsCount: 110,
    image: "💧",
    category: "beauty",
    pharmacyId: "ph-5",
    pharmacyName_en: "Community Care Pharmacy",
    pharmacyName_ar: "صيدلية رعاية المجتمع",
    availability: true
  }
];

export const mockUserProfile = {
  name: "Ibrahim Al-Fahad",
  email: "ibrahim@yusur.com",
  phone: "0501234567",
  addresses: [
    {
      id: "ad-1",
      tag: "Home",
      tag_ar: "المنزل",
      street: "Al-Malqa Road, Building 14",
      street_ar: "طريق الملقا، مبنى ١٤",
      city: "Riyadh",
      city_ar: "الرياض",
      isDefault: true
    },
    {
      id: "ad-2",
      tag: "Work",
      tag_ar: "العمل",
      street: "King Fahd Road, Al-Aqeeq District",
      street_ar: "طريق الملك فهد، حي العقيق",
      city: "Riyadh",
      city_ar: "الرياض",
      isDefault: false
    }
  ]
};

export const mockWallet = {
  balance: 245.50,
  transactions: [
    {
      id: "wt-1",
      type: "refund",
      title_en: "Refund for Order #YS-701",
      title_ar: "استرجاع رصيد الطلب #YS-701",
      date: "2026-06-12",
      amount: 200.00
    },
    {
      id: "wt-2",
      type: "payment",
      title_en: "Used at Checkout #YS-692",
      title_ar: "استخدام في الدفع للطلب #YS-692",
      date: "2026-06-10",
      amount: -54.50
    },
    {
      id: "wt-3",
      type: "topup",
      title_en: "Wallet Top Up via Mada",
      title_ar: "شحن المحفظة عبر بطاقة مدى",
      date: "2026-06-05",
      amount: 100.00
    }
  ]
};

export const mockLoyalty = {
  pointsBalance: 1250,
  valueSar: 25.00,
  tier_en: "Gold Member",
  tier_ar: "عضوية ذهبية",
  nextTierPoints: 1500,
  history: [
    {
      id: "lh-1",
      action_en: "Earned from Order #YS-701",
      action_ar: "مكتسبة من الطلب #YS-701",
      date: "2026-06-12",
      points: 50
    },
    {
      id: "lh-2",
      action_en: "Redeemed at Checkout #YS-692",
      action_ar: "مستبدلة عند الدفع للطلب #YS-692",
      date: "2026-06-10",
      points: -250
    },
    {
      id: "lh-3",
      action_en: "Earned from Order #YS-620",
      action_ar: "مكتسبة من الطلب #YS-620",
      date: "2026-05-28",
      points: 120
    }
  ]
};

export const mockOrders = [
  {
    id: "YS-812",
    date: "2026-06-18",
    status: "delivering", // delivering, completed, pending_rx
    pharmacyName_en: "Al-Dawaa Pharmacy",
    pharmacyName_ar: "صيدلية الدواء",
    items: [
      { id: "pr-1", name_en: "Panadol Extra Soluble", name_ar: "بنادول إكسترا فوار", price: 12.50, quantity: 2 },
      { id: "pr-2", name_en: "Solgar Vitamin D3", name_ar: "سولجار فيتامين د٣", price: 65.00, quantity: 1 }
    ],
    deliveryFee: 10,
    vat: 13.50,
    total: 103.50,
    driverName: "Ahmed Al-Harbi",
    driverPhone: "+966555123456",
    eta_en: "15 mins",
    eta_ar: "١٥ دقيقة",
    timeline: [
      { step: "placed", time: "11:15 AM", done: true },
      { step: "preparing", time: "11:22 AM", done: true },
      { step: "delivering", time: "11:30 AM", done: true },
      { step: "arrived", time: "--:--", done: false }
    ]
  },
  {
    id: "YS-701",
    date: "2026-06-12",
    status: "completed",
    pharmacyName_en: "Nahdi Pharmacy",
    pharmacyName_ar: "صيدلية النهدي",
    items: [
      { id: "pr-4", name_en: "Baby Milk Similac Gold 1", name_ar: "حليب أطفال سيميلاك جولد ١", price: 85.00, quantity: 2 }
    ],
    deliveryFee: 0,
    vat: 25.50,
    total: 195.50,
    timeline: [
      { step: "placed", time: "09:05 AM", done: true },
      { step: "preparing", time: "09:15 AM", done: true },
      { step: "delivering", time: "09:30 AM", done: true },
      { step: "arrived", time: "09:48 AM", done: true }
    ]
  }
];
