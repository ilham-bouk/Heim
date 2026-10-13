// DEMO ONLY. These credentials are public on purpose (shown on the Sign In /
// Sign Up pages and in the README) so buyers and testers can open the admin.
// A real backend replaces this file: it verifies credentials server-side and
// returns the user's role in the session.

export const DEMO_ADMIN = {
  email: 'admin@heim.com',
  password: 'Admin1234',
  fullName: 'Heim Admin',
};

// A seeded customer that owns the sample orders (see data/orderSeed.js), so
// testers can see a populated Account space. Any 8+ character password works.
export const DEMO_CUSTOMER = {
  email: 'jane.doe@example.com',
  fullName: 'Jane Doe',
};