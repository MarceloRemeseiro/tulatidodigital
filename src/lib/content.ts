import { db } from './db';
import { 
  heroContent, 
  services, 
  servicesConfig, 
  testimonials, 
  testimonialsConfig,
  videoShowcase,
  aboutContent,
  valuesContent,
  reasonsContent,
  layoutConfig
} from './schema';
import { eq, asc } from 'drizzle-orm';

// Hero Content
export async function getHeroContent() {
  const result = await db.select().from(heroContent).limit(1);
  return result[0] || null;
}

// Services
export async function getServicesConfig() {
  const result = await db.select().from(servicesConfig).limit(1);
  return result[0] || null;
}

export async function getServices() {
  const result = await db.select()
    .from(services)
    .where(eq(services.isActive, true))
    .orderBy(asc(services.position));
  return result;
}

// Testimonials
export async function getTestimonialsConfig() {
  const result = await db.select().from(testimonialsConfig).limit(1);
  return result[0] || null;
}

export async function getTestimonials() {
  const result = await db.select()
    .from(testimonials)
    .where(eq(testimonials.isActive, true))
    .orderBy(asc(testimonials.position));
  return result;
}

// VideoShowcase
export async function getVideoShowcase() {
  const result = await db.select().from(videoShowcase).limit(1);
  return result[0] || null;
}

// About
export async function getAboutContent() {
  const result = await db.select().from(aboutContent).limit(1);
  return result[0] || null;
}

// Values
export async function getValuesContent() {
  const result = await db.select().from(valuesContent).limit(1);
  return result[0] || null;
}

// Reasons
export async function getReasonsContent() {
  const result = await db.select().from(reasonsContent).limit(1);
  return result[0] || null;
}

// Layout
export async function getLayoutConfig() {
  const result = await db.select().from(layoutConfig).limit(1);
  return result[0] || null;
} 