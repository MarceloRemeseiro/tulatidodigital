import { pgTable, text, timestamp, uuid, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

// Tabla para contenido del Hero
export const heroContent = pgTable('hero_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  mainTitle: text('main_title').notNull(),
  subtitle: text('subtitle').notNull(),
  highlight: text('highlight').notNull(),
  paragraph: text('paragraph').notNull(),
  ctaButton: text('cta_button').notNull(),
  promiseTitle: text('promise_title').notNull(),
  promiseParagraph: text('promise_paragraph').notNull(),
  promiseCtaButton: text('promise_cta_button').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabla para servicios
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  cta: text('cta').notNull(),
  linkType: text('link_type').notNull().default('contact'), // 'contact', 'internal', 'external'
  customLink: text('custom_link'),
  position: integer('position').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabla para configuración de servicios (título y subtítulo)
export const servicesConfig = pgTable('services_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabla para testimonios
export const testimonials = pgTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  quote: text('quote').notNull(),
  author: text('author').notNull(),
  role: text('role'),
  position: integer('position').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabla para configuración de testimonios
export const testimonialsConfig = pgTable('testimonials_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabla para VideoShowcase
export const videoShowcase = pgTable('video_showcase', {
  id: uuid('id').primaryKey().defaultRandom(),
  mainTitle: text('main_title').notNull(),
  mainTitleHighlight: text('main_title_highlight').notNull(),
  subtitle: text('subtitle').notNull(),
  videoSubtitle: text('video_subtitle').notNull(),
  videoFileName: text('video_file_name').notNull(),
  featuresTitle: text('features_title'),
  features: jsonb('features').notNull(), // Array de features
  idealForTitle: text('ideal_for_title'),
  idealForItems: jsonb('ideal_for_items'), // Array de strings
  buttons: jsonb('buttons'), // Objeto con primary y secondary
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabla para About
export const aboutContent = pgTable('about_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  paragraph: text('paragraph').notNull(),
  focusTitle: text('focus_title').notNull(),
  focusSubtitle: text('focus_subtitle'),
  focusParagraph: text('focus_paragraph').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabla para Values
export const valuesContent = pgTable('values_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  items: jsonb('items').notNull(), // Array de {icon, text}
  bottomText: text('bottom_text').notNull(),
  ctaButton: text('cta_button').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabla para Reasons
export const reasonsContent = pgTable('reasons_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  items: jsonb('items').notNull(), // Array de {icon, text}
  cta: text('cta').notNull(),
  bottomText: text('bottom_text'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabla para Layout (orden de componentes)
export const layoutConfig = pgTable('layout_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  components: jsonb('components').notNull(), // Array de componentes con orden
  updatedAt: timestamp('updated_at').defaultNow(),
}); 