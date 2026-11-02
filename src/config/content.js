// Marketing numbers shown in several places (Hero, About, FAQ, Shipping).
// Edit them here once so the copy never contradicts itself.

export const STORE_STATS = {
  foundedYear: 2015,
  customers: '10,000+',
  countries: 25,
  awards: '10+',
  satisfaction: '98%',
};

export const getYearsInBusiness = (now = new Date()) => now.getFullYear() - STORE_STATS.foundedYear;