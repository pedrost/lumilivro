export const PRODUCT_BASIC = {
  name: "LumiRead Basic",
  tagline: "Rechargeable Book Light",
  description:
    "LED book light with blue LED mode. Available in Black.",
  price: 1699, // $16.99 in cents
  originalPrice: 3499, // $34.99 in cents
  maxQuantity: 10,
  freeShipping: true,
  colors: ["Black"] as const,
  image: "/images/lumilivro-hero.png",
  imageAlt: "LumiRead Basic - Rechargeable LED Book Light",
  paymentLink: process.env.NEXT_PUBLIC_STRIPE_LINK_BASIC!,
};

export const PRODUCT = {
  name: "LumiRead Premium",
  tagline: "Rechargeable Book Light",
  description:
    "The reading light that protects your eyes and transforms your nighttime reading.",
  price: 2299, // $22.99 in cents
  originalPrice: 4599, // $45.99 in cents
  maxQuantity: 10,
  freeShipping: true,
  colors: ["Pink", "White", "Black"] as const,
  image: "/images/lumilivro-hero.png",
  imageAlt: "LumiRead Premium - Rechargeable LED Book Light",
  paymentLink: process.env.NEXT_PUBLIC_STRIPE_LINK_PREMIUM!,
};

export const FEATURES = [
  {
    title: "3 Adjustable Light Tones",
    description:
      "Warm, neutral, and cool white. Choose the perfect lighting for every reading moment.",
    icon: "sun" as const,
  },
  {
    title: "USB-C Rechargeable",
    description:
      "Long-lasting battery that charges in just 2 hours. No batteries, no wires.",
    icon: "battery-charging" as const,
  },
  {
    title: "Flexible 360° Clip",
    description:
      "Fits any book, tablet, or e-reader. Articulated arm stays in any position you set.",
    icon: "move-3d" as const,
  },
  {
    title: "Glare-Free Light",
    description:
      "Diffused anti-glare LED. Read next to someone sleeping without disturbing them.",
    icon: "moon" as const,
  },
  {
    title: "Ultra Light & Portable",
    description:
      "Only 1.6oz. Fits in your bag, backpack, or pocket. Illuminated reading wherever you go.",
    icon: "feather" as const,
  },
];

export const REVIEWS = [
  {
    name: "Sarah M.",
    city: "Austin, TX",
    rating: 5,
    text: "I can finally read at night without waking my husband! The light is super soft and the battery lasts all week.",
    verified: true,
    image: "/images/review-1.png",
  },
  {
    name: "James P.",
    city: "Portland, OR",
    rating: 5,
    text: "Bought one for my mom and she loved it. Already buying another one for myself. Excellent quality!",
    verified: true,
    image: "/images/review-2.png",
  },
  {
    name: "Emily R.",
    city: "Denver, CO",
    rating: 5,
    text: "The clip is super sturdy and the light doesn't flicker like others I've tried. Highly recommend!",
    verified: true,
    image: "/images/review-3.png",
  },
  {
    name: "Michael L.",
    city: "Brooklyn, NY",
    rating: 5,
    text: "USB-C sold me. Charges with the same cable as my phone. So practical!",
    verified: true,
    image: "/images/review-4.png",
  },
  {
    name: "Jessica C.",
    city: "Seattle, WA",
    rating: 5,
    text: "I use it every single day. Reading before bed has become a ritual. The warm light is perfect.",
    verified: true,
    image: "/images/review-5.png",
  },
  {
    name: "Robert A.",
    city: "Chicago, IL",
    rating: 4,
    text: "Great product! Shipping took a few days but the light itself is a solid 10/10. Super lightweight.",
    verified: true,
  },
];

export const FAQ_ITEMS = [
  {
    question: "How long does the battery last?",
    answer:
      "The battery lasts 8 to 40 hours depending on brightness level. On the lowest setting, it can last up to a week of daily use.",
  },
  {
    question: "How does charging work?",
    answer:
      "LumiRead charges via USB-C (cable included). A full charge takes approximately 2 hours.",
  },
  {
    question: "Does it work with Kindle and tablets?",
    answer:
      "Yes! The flexible clip adapts to books, Kindle, tablets, laptops, and any surface up to 1.2 inches thick.",
  },
  {
    question: "Will the light disturb my partner?",
    answer:
      "No! The LED has a special diffuser that directs light only to the reading area, without spreading to the sides.",
  },
  {
    question: "What is the shipping time?",
    answer:
      "Standard shipping takes 5-8 business days within the US. You'll receive a tracking number by email once your order ships.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not satisfied for any reason, contact us for a full refund.",
  },
  {
    question: "Is there a warranty?",
    answer:
      "Yes, we offer a 30-day warranty against manufacturing defects. If there's any issue, reach out and we'll make it right.",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Choose Your Quantity",
    description: "Select how many units you want and take advantage of bundle savings.",
    icon: "shopping-cart" as const,
  },
  {
    step: 2,
    title: "Secure Checkout",
    description: "Pay safely with any major credit card. Powered by Stripe.",
    icon: "shield-check" as const,
  },
  {
    step: 3,
    title: "Free Delivery",
    description: "Free shipping across the US. Tracking number sent to your email.",
    icon: "package" as const,
  },
];

export const SOCIAL_PROOF_SNIPPETS = [
  '"Best purchase I\'ve made!" — Sarah, TX',
  '"My mom loved the gift" — James, OR',
  '"I use it every day" — Jessica, WA',
  '"Amazing quality" — Michael, NY',
  '"Reading became a pleasure" — Emily, CO',
  '"I can finally read at night" — Robert, IL',
  '"Arrived fast and well packaged" — Patricia, FL',
  '"Already bought 3 as gifts" — Lucas, CA',
];

export const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  PAID: {
    label: "Paid",
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

export const ORDER_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const CONTACT_SUBJECTS = [
  "Product question",
  "Shipping & delivery",
  "Payment issue",
  "Order tracking",
  "Returns & refunds",
  "Other",
];
