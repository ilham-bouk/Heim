// products
import chair from '../assets/chair.jpeg'
import bed from '../assets/bed.jpeg'
import lamp from '../assets/lamp.jpeg'
import table from '../assets/table.jpeg'
import sofa from '../assets/sofa.jpeg'
// categories
import livingroom from '../assets/living-room.jpeg'
import bedroom from '../assets/bedroom.png'
import kitchen from '../assets/kitchen.jpeg'
import office from '../assets/office.jpeg'
import outdoor from '../assets/outdoor.jpeg'
import lighting from '../assets/lighting.jpeg'

import blog1 from '../assets/cozy-living-room.jpeg'

// Specifications helper: keeps the product list below compact.
const spec = (dimensions, material, weight, color) => [
  { label: 'Dimensions', value: dimensions },
  { label: 'Material', value: material },
  { label: 'Weight', value: weight },
  { label: 'Color', value: color },
];

// Seed data. Bump DATA_VERSION (utils/constants.js) after editing anything here.
export const products = [
  { id: 1, name: "Modern Lounge Chair", price: 399, discount: 25, image: chair, rating: 4.8, reviews: 124, category: "Living Room", badge: "Sale", featured: true, createdAt: "2026-01-12T12:00:00.000Z", description: "Beautifully designed lounge chair with premium comfort.", specs: spec("H 82 × W 74 × D 80 cm", "Solid beech, wool blend", "12 kg", "Sand") },
  { id: 2, name: "Scandinavian Sofa", price: 1599, discount: 20, image: sofa, rating: 4.7, reviews: 256, category: "Living Room", badge: "Sale", featured: true, createdAt: "2026-01-20T12:00:00.000Z", description: "Elegant Scandinavian sofa perfect for modern homes.", specs: spec("H 85 × W 220 × D 95 cm", "Kiln-dried pine, linen", "58 kg", "Stone grey") },
  { id: 3, name: "Wooden Dining Table", price: 899, image: table, rating: 4.6, reviews: 78, category: "Kitchen", featured: true, createdAt: "2026-02-03T12:00:00.000Z", description: "Solid wood dining table, spacious and durable.", specs: spec("H 75 × W 180 × D 90 cm", "Solid oak", "45 kg", "Natural") },
  { id: 4, name: "Modern Floor Lamp", price: 189, image: lamp, rating: 4.7, reviews: 203, category: "Lighting", featured: true, createdAt: "2026-02-10T12:00:00.000Z", description: "Contemporary floor lamp with warm lighting.", specs: spec("H 165 cm, base Ø 28 cm", "Brushed steel", "6 kg", "Matte black") },
  { id: 5, name: "King Size Bed Frame", price: 1199, image: bed, rating: 4.9, reviews: 312, category: "Bedroom", badge: "Bestseller", featured: true, createdAt: "2026-02-18T12:00:00.000Z", description: "Premium king size bed frame with storage.", specs: spec("H 110 × W 170 × L 215 cm", "Solid ash, upholstered headboard", "62 kg", "Charcoal") },
  { id: 6, name: "Velvet Accent Chair", price: 349, image: chair, rating: 4.8, reviews: 145, category: "Living Room", createdAt: "2026-03-02T12:00:00.000Z", description: "Luxurious velvet accent chair in deep colors.", specs: spec("H 78 × W 70 × D 72 cm", "Velvet, hardwood frame", "11 kg", "Forest green") },
  { id: 7, name: "Minimalist Coffee Table", price: 449, image: table, rating: 4.9, reviews: 89, category: "Living Room", createdAt: "2026-03-15T12:00:00.000Z", description: "Contemporary coffee table with clean lines.", specs: spec("H 40 × W 110 × D 60 cm", "Solid walnut", "21 kg", "Walnut") },
  { id: 8, name: "Oak Bookshelf", price: 749, discount: 30, image: office, rating: 4.5, reviews: 67, category: "Office", badge: "Sale", createdAt: "2026-03-28T12:00:00.000Z", description: "Premium oak bookshelf with adjustable shelves.", specs: spec("H 180 × W 90 × D 32 cm", "Solid oak", "38 kg", "Natural oak") },
  { id: 9, name: "Linen Corner Sectional", price: 1899, image: sofa, rating: 4.6, reviews: 98, category: "Living Room", createdAt: "2026-04-05T12:00:00.000Z", description: "Deep, modular corner sectional in breathable linen.", specs: spec("H 85 × W 280 × D 190 cm", "Linen blend, pine frame", "96 kg", "Oatmeal") },
  { id: 10, name: "Round Side Table", price: 129, image: table, rating: 4.4, reviews: 61, category: "Living Room", createdAt: "2026-04-18T12:00:00.000Z", description: "Compact side table with an oak top and slim steel legs.", specs: spec("H 50 × Ø 45 cm", "Powder-coated steel, oak top", "7 kg", "Black / oak") },
  { id: 11, name: "Woven Storage Ottoman", price: 159, discount: 15, image: livingroom, rating: 4.5, reviews: 47, category: "Living Room", badge: "Sale", createdAt: "2026-05-02T12:00:00.000Z", description: "Hand-woven ottoman with hidden storage under the lid.", specs: spec("H 40 × Ø 55 cm", "Woven seagrass", "5 kg", "Natural") },
  { id: 12, name: "Upholstered Platform Bed", price: 1399, image: bed, rating: 4.8, reviews: 176, category: "Bedroom", badge: "New", createdAt: "2026-09-08T12:00:00.000Z", description: "Low-profile platform bed with a softly padded headboard.", specs: spec("H 105 × W 165 × L 215 cm", "Upholstered, beech slats", "70 kg", "Warm grey") },
  { id: 13, name: "Solid Oak Nightstand", price: 219, image: bedroom, rating: 4.6, reviews: 132, category: "Bedroom", createdAt: "2026-05-24T12:00:00.000Z", description: "Single-drawer nightstand with dovetail joinery.", specs: spec("H 50 × W 45 × D 40 cm", "Solid oak", "14 kg", "Natural") },
  { id: 14, name: "Six-Drawer Dresser", price: 799, discount: 10, image: bedroom, rating: 4.5, reviews: 84, category: "Bedroom", badge: "Sale", createdAt: "2026-06-06T12:00:00.000Z", description: "Wide dresser with smooth-glide drawers and generous storage.", specs: spec("H 85 × W 140 × D 45 cm", "Oak veneer", "52 kg", "Natural") },
  { id: 15, name: "Linen Bedding Set", price: 189, image: bed, rating: 4.9, reviews: 410, category: "Bedroom", badge: "Bestseller", createdAt: "2026-06-14T12:00:00.000Z", description: "Stonewashed linen duvet cover and pillowcases that soften with every wash.", specs: spec("Queen / King, 4 pieces", "100% washed linen", "2 kg", "Chalk") },
  { id: 16, name: "Farmhouse Bar Stool", price: 99, image: kitchen, rating: 4.3, reviews: 154, category: "Kitchen", createdAt: "2026-06-22T12:00:00.000Z", description: "Sturdy ash bar stool with a steel footrest.", specs: spec("H 65 cm, seat Ø 36 cm", "Ash, steel footrest", "5 kg", "Natural") },
  { id: 17, name: "Butcher Block Kitchen Island", price: 1099, image: kitchen, rating: 4.7, reviews: 73, category: "Kitchen", createdAt: "2026-07-03T12:00:00.000Z", description: "Mobile kitchen island with an oak butcher-block top.", specs: spec("H 90 × W 120 × D 60 cm", "Butcher-block oak", "48 kg", "Natural") },
  { id: 18, name: "Extendable Dining Table", price: 1299, discount: 15, image: table, rating: 4.8, reviews: 119, category: "Kitchen", badge: "Sale", createdAt: "2026-07-12T12:00:00.000Z", description: "Seats six, extends to eight with a hidden leaf.", specs: spec("H 75 × W 160–220 × D 90 cm", "Solid oak", "55 kg", "Natural") },
  { id: 19, name: "Ergonomic Office Chair", price: 429, image: chair, rating: 4.7, reviews: 288, category: "Office", badge: "Bestseller", createdAt: "2026-07-20T12:00:00.000Z", description: "Breathable mesh chair with adjustable lumbar support.", specs: spec("H 110–120 × W 65 cm", "Mesh, aluminium base", "16 kg", "Black") },
  { id: 20, name: "Standing Desk", price: 649, image: office, rating: 4.8, reviews: 205, category: "Office", badge: "New", createdAt: "2026-09-15T12:00:00.000Z", description: "Electric height-adjustable desk with a bamboo top.", specs: spec("H 72–120 × W 140 × D 70 cm", "Bamboo top, steel frame", "34 kg", "Bamboo / black") },
  { id: 21, name: "Floating Wall Shelf Set", price: 89, image: office, rating: 4.4, reviews: 91, category: "Office", createdAt: "2026-08-08T12:00:00.000Z", description: "Set of three minimalist wall shelves with hidden brackets.", specs: spec("W 60 × D 20 cm (set of 3)", "Powder-coated steel", "4 kg", "White") },
  { id: 22, name: "Teak Patio Dining Set", price: 1799, image: outdoor, rating: 4.7, reviews: 56, category: "Outdoor", createdAt: "2026-08-14T12:00:00.000Z", description: "Six-seat teak dining set built to weather the seasons.", specs: spec("H 75 × W 200 × D 100 cm", "FSC teak", "68 kg", "Natural teak") },
  { id: 23, name: "Rattan Lounge Chair", price: 329, image: outdoor, rating: 4.6, reviews: 102, category: "Outdoor", createdAt: "2026-08-21T12:00:00.000Z", description: "All-weather rattan lounge chair with a cushioned seat.", specs: spec("H 85 × W 70 × D 75 cm", "Rattan, aluminium frame", "9 kg", "Natural") },
  { id: 24, name: "Garden Bench", price: 249, discount: 20, image: outdoor, rating: 4.5, reviews: 77, category: "Outdoor", badge: "Sale", createdAt: "2026-08-27T12:00:00.000Z", description: "Two-seater acacia bench with a powder-coated steel frame.", specs: spec("H 85 × W 150 × D 55 cm", "Acacia, steel", "24 kg", "Natural") },
  { id: 25, name: "Outdoor Sofa Set", price: 1499, image: outdoor, rating: 4.8, reviews: 64, category: "Outdoor", badge: "New", createdAt: "2026-09-22T12:00:00.000Z", description: "Modular outdoor sofa with quick-dry, UV-resistant cushions.", specs: spec("H 80 × W 240 × D 90 cm", "Aluminium, olefin fabric", "42 kg", "Sand") },
  { id: 26, name: "Arc Floor Lamp", price: 229, image: lamp, rating: 4.7, reviews: 142, category: "Lighting", createdAt: "2026-08-30T12:00:00.000Z", description: "Sweeping arc lamp with a marble base and brass finish.", specs: spec("H 200 × W 100 cm", "Steel, marble base", "14 kg", "Brass") },
  { id: 27, name: "Ceramic Table Lamp", price: 119, image: lighting, rating: 4.6, reviews: 188, category: "Lighting", createdAt: "2026-09-02T12:00:00.000Z", description: "Hand-glazed ceramic base with a soft linen shade.", specs: spec("H 45 × Ø 28 cm", "Glazed ceramic, linen shade", "3 kg", "Ivory") },
  { id: 28, name: "Rattan Pendant Light", price: 139, image: lighting, rating: 4.8, reviews: 95, category: "Lighting", badge: "New", createdAt: "2026-09-29T12:00:00.000Z", description: "Woven rattan pendant that casts warm, patterned light.", specs: spec("H 30 × Ø 45 cm", "Natural rattan", "1.5 kg", "Natural") },
];

