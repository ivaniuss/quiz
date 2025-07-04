// lib/schema.ts
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  date,
  jsonb,
  integer
} from 'drizzle-orm/pg-core';

// CATEGORÍAS (ej: Fútbol, Música, Cine)
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).unique(),
});

// TIPOS DE JUEGO (ej: Trivia, Adivina el escudo)
export const gameTypes = pgTable('game_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  categoryId: integer('category_id').references(() => categories.id),
});

// QUIZZES diarios o especiales
export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  date: date('date'), // puede ser null para quizzes no diarios
  gameTypeId: integer('game_type_id').references(() => gameTypes.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// PREGUNTAS
export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  quizId: integer('quiz_id').references(() => quizzes.id),
  text: varchar('text', { length: 300 }).notNull(),
  options: jsonb('options').notNull(), // array de strings como opciones
  correct: varchar('correct', { length: 100 }).notNull(),
});
