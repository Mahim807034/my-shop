/* ═══════════════════════════════════════════ */
/* 🎯 SIMPLE ANALYTICS TRACKER                */
/* ═══════════════════════════════════════════ */

const ANALYTICS_KEY = "shop-analytics";
const SESSION_KEY = "shop-session-id";

/* 🎯 Generate unique session ID */
function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/* 🎯 Get all events */
export function getAnalytics() {
  try {
    return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || "{}");
  } catch {
    return {};
  }
}

/* 🎯 Save analytics */
function saveAnalytics(data) {
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Analytics save failed:", e);
  }
}

/* 🎯 Track page view */
export function trackPageView(path) {
  const data = getAnalytics();
  const today = new Date().toISOString().slice(0, 10);

  if (!data.pageViews) data.pageViews = {};
  if (!data.pageViews[path]) data.pageViews[path] = 0;

  data.pageViews[path] += 1;

  // Daily views
  if (!data.dailyViews) data.dailyViews = {};
  if (!data.dailyViews[today]) data.dailyViews[today] = 0;
  data.dailyViews[today] += 1;

  // Sessions
  if (!data.sessions) data.sessions = [];
  const sessionId = getSessionId();
  if (!data.sessions.includes(sessionId)) {
    data.sessions.push(sessionId);
    // Keep only last 100 sessions
    if (data.sessions.length > 100) {
      data.sessions = data.sessions.slice(-100);
    }
  }

  saveAnalytics(data);
}

/* 🎯 Track custom event */
export function trackEvent(eventName, data = {}) {
  const analytics = getAnalytics();

  if (!analytics.events) analytics.events = [];

  analytics.events.push({
    name: eventName,
    data,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  });

  // Keep only last 200 events
  if (analytics.events.length > 200) {
    analytics.events = analytics.events.slice(-200);
  }

  saveAnalytics(analytics);
}

/* 🎯 Common events (shortcuts) */
export const track = {
  pageView: trackPageView,

  addToCart: (product) =>
    trackEvent("add_to_cart", {
      productId: product.id,
      name: product.name,
      price: product.price,
    }),

  buyNow: (product) =>
    trackEvent("buy_now", { productId: product.id, name: product.name }),

  removeFromCart: (product) =>
    trackEvent("remove_from_cart", { productId: product.id }),

  orderPlaced: (order) =>
    trackEvent("order_placed", {
      orderId: order.id,
      total: order.total,
      itemCount: order.items.length,
    }),

  search: (query) => trackEvent("search", { query }),

  filterApplied: (filters) => trackEvent("filter_applied", filters),

  productViewed: (product) =>
    trackEvent("product_viewed", { productId: product.id, name: product.name }),

  wishlistAdd: (product) =>
    trackEvent("wishlist_add", { productId: product.id }),

  wishlistRemove: (product) =>
    trackEvent("wishlist_remove", { productId: product.id }),

  login: () => trackEvent("login"),
  signup: () => trackEvent("signup"),
  logout: () => trackEvent("logout"),
  share: (type, id) => trackEvent("share", { type, id }),
};

/* 🎯 Get summary stats */
export function getAnalyticsSummary() {
  const data = getAnalytics();

  const totalSessions = data.sessions?.length || 0;
  const totalPageViews = Object.values(data.pageViews || {}).reduce(
    (sum, n) => sum + n,
    0
  );
  const uniquePages = Object.keys(data.pageViews || {}).length;

  // Top pages
  const topPages = Object.entries(data.pageViews || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, count]) => ({ path, count }));

  // Top events
  const eventCounts = {};
  (data.events || []).forEach((e) => {
    eventCounts[e.name] = (eventCounts[e.name] || 0) + 1;
  });

  const topEvents = Object.entries(eventCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return {
    totalSessions,
    totalPageViews,
    uniquePages,
    topPages,
    topEvents,
    eventsCount: data.events?.length || 0,
  };
}

/* 🎯 Clear all analytics */
export function clearAnalytics() {
  localStorage.removeItem(ANALYTICS_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}