export const categories = [
  { id: 1, name: "Living Room", image: livingroom },
  { id: 2, name: "Bedroom", image: bedroom },
  { id: 3, name: "Kitchen", image: kitchen },
  { id: 4, name: "Office", image: office },
  { id: 5, name: "Outdoor", image: outdoor },
  { id: 6, name: "Lighting", image: lighting },
];

// content: paragraphs separated by a blank line.
// publishedAt: full ISO string (noon UTC, so the displayed day doesn't shift by timezone).
export const blogPosts = [
  { id: 1, title: "10 Tips for Creating a Cozy Living Space", excerpt: "Transform your living room into a warm, inviting sanctuary with these expert design tips that combine comfort and style.", content: "Creating a cozy living space is about more than just furniture—it's about creating an atmosphere. In this comprehensive guide, we'll explore the top 10 tips for transforming your living room into a warm, inviting sanctuary where you'll love to spend time with family and friends.\n\nStart with layered lighting, soft textiles and a palette of warm neutrals, then add personal touches like books, plants and framed prints so the room feels lived in rather than staged.", author: "Sarah Johnson", publishedAt: "2026-03-15T12:00:00.000Z", readTime: "5 min read", category: "Interior Design", tags: ["cozy", "living room"], image: blog1, featured: true, status: "published" },
  { id: 2, title: "The Rise of Sustainable Furniture", excerpt: "Discover how eco-friendly materials are shaping the future of the furniture industry and why it matters.", content: "Sustainability isn't just a trend—it's the future of furniture design. Learn how manufacturers are innovating with recycled materials, renewable resources, and circular design principles to create beautiful, environmentally responsible pieces.\n\nLook for FSC-certified wood, recycled metals and natural fibres, and favour pieces built to be repaired rather than replaced; longevity is the most sustainable feature of all.", author: "Emma Rodriguez", publishedAt: "2026-03-10T12:00:00.000Z", readTime: "7 min read", category: "Sustainability", tags: ["eco-friendly", "materials"], image: blog1, featured: true, status: "published" },
  { id: 3, title: "Minimalist Bedroom Design Ideas", excerpt: "Less is more. Explore beautiful minimalist bedroom designs that promote relaxation and better sleep.", content: "A minimalist bedroom is more than just clean lines and empty walls. It's about creating a serene environment that promotes rest and relaxation. Discover how to apply minimalist principles to your bedroom for a sanctuary that encourages quality sleep.\n\nKeep the palette calm, limit surfaces to what you actually use, and choose a bed frame with built-in storage so everything else can disappear.", author: "Michael Chen", publishedAt: "2026-03-05T12:00:00.000Z", readTime: "6 min read", category: "Bedroom Design", tags: ["minimalist", "bedroom"], image: blog1, featured: false, status: "published" },
  { id: 4, title: "How to Mix and Match Furniture Styles", excerpt: "Learn the art of combining different furniture styles to create a unique and personalized home.", content: "Gone are the days of matching furniture sets. Modern interior design celebrates the art of mixing styles—combining contemporary with vintage, minimalist with eclectic. This guide will teach you how to do it with confidence and create a space that truly reflects your personality.\n\nAnchor the room with one dominant style, then add contrast through material, shape and age so the mix feels deliberate rather than accidental.", author: "Sarah Johnson", publishedAt: "2026-02-28T12:00:00.000Z", readTime: "8 min read", category: "Interior Design", tags: ["style", "eclectic"], image: blog1, featured: false, status: "published" },
  { id: 5, title: "Color Psychology in Interior Design", excerpt: "Understand how colors influence mood and emotion, and use this knowledge to design your perfect space.", content: "Colors are more powerful than we often realize. They can energize a room, create calm, or evoke specific emotions. In this deep dive into color psychology, we'll explore which colors work best for different rooms and how to use them to create the desired atmosphere.\n\nSoft blues and greens suit bedrooms, warm yellows energise kitchens, and deep neutrals add calm to studies. Test samples in your own light before committing.", author: "David Park", publishedAt: "2026-02-20T12:00:00.000Z", readTime: "6 min read", category: "Design Tips", tags: ["color", "mood"], image: blog1, featured: false, status: "published" },
  { id: 6, title: "Office Furniture That Boosts Productivity", excerpt: "Design your home office with furniture choices that enhance focus, comfort, and productivity.", content: "Working from home has become the new normal. Your office furniture choices can significantly impact your productivity and well-being. Explore ergonomic designs, layout strategies, and furniture selections that create an inspiring and productive workspace.\n\nPosition your screen at eye level, keep feet flat on the floor, and leave room to stand and stretch. Small adjustments add up over a working day.", author: "Emma Rodriguez", publishedAt: "2026-02-15T12:00:00.000Z", readTime: "7 min read", category: "Office Design", tags: ["home office", "ergonomics"], image: blog1, featured: false, status: "published" },
  { id: 7, title: "The Ultimate Guide to Small Space Living", excerpt: "Maximize your small space with smart furniture choices and clever design strategies.", content: "Living in a small space doesn't mean sacrificing style or comfort. With the right furniture and design strategies, you can create a functional, beautiful home. Learn how to choose multi-functional pieces, optimize layouts, and use design tricks to make your space feel larger.\n\nVertical storage, fold-away tables and pieces with raised legs keep sightlines open, which makes a compact room feel considerably larger.", author: "Michael Chen", publishedAt: "2026-02-10T12:00:00.000Z", readTime: "9 min read", category: "Space Saving", tags: ["small spaces", "storage"], image: blog1, featured: true, status: "published" },
  { id: 8, title: "Lighting Design: The Forgotten Art", excerpt: "Discover how proper lighting can transform your space and improve your quality of life.", content: "Lighting is often overlooked, but it's one of the most important elements in interior design. Beyond functionality, lighting sets the mood, highlights your furniture, and affects your health and well-being. Learn about different lighting types and how to design a comprehensive lighting plan.\n\nCombine ambient, task and accent lighting, put each on its own switch or dimmer, and choose warm bulbs for living areas.", author: "Sarah Johnson", publishedAt: "2026-02-05T12:00:00.000Z", readTime: "5 min read", category: "Design Tips", tags: ["lighting", "ambience"], image: blog1, featured: false, status: "published" },
  { id: 9, title: "Outdoor Furniture Trends for 2026", excerpt: "Explore the latest trends in outdoor furniture and create your dream outdoor living space.", content: "Outdoor living spaces have become an extension of our homes. This year brings exciting trends in materials, colors, and designs. From sustainable materials to modern modular pieces, discover what's trending and how to incorporate these styles into your outdoor space.\n\nWeather-resistant teak, powder-coated aluminium and all-weather rattan lead the field, with modular seating that adapts to the space and the guest list.", author: "David Park", publishedAt: "2026-01-30T12:00:00.000Z", readTime: "6 min read", category: "Outdoor Design", tags: ["outdoor", "trends"], image: blog1, featured: false, status: "published" },
  { id: 10, title: "Vintage Meets Modern: A Design Balance", excerpt: "Master the art of blending vintage pieces with modern design for a timeless aesthetic.", content: "The vintage-modern fusion is a design classic that never goes out of style. Learn how to find and integrate vintage pieces into a contemporary setting, create visual balance, and tell a story through your furniture choices.\n\nA single vintage statement piece in a contemporary room, or a modern accent in a traditional one, is often all it takes to create the balance.", author: "Emma Rodriguez", publishedAt: "2026-01-25T12:00:00.000Z", readTime: "7 min read", category: "Interior Design", tags: ["vintage", "modern"], image: blog1, featured: false, status: "published" },
  { id: 11, title: "Caring for Solid Wood Furniture", excerpt: "Simple habits that keep solid wood looking new for decades.", content: "Solid wood is built to last, but it still needs a little attention. Dust regularly, wipe spills immediately and keep pieces away from radiators and direct sun.\n\nOil or wax the surface once or twice a year, and use felt pads under anything that sits on top.", author: "Sarah Johnson", publishedAt: "2026-04-01T12:00:00.000Z", readTime: "4 min read", category: "Design Tips", tags: ["care", "wood"], image: blog1, featured: false, status: "draft" },
];

