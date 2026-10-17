// 🎯 Real email validation (format only)
export function isValidEmailFormat(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// 🎯 Generate admin ID from real email
// mahim807034@gmail.com → mahim807034_admin
// john.doe@yahoo.com     → john.doe_admin
// ali_99@outlook.com     → ali_99_admin
export function generateAdminId(email) {
  if (!email) return "";
  const clean = email.toLowerCase().trim();
  const localPart = clean.split("@")[0] || "";
  // শুধু অক্ষর, সংখ্যা, dot, underscore রাখি
  const safe = localPart.replace(/[^a-z0-9._-]/g, "");
  return safe ? `${safe}_admin` : "admin";
}

// 🎯 Generate admin username (displayable)
// mahim807034@gmail.com → mahim807034
export function generateAdminUsername(email) {
  if (!email) return "";
  const clean = email.toLowerCase().trim();
  const localPart = clean.split("@")[0] || "";
  const safe = localPart.replace(/[^a-z0-9._-]/g, "");
  return safe || "admin";
}

// For backward compatibility
export function isAdminEmail(email) {
  if (!email) return false;
  return email.toLowerCase().includes("admin");
}

export function getUserType(email) {
  return isAdminEmail(email) ? "admin" : "client";
}