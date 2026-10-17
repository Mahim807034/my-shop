import { create } from "zustand";
import { persist } from "zustand/middleware";

export const LANGUAGES = {
  en: { name: "English", flag: "🇬🇧", dir: "ltr" },
  bn: { name: "বাংলা", flag: "🇧🇩", dir: "ltr" },
};

export const TRANSLATIONS = {
  en: {
    // ═══════════ Navbar ═══════════
    home: "Home",
    products: "Products",
    about: "About",
    contact: "Contact",
    cart: "Cart",
    wishlist: "Wishlist",
    profile: "Profile",
    orders: "My Orders",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    search: "Search products...",
    adminPanel: "Admin Panel",

    // ═══════════ Home ═══════════
    welcome: "Welcome to My Shop",
    welcomeSubtitle:
      "Quality products at affordable prices. Fast delivery all over Bangladesh.",
    shopNow: "Shop Now",
    featuredHighlights: "🔥 Featured Highlights",
    featuredSubtitle: "Auto-sliding showcase of our top products",
    whyChooseUs: "Why Choose Us",
    featuredProducts: "Featured Products",
    viewAll: "View All",
    aboutUs: "About Us",
    readyToShop: "Ready to shop with us?",
    browseCollection:
      "Browse our collection and enjoy fast delivery across Bangladesh.",

    // ═══════════ Products ═══════════
    allProducts: "All Products",
    browseCollection2: "Browse our collection of quality products",
    noProducts: "No products available yet. Check back soon!",
    noProductsFound: "No products found",
    filters: "Filters",
    sortBy: "Sort By",
    clearFilters: "Clear Filters",
    newestFirst: "Newest First",
    priceLowHigh: "Price: Low to High",
    priceHighLow: "Price: High to Low",
    topRated: "Top Rated",
    nameAsc: "Name: A to Z",
    nameDesc: "Name: Z to A",
    price: "Price Range",
    inStock: "In Stock Only",
    result: "result",
    results: "results",
    showing: "Showing",
    of: "of",

    // ═══════════ Product Detail ═══════════
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    orderWhatsApp: "Order on WhatsApp",
    outOfStock: "Out of Stock",
    quantity: "Quantity",
    total: "Total",
    description: "Description",
    specifications: "Specifications",
    reviews: "Reviews",
    writeReview: "Write a Review",
    relatedProducts: "Related Products",
    recentlyViewed: "Recently Viewed",
    freeDelivery: "Fast Delivery",
    warranty: "Warranty",
    returnPolicy: "7-Day Return",
    share: "Share",
    category: "Category",
    brand: "Brand",
    material: "Material",
    country: "Country",
    save: "Save",
    productDetails: "Product Details",

    // ═══════════ Cart ═══════════
    shoppingCart: "Shopping Cart",
    emptyCart: "Your cart is empty",
    emptyCartMessage:
      "Looks like you haven't added anything yet. Start shopping to fill it up!",
    startShopping: "Start Shopping",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    delivery: "Delivery",
    proceedCheckout: "Proceed to Checkout",
    continueShopping: "Continue Shopping",
    remove: "Remove",
    items: "items",
    item: "item",

    // ═══════════ Checkout ═══════════
    checkout: "Checkout",
    fullName: "Full Name",
    phone: "Phone",
    address: "Delivery Address",
    note: "Note (optional)",
    placeOrder: "Place Order",
    placeOrderWhatsApp: "Place Order via WhatsApp",
    placeOrderWebsite: "Place Order on Website",
    paymentMethod: "Payment Method",
    cashOnDelivery: "Cash on Delivery",
    coupon: "Have a coupon?",
    apply: "Apply",
    couponCode: "Enter code",
    orderingAs: "Ordering as",
    howToOrder: "How would you like to place your order?",

    // ═══════════ Orders ═══════════
    myOrders: "My Orders",
    noOrders: "No orders yet",
    noOrdersMessage:
      "You haven't placed any orders. Start shopping to see them here!",
    orderId: "Order ID",
    status: "Status",
    pending: "Pending",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    cancelOrder: "Cancel Order",
    viewDetails: "View Full Details",
    orderHistory: "order(s) in your history",

    // ═══════════ Profile ═══════════
    myProfile: "My Profile",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    bio: "Bio",
    city: "City",
    deleteProfile: "Delete Profile",
    joined: "Joined",
    profileDetails: "Profile Details",
    noBio: "No bio yet",
    noAddress: "No address added yet",
    noPhone: "No phone yet",
    noCity: "No city yet",

    // ═══════════ Auth ═══════════
    welcomeBack: "Welcome Back",
    loginSubtitle: "Login to your account",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    createAccount: "Create Account",
    fullNamePlaceholder: "John Doe",
    confirmPassword: "Confirm Password",
    loginNow: "Login",
    signupNow: "Sign Up",
    emailOrAdminId: "Email or Admin ID",
    loginTips: "Login tips",
    adminLogin: "Admin login",
    clientLogin: "Client login",

    // ═══════════ About Page ═══════════
    happyCustomers: "Happy Customers",
    years: "Years",
    satisfaction: "Satisfaction",
    ourMission: "Our Mission",
    ourMissionDesc:
      "Make quality products accessible to everyone in Bangladesh at fair prices.",
    ourVision: "Our Vision",
    ourVisionDesc:
      "Become the most trusted online shop in Bangladesh with unmatched service.",
    ourValues: "Our Values",
    ourValuesDesc:
      "Honesty, quality, and customer-first approach in everything we do.",
    ourStory: "Our Story",
    story1:
      "We started our journey with a simple mission — to make quality products accessible to everyone in Bangladesh at fair prices.",
    story2:
      "Today, we serve thousands of happy customers and continue to grow every day. Every product we sell is carefully selected to ensure the best quality.",
    story3:
      "From humble beginnings to becoming a trusted name in online shopping, our commitment to excellence has never wavered.",
    whatDrivesUs: "What Drives Us",

    // ═══════════ Contact Page ═══════════
    contactMessage: "We'd love to hear from you.",
    getInTouch: "Get in Touch",
    contactDesc:
      "Have a question about a product? Need help with your order? We're here for you.",
    businessHours: "Business Hours",
    quickResponse: "Quick Response",
    wePromise: "We Promise",
    sendMessage: "Send a Message",

    // ═══════════ Footer ═══════════
    allRights: "All rights reserved.",
    madeWith: "Made with",
    inBangladesh: "in Bangladesh",
    quickLinks: "Quick Links",
    myAccount: "My Account",
    followUs: "Follow Us",
    faq: "FAQ",
    terms: "Terms",
    privacy: "Privacy",

    // ═══════════ Payment ═══════════
    payOnReceive: "Pay when you receive",
    mobileBanking: "Mobile banking",
    card: "Card",
    comingSoon: "Coming soon",

    // ═══════════ Common ═══════════
    back: "Back",
    close: "Close",
    loading: "Loading...",
    yes: "Yes",
    no: "No",
    clear: "Clear",
    clearAll: "Clear All",
    showAll: "Show All",
    showLess: "Show Less",
    moreItems: "more items",
    viewStore: "View Store",
    or: "or",
    save2: "Save",
    support: "Support",

    // ═══════════ Cookies ═══════════
    cookieTitle: "We use cookies 🍪",
    cookieMessage:
      "We use cookies to improve your experience, personalize content, and analyze our traffic.",
    accept: "Accept All",
    reject: "Reject",
    privacyPolicy: "Privacy Policy",

    // ═══════════ Extra ═══════════
    categoryAll: "All",
    priceRange: "Price Range",
    min: "Min",
    max: "Max",
    apply2: "Apply",
    resetFilters: "Reset Filters",
    price2: "Price",
    brand2: "Brand",
    color: "Color",
    size: "Size",
    weight: "Weight",
    dimensions: "Dimensions",
    inStockLabel: "In Stock",
    outOfStockLabel: "Out of Stock",
    preOrder: "Pre-Order",
    newArrival: "New Arrival",
    bestSeller: "Best Seller",
    onSale: "On Sale",
    hot: "Hot",
    limited: "Limited",
    featured: "Featured",
    popular: "Popular",
    sale: "Sale",
    discount: "Discount",
    free: "Free",
    sameDay: "Same Day",
    tomorrow: "Tomorrow",
    days: "days",

    // ═══════════ FAQ ═══════════
    faqTitle: "Frequently Asked Questions",
    faqSubtitle:
      "Find answers to common questions about our products and services",
    stillHaveQuestions: "Still have questions?",
    faqContactMsg: "We're here to help! Contact our support team",

    // ═══════════ Terms ═══════════
    termsTitle: "Terms of Service",
    termsIntro:
      "Welcome to our store. Please read these terms carefully before using our services.",
    lastUpdated: "Last updated",

    // ═══════════ Privacy ═══════════
    privacyTitle: "Privacy Policy",
    privacyIntro:
      "Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.",

    // ═══════════ NotFound ═══════════
    pageNotFound: "Page Not Found",
    pageNotFoundDesc:
      "Oops! The page you're looking for seems to have wandered off. Let's get you back on track.",
    goBack: "Go Back",
    browse: "Browse",
    popularPages: "Popular Pages",

    // ═══════════ Share ═══════════
    copyLink: "Copy Link",

    // ═══════════ Invoice ═══════════
    downloadInvoice: "Download Invoice",
    printInvoice: "Print",

    // ═══════════ Extras ═══════════
    hotDeal: "Hot Deal",
    orderPlaced: "Order Placed! 🎉",
    orderThankYou: "Thank you for your order. We'll contact you soon to confirm.",
    viewMyOrders: "View My Orders",
    whatsappNote:
      "We've also prepared your order for WhatsApp. Please send it to confirm.",
    callNote: "We'll call you within 24 hours to confirm delivery details.",

    // ═══════════ Admin Panel ═══════════
    dashboard: "Dashboard",
    dashboardWelcome: "Welcome back! Here's your store overview",
    productsAdmin: "Products",
    ordersAdmin: "Orders",
    settingsAdmin: "Settings",
    contentAdmin: "Content",
    appearanceAdmin: "Appearance",
    administrator: "Administrator",
    totalProducts: "Total Products",
    totalOrders: "Total Orders",
    revenue: "Revenue",
    deliveredRevenue: "Delivered Revenue",
    orderStatus: "Order Status",
    manage: "Manage",
    recentOrders: "Recent Orders",
    analytics: "Analytics",
    pageViews: "Page Views",
    sessions: "Sessions",
    events: "Events",
    uniquePages: "Unique Pages",
    topPages: "Top Pages",
    topEvents: "Top Events",
    noAnalyticsData: "No analytics data yet. Browse some pages to see stats!",
    username: "Username",
    adminLoginSubtitle: "Enter your credentials to access the panel",
    demoCredentials: "Demo",

    // Admin Products
    addProduct: "Add Product",
    editProduct: "Edit Product",
    searchProducts: "Search products...",
    productName: "Product Name",
    productImage: "Product Image",
    uploadFromDevice: "Upload from Device",
    useImageUrl: "Use Image URL",
    clickToUpload: "Click to upload or drag & drop",
    uploadHint: "PNG, JPG, JPEG up to 2MB",
    gallery: "Gallery",
    setAsMain: "Set as Main",
    mainImage: "Main",
    removeImage: "Remove Image",
    willCreateCategory: "Will create new category",
    typeYourOwn: "type your own or pick",
    update: "Update",
    add: "Add",

    // Admin Orders
    allStatus: "All Status",
    allSources: "All Sources",
    searchOrders: "Search by ID, name, phone...",
    updateStatus: "Update Status",
    noOrdersMatch: "No orders match your filters",

    // Admin Settings
    storeInformation: "Store Information",
    websiteName: "Website Name",
    tagline: "Tagline",
    whatsappNumber: "WhatsApp Number",
    whatsappHint: "With country code, without +",
    phone2: "Phone",
    email2: "Email",
    address2: "Address",
    deliveryCharge: "Delivery Charge (৳)",
    currencySymbol: "Currency Symbol",
    saveAll: "Save All",
    resetDefault: "Reset Default",

    // Admin Content
    websiteContent: "Website Content",
    websiteContentDesc: "Edit text, images, links — press Save to apply",
    global: "Global",
    announcement: "Announcement",
    navbar: "Navbar",
    hero: "Hero",
    features: "Features",
    featured: "Featured",
    cta: "CTA",
    footer2: "Footer",
    saveChanges2: "Save Changes",
    discard: "Discard",
    resetSection: "Reset Section",
    resetAll: "Reset All",
    export: "Export",
    import: "Import",
    unsavedChanges: "You have unsaved changes",
    unsavedNotice: "Unsaved changes — press Save",

    // Admin Appearance
    websiteAppearance: "Website Appearance",
    websiteAppearanceDesc:
      "Customize individual components — Navbar, Hero, Cards, Buttons, and more",
    componentCustomization: "Component Customization",
    active: "Active",
    disabled: "Disabled",
    globalSettings: "Global",
    productCard: "Product Card",
    buttons: "Buttons",
    forms: "Forms / Inputs",
    presets: "Presets",
    colors: "Colors",
    typography: "Typography",
    layout: "Layout",
    effects: "Effects",
    defaultTheme: "Default (Yellow)",
    oceanBlue: "Ocean Blue",
    forestGreen: "Forest Green",
    sunsetOrange: "Sunset Orange",
    rosePink: "Rose Pink",
    royalPurple: "Royal Purple",
    premiumBlack: "Premium Black",
  },

  bn: {
    // ═══════════ Navbar ═══════════
    home: "হোম",
    products: "পণ্য",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ",
    cart: "কার্ট",
    wishlist: "পছন্দের তালিকা",
    profile: "প্রোফাইল",
    orders: "আমার অর্ডার",
    login: "লগইন",
    signup: "সাইন আপ",
    logout: "লগআউট",
    search: "পণ্য খুঁজুন...",
    adminPanel: "এডমিন প্যানেল",

    // ═══════════ Home ═══════════
    welcome: "আমার শপে স্বাগতম",
    welcomeSubtitle:
      "সাশ্রয়ী মূল্যে মানসম্পন্ন পণ্য। সারা বাংলাদেশে দ্রুত ডেলিভারি।",
    shopNow: "এখনই কিনুন",
    featuredHighlights: "🔥 ফিচার্ড হাইলাইটস",
    featuredSubtitle: "আমাদের শীর্ষ পণ্যগুলির অটো-স্লাইডিং শোকেস",
    whyChooseUs: "কেন আমাদের বেছে নেবেন",
    featuredProducts: "ফিচার্ড পণ্য",
    viewAll: "সব দেখুন",
    aboutUs: "আমাদের সম্পর্কে",
    readyToShop: "আমাদের সাথে কেনাকাটা করতে প্রস্তুত?",
    browseCollection:
      "আমাদের সংগ্রহ ব্রাউজ করুন এবং সারা বাংলাদেশে দ্রুত ডেলিভারি উপভোগ করুন।",

    // ═══════════ Products ═══════════
    allProducts: "সব পণ্য",
    browseCollection2: "আমাদের মানসম্পন্ন পণ্যের সংগ্রহ ব্রাউজ করুন",
    noProducts: "এখনো কোনো পণ্য নেই। শীঘ্রই আবার দেখুন!",
    noProductsFound: "কোনো পণ্য পাওয়া যায়নি",
    filters: "ফিল্টার",
    sortBy: "সাজান",
    clearFilters: "ফিল্টার মুছুন",
    newestFirst: "নতুন প্রথমে",
    priceLowHigh: "দাম: কম থেকে বেশি",
    priceHighLow: "দাম: বেশি থেকে কম",
    topRated: "সেরা রেটিং",
    nameAsc: "নাম: A-Z",
    nameDesc: "নাম: Z-A",
    price: "মূল্য পরিসীমা",
    inStock: "শুধু স্টকে আছে",
    result: "টি ফলাফল",
    results: "টি ফলাফল",
    showing: "দেখাচ্ছে",
    of: "এর মধ্যে",

    // ═══════════ Product Detail ═══════════
    addToCart: "কার্টে যোগ করুন",
    buyNow: "এখনই কিনুন",
    orderWhatsApp: "WhatsApp এ অর্ডার",
    outOfStock: "স্টক নেই",
    quantity: "পরিমাণ",
    total: "মোট",
    description: "বর্ণনা",
    specifications: "স্পেসিফিকেশন",
    reviews: "রিভিউ",
    writeReview: "রিভিউ লিখুন",
    relatedProducts: "সম্পর্কিত পণ্য",
    recentlyViewed: "সম্প্রতি দেখা",
    freeDelivery: "দ্রুত ডেলিভারি",
    warranty: "ওয়ারেন্টি",
    returnPolicy: "৭ দিনের রিটার্ন",
    share: "শেয়ার",
    category: "ক্যাটাগরি",
    brand: "ব্র্যান্ড",
    material: "উপাদান",
    country: "দেশ",
    save: "সাশ্রয়",
    productDetails: "পণ্যের বিবরণ",

    // ═══════════ Cart ═══════════
    shoppingCart: "শপিং কার্ট",
    emptyCart: "আপনার কার্ট খালি",
    emptyCartMessage:
      "মনে হচ্ছে আপনি এখনো কিছু যোগ করেননি। শুরু করতে কেনাকাটা করুন!",
    startShopping: "কেনাকাটা শুরু",
    orderSummary: "অর্ডার সারসংক্ষেপ",
    subtotal: "সাবটোটাল",
    delivery: "ডেলিভারি",
    proceedCheckout: "চেকআউটে যান",
    continueShopping: "কেনাকাটা চালিয়ে যান",
    remove: "সরান",
    items: "টি পণ্য",
    item: "টি পণ্য",

    // ═══════════ Checkout ═══════════
    checkout: "চেকআউট",
    fullName: "পুরো নাম",
    phone: "ফোন",
    address: "ডেলিভারি ঠিকানা",
    note: "নোট (ঐচ্ছিক)",
    placeOrder: "অর্ডার করুন",
    placeOrderWhatsApp: "WhatsApp এ অর্ডার করুন",
    placeOrderWebsite: "ওয়েবসাইটে অর্ডার করুন",
    paymentMethod: "পেমেন্ট পদ্ধতি",
    cashOnDelivery: "ক্যাশ অন ডেলিভারি",
    coupon: "কুপন আছে?",
    apply: "প্রয়োগ করুন",
    couponCode: "কোড লিখুন",
    orderingAs: "অর্ডার করছেন",
    howToOrder: "কীভাবে অর্ডার করতে চান?",

    // ═══════════ Orders ═══════════
    myOrders: "আমার অর্ডার",
    noOrders: "এখনো কোনো অর্ডার নেই",
    noOrdersMessage:
      "আপনি কোনো অর্ডার দেননি। শুরু করতে কেনাকাটা করুন!",
    orderId: "অর্ডার আইডি",
    status: "স্ট্যাটাস",
    pending: "মুলতুবি",
    confirmed: "নিশ্চিত",
    shipped: "পাঠানো হয়েছে",
    delivered: "ডেলিভার হয়েছে",
    cancelled: "বাতিল",
    cancelOrder: "অর্ডার বাতিল",
    viewDetails: "সম্পূর্ণ বিবরণ",
    orderHistory: "টি অর্ডার আপনার ইতিহাসে",

    // ═══════════ Profile ═══════════
    myProfile: "আমার প্রোফাইল",
    editProfile: "প্রোফাইল সম্পাদনা",
    saveChanges: "পরিবর্তন সংরক্ষণ",
    cancel: "বাতিল",
    bio: "বায়ো",
    city: "শহর",
    deleteProfile: "প্রোফাইল মুছুন",
    joined: "যোগদান",
    profileDetails: "প্রোফাইল বিবরণ",
    noBio: "এখনো বায়ো নেই",
    noAddress: "ঠিকানা যোগ করা হয়নি",
    noPhone: "ফোন যোগ করা হয়নি",
    noCity: "শহর যোগ করা হয়নি",

    // ═══════════ Auth ═══════════
    welcomeBack: "স্বাগতম",
    loginSubtitle: "আপনার অ্যাকাউন্টে লগইন করুন",
    email: "ইমেইল",
    password: "পাসওয়ার্ড",
    forgotPassword: "পাসওয়ার্ড ভুলেছেন?",
    noAccount: "অ্যাকাউন্ট নেই?",
    hasAccount: "অ্যাকাউন্ট আছে?",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    fullNamePlaceholder: "মাহিম আহমেদ",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    loginNow: "লগইন",
    signupNow: "সাইন আপ",
    emailOrAdminId: "ইমেইল বা অ্যাডমিন আইডি",
    loginTips: "লগইন টিপস",
    adminLogin: "অ্যাডমিন লগইন",
    clientLogin: "ক্লায়েন্ট লগইন",

    // ═══════════ About Page ═══════════
    happyCustomers: "সন্তুষ্ট গ্রাহক",
    years: "বছর",
    satisfaction: "সন্তুষ্টি",
    ourMission: "আমাদের লক্ষ্য",
    ourMissionDesc:
      "সাশ্রয়ী মূল্যে বাংলাদেশের সবার জন্য মানসম্পন্ন পণ্য পৌঁছে দেওয়া।",
    ourVision: "আমাদের স্বপ্ন",
    ourVisionDesc: "বাংলাদেশের সবচেয়ে বিশ্বস্ত অনলাইন শপ হয়ে ওঠা।",
    ourValues: "আমাদের মূল্যবোধ",
    ourValuesDesc: "সততা, গুণমান এবং গ্রাহক-প্রথম দৃষ্টিভঙ্গি।",
    ourStory: "আমাদের গল্প",
    story1:
      "আমরা আমাদের যাত্রা শুরু করেছিলাম একটি সহজ লক্ষ্য নিয়ে — সাশ্রয়ী মূল্যে সবার জন্য মানসম্পন্ন পণ্য পৌঁছে দেওয়া।",
    story2:
      "আজ আমরা হাজার হাজার সন্তুষ্ট গ্রাহককে সেবা দিচ্ছি এবং প্রতিদিন বাড়ছি। প্রতিটি পণ্য সেরা গুণমানের জন্য বাছাই করা।",
    story3:
      "ছোট থেকে শুরু করে অনলাইন কেনাকাটার একটি বিশ্বস্ত নাম হয়ে ওঠা পর্যন্ত, আমাদের উৎকর্ষের প্রতি প্রতিশ্রুতি কখনো কমেনি।",
    whatDrivesUs: "আমাদের চালিকাশক্তি",

    // ═══════════ Contact Page ═══════════
    contactMessage: "আমরা আপনার কথা শুনতে চাই।",
    getInTouch: "যোগাযোগ করুন",
    contactDesc:
      "কোনো পণ্য সম্পর্কে প্রশ্ন আছে? আপনার অর্ডারে সাহায্য দরকার? আমরা আছি।",
    businessHours: "ব্যবসার সময়",
    quickResponse: "দ্রুত প্রতিক্রিয়া",
    wePromise: "আমাদের প্রতিশ্রুতি",
    sendMessage: "বার্তা পাঠান",

    // ═══════════ Footer ═══════════
    allRights: "সর্বস্বত্ব সংরক্ষিত।",
    madeWith: "তৈরি",
    inBangladesh: "বাংলাদেশে",
    quickLinks: "দ্রুত লিঙ্ক",
    myAccount: "আমার অ্যাকাউন্ট",
    followUs: "আমাদের অনুসরণ করুন",
    faq: "সাধারণ প্রশ্ন",
    terms: "শর্তাবলী",
    privacy: "গোপনীয়তা",

    // ═══════════ Payment ═══════════
    payOnReceive: "পণ্য পেয়ে পেমেন্ট",
    mobileBanking: "মোবাইল ব্যাংকিং",
    card: "কার্ড",
    comingSoon: "শীঘ্রই আসছে",

    // ═══════════ Common ═══════════
    back: "পিছনে",
    close: "বন্ধ",
    loading: "লোড হচ্ছে...",
    yes: "হ্যাঁ",
    no: "না",
    clear: "মুছুন",
    clearAll: "সব মুছুন",
    showAll: "সব দেখান",
    showLess: "কম দেখান",
    moreItems: "আরো পণ্য",
    viewStore: "স্টোর দেখুন",
    or: "অথবা",
    save2: "সংরক্ষণ",
    support: "সহায়তা",

    // ═══════════ Cookies ═══════════
    cookieTitle: "আমরা কুকিজ ব্যবহার করি 🍪",
    cookieMessage:
      "আমরা আপনার অভিজ্ঞতা উন্নত করতে, বিষয়বস্তু ব্যক্তিগতকৃত করতে এবং ট্রাফিক বিশ্লেষণ করতে কুকিজ ব্যবহার করি।",
    accept: "সব গ্রহণ",
    reject: "প্রত্যাখ্যান",
    privacyPolicy: "গোপনীয়তা নীতি",

    // ═══════════ Extra ═══════════
    categoryAll: "সব",
    priceRange: "মূল্য পরিসীমা",
    min: "সর্বনিম্ন",
    max: "সর্বোচ্চ",
    apply2: "প্রয়োগ",
    resetFilters: "ফিল্টার রিসেট",
    price2: "মূল্য",
    brand2: "ব্র্যান্ড",
    color: "রঙ",
    size: "সাইজ",
    weight: "ওজন",
    dimensions: "মাত্রা",
    inStockLabel: "স্টকে আছে",
    outOfStockLabel: "স্টক নেই",
    preOrder: "প্রি-অর্ডার",
    newArrival: "নতুন এসেছে",
    bestSeller: "বেস্ট সেলার",
    onSale: "ছাড়ে",
    hot: "হট",
    limited: "সীমিত",
    featured: "ফিচার্ড",
    popular: "জনপ্রিয়",
    sale: "বিক্রয়",
    discount: "ছাড়",
    free: "ফ্রি",
    sameDay: "একই দিনে",
    tomorrow: "আগামীকাল",
    days: "দিন",

    // ═══════════ FAQ ═══════════
    faqTitle: "সাধারণ জিজ্ঞাসা",
    faqSubtitle: "আমাদের পণ্য ও সেবা সম্পর্কে সাধারণ প্রশ্নের উত্তর",
    stillHaveQuestions: "আরো প্রশ্ন আছে?",
    faqContactMsg: "আমরা সাহায্য করতে প্রস্তুত! যোগাযোগ করুন।",

    // ═══════════ Terms ═══════════
    termsTitle: "সেবার শর্তাবলী",
    termsIntro:
      "আমাদের স্টোরে স্বাগতম। সেবা ব্যবহারের আগে এই শর্তাবলী পড়ুন।",
    lastUpdated: "সর্বশেষ আপডেট",

    // ═══════════ Privacy ═══════════
    privacyTitle: "গোপনীয়তা নীতি",
    privacyIntro:
      "আপনার গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ। এই নীতিতে আমরা কীভাবে তথ্য সংগ্রহ, ব্যবহার ও সুরক্ষা করি তা বর্ণনা করা হয়েছে।",

    // ═══════════ NotFound ═══════════
    pageNotFound: "পেজ খুঁজে পাওয়া যায়নি",
    pageNotFoundDesc:
      "দুঃখিত! আপনি যে পেজটি খুঁজছেন সেটি খুঁজে পাওয়া যায়নি।",
    goBack: "পিছনে যান",
    browse: "ব্রাউজ",
    popularPages: "জনপ্রিয় পেজ",

    // ═══════════ Share ═══════════
    copyLink: "লিঙ্ক কপি",

    // ═══════════ Invoice ═══════════
    downloadInvoice: "ইনভয়েস ডাউনলোড",
    printInvoice: "প্রিন্ট",

    // ═══════════ Extras ═══════════
    hotDeal: "হট ডিল",
    orderPlaced: "অর্ডার সম্পন্ন! 🎉",
    orderThankYou:
      "আপনার অর্ডারের জন্য ধন্যবাদ। শীঘ্রই যোগাযোগ করব।",
    viewMyOrders: "আমার অর্ডার",
    whatsappNote:
      "WhatsApp এ অর্ডারটি পাঠিয়ে নিশ্চিত করুন।",
    callNote: "২৪ ঘণ্টার মধ্যে ফোন করে ডেলিভারি নিশ্চিত করব।",

    // ═══════════ Admin Panel ═══════════
    dashboard: "ড্যাশবোর্ড",
    dashboardWelcome: "স্বাগতম! আপনার স্টোরের সারসংক্ষেপ",
    productsAdmin: "পণ্য",
    ordersAdmin: "অর্ডার",
    settingsAdmin: "সেটিংস",
    contentAdmin: "কনটেন্ট",
    appearanceAdmin: "অ্যাপিয়ারেন্স",
    administrator: "অ্যাডমিনিস্ট্রেটর",
    totalProducts: "মোট পণ্য",
    totalOrders: "মোট অর্ডার",
    revenue: "আয়",
    deliveredRevenue: "ডেলিভার হওয়া আয়",
    orderStatus: "অর্ডার স্ট্যাটাস",
    manage: "পরিচালনা",
    recentOrders: "সাম্প্রতিক অর্ডার",
    analytics: "অ্যানালিটিক্স",
    pageViews: "পেজ ভিউ",
    sessions: "সেশন",
    events: "ইভেন্ট",
    uniquePages: "ইউনিক পেজ",
    topPages: "শীর্ষ পেজ",
    topEvents: "শীর্ষ ইভেন্ট",
    noAnalyticsData:
      "এখনো অ্যানালিটিক্স ডেটা নেই। কিছু পেজ ব্রাউজ করুন!",
    username: "ইউজারনেম",
    adminLoginSubtitle: "প্যানেলে প্রবেশ করতে আপনার তথ্য দিন",
    demoCredentials: "ডেমো",

    // Admin Products
    addProduct: "পণ্য যোগ করুন",
    editProduct: "পণ্য সম্পাদনা",
    searchProducts: "পণ্য খুঁজুন...",
    productName: "পণ্যের নাম",
    productImage: "পণ্যের ছবি",
    uploadFromDevice: "ডিভাইস থেকে আপলোড",
    useImageUrl: "ইমেজ URL ব্যবহার",
    clickToUpload: "ক্লিক করে আপলোড করুন বা ড্র্যাগ & ড্রপ",
    uploadHint: "PNG, JPG, JPEG ২MB পর্যন্ত",
    gallery: "গ্যালারি",
    setAsMain: "প্রধান হিসেবে সেট করুন",
    mainImage: "প্রধান",
    removeImage: "ছবি সরান",
    willCreateCategory: "নতুন ক্যাটাগরি তৈরি হবে",
    typeYourOwn: "নিজেরটি লিখুন বা নির্বাচন করুন",
    update: "আপডেট",
    add: "যোগ করুন",

    // Admin Orders
    allStatus: "সব স্ট্যাটাস",
    allSources: "সব সোর্স",
    searchOrders: "আইডি, নাম, ফোন দিয়ে খুঁজুন...",
    updateStatus: "স্ট্যাটাস আপডেট",
    noOrdersMatch: "আপনার ফিল্টারের সাথে কোনো অর্ডার মেলে না",

    // Admin Settings
    storeInformation: "স্টোর তথ্য",
    websiteName: "ওয়েবসাইটের নাম",
    tagline: "ট্যাগলাইন",
    whatsappNumber: "WhatsApp নম্বর",
    whatsappHint: "দেশের কোড সহ, + ছাড়া",
    phone2: "ফোন",
    email2: "ইমেইল",
    address2: "ঠিকানা",
    deliveryCharge: "ডেলিভারি চার্জ (৳)",
    currencySymbol: "মুদ্রা প্রতীক",
    saveAll: "সব সংরক্ষণ করুন",
    resetDefault: "ডিফল্টে ফিরুন",

    // Admin Content
    websiteContent: "ওয়েবসাইট কনটেন্ট",
    websiteContentDesc:
      "টেক্সট, ছবি, লিঙ্ক সম্পাদনা করুন — প্রয়োগ করতে সংরক্ষণ চাপুন",
    global: "গ্লোবাল",
    announcement: "ঘোষণা",
    navbar: "নেভবার",
    hero: "হিরো",
    features: "ফিচার",
    featured: "ফিচার্ড",
    cta: "CTA",
    footer2: "ফুটার",
    saveChanges2: "পরিবর্তন সংরক্ষণ",
    discard: "বাতিল",
    resetSection: "সেকশন রিসেট",
    resetAll: "সব রিসেট",
    export: "এক্সপোর্ট",
    import: "ইমপোর্ট",
    unsavedChanges: "আপনার অসংরক্ষিত পরিবর্তন আছে",
    unsavedNotice: "অসংরক্ষিত পরিবর্তন — সংরক্ষণ চাপুন",

    // Admin Appearance
    websiteAppearance: "ওয়েবসাইট অ্যাপিয়ারেন্স",
    websiteAppearanceDesc:
      "আলাদা কম্পোনেন্ট কাস্টমাইজ করুন — নেভবার, হিরো, কার্ড, বাটন ইত্যাদি",
    componentCustomization: "কম্পোনেন্ট কাস্টমাইজেশন",
    active: "সক্রিয়",
    disabled: "নিষ্ক্রিয়",
    globalSettings: "গ্লোবাল",
    productCard: "পণ্য কার্ড",
    buttons: "বাটন",
    forms: "ফর্ম / ইনপুট",
    presets: "প্রিসেট",
    colors: "রঙ",
    typography: "টাইপোগ্রাফি",
    layout: "লেআউট",
    effects: "ইফেক্ট",
    defaultTheme: "ডিফল্ট (হলুদ)",
    oceanBlue: "ওশান ব্লু",
    forestGreen: "ফরেস্ট গ্রিন",
    sunsetOrange: "সানসেট অরেঞ্জ",
    rosePink: "রোজ পিঙ্ক",
    royalPurple: "রয়্যাল পার্পল",
    premiumBlack: "প্রিমিয়াম ব্ল্যাক",
  },
};

export const useLanguage = create(
  persist(
    (set, get) => ({
      lang: "en",

      setLanguage: (lang) => {
        if (TRANSLATIONS[lang]) {
          set({ lang });
          document.documentElement.lang = lang;
        }
      },

      toggleLanguage: () => {
        const next = get().lang === "en" ? "bn" : "en";
        set({ lang: next });
        document.documentElement.lang = next;
      },

      t: (key) => {
        const lang = get().lang;
        return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
      },
    }),
    {
      name: "shop-language",
      onRehydrateStorage: () => (state) => {
        if (state?.lang) {
          document.documentElement.lang = state.lang;
        }
      },
    }
  )
);