export const mockOrders = [
  {
    id: 'HEIM-10231',
    date: '2026-02-14',
    status: 'Delivered',
    items: [
      { productId: 1, name: 'Modern Lounge Chair', image: chair, price: 299, quantity: 1 },
      { productId: 4, name: 'Modern Floor Lamp', image: lamp, price: 189, quantity: 2 },
    ],
    subtotal: 677,
    shipping: 0,
    tax: 68,
    total: 745,
    shippingAddress: {
      fullName: 'Jane Doe',
      line1: '123 Design Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
    },
  },
  {
    id: 'HEIM-10198',
    date: '2026-01-02',
    status: 'Shipped',
    items: [
      { productId: 3, name: 'Wooden Dining Table', image: table, price: 899, quantity: 1 },
    ],
    subtotal: 899,
    shipping: 0,
    tax: 90,
    total: 989,
    shippingAddress: {
      fullName: 'Jane Doe',
      line1: '123 Design Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
    },
  },
  {
    id: 'HEIM-10102',
    date: '2025-11-20',
    status: 'Cancelled',
    items: [
      { productId: 2, name: 'Scandinavian Sofa', image: sofa, price: 1599, quantity: 1 },
    ],
    subtotal: 1599,
    shipping: 0,
    tax: 160,
    total: 1759,
    shippingAddress: {
      fullName: 'Jane Doe',
      line1: '123 Design Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
    },
  },
];