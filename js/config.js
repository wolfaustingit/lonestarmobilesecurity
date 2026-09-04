/* ============================================================
   Lonestar Mobile Security — site settings
   Edit the values below, commit, and Cloudflare Pages redeploys.
   ============================================================ */
window.LMS_CONFIG = {
  businessName: "Lonestar Mobile Security",
  legalName: "Lonestar Mobile Security",
  serviceArea: "Greater Houston, TX",

  // Contact details. Leave phone blank ("") to hide phone links until you have a number.
  phone: "",                                  // e.g. "(713) 555-0123"
  email: "info@lonestarmobilesecurity.com",

  // Pricing shown across the site (numbers only, USD per month)
  pricing: {
    tower: 750,        // per trailer, per month
    monitoring: 150    // per site, per month (flat — covers every tower on the site)
  },

  // Appointment booking.
  //  provider: "cal"       -> Cal.com   (free plan, recommended)  url e.g. "https://cal.com/your-name/consultation"
  //  provider: "calendly"  -> Calendly  (free plan)               url e.g. "https://calendly.com/your-name/consultation"
  // Leave url blank ("") and the site shows a "Request a consultation" form that emails you instead.
  booking: {
    provider: "cal",
    url: ""
  }
};
