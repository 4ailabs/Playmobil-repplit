import { z } from "zod";
import { logger } from "./logger";

/**
 * Esquemas de validación Zod para asegurar la integridad de los datos
 */

// Esquema para DollType
const dollTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color debe ser un hex válido"),
  description: z.string(),
  category: z.enum([
    'self',
    'father',
    'mother',
    'grandfather',
    'grandmother',
    'partner',
    'child',
    'sibling',
    'deceased',
    'other'
  ]),
});

// Esquema para posición 3D
const positionSchema = z.tuple([z.number(), z.number(), z.number()]);
const rotationSchema = z.tuple([z.number(), z.number(), z.number()]);

// Esquema para DollRelationship
const dollRelationshipSchema = z.object({
  targetId: z.string(),
  type: z.enum(['family', 'conflict', 'tension', 'strong', 'distant']),
  label: z.string().optional(),
});

// Esquema para PlacedDoll
const placedDollSchema = z.object({
  id: z.string(),
  dollType: dollTypeSchema,
  position: positionSchema,
  rotation: rotationSchema,
  lifePath: z.enum(['north', 'south', 'east', 'west']).nullable(),
  isDropped: z.boolean(),
  label: z.string().optional(),
  relationships: z.array(dollRelationshipSchema).optional(),
  emotion: z.enum(['neutral', 'happy', 'sad', 'angry', 'anxious']).optional(),
  notes: z.string().optional(),
});

// Esquema para LifePath
const lifePathSchema = z.object({
  id: z.enum(['north', 'south', 'east', 'west']),
  name: z.string(),
  description: z.string(),
  characteristics: z.array(z.string()),
  benefits: z.array(z.string()),
  risks: z.array(z.string()),
  motivations: z.array(z.string()),
  fears: z.array(z.string()),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color debe ser un hex válido"),
});

// Esquema para SavedConfiguration
export const savedConfigurationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "El nombre no puede estar vacío"),
  dolls: z.array(placedDollSchema),
  scenario: z.string(),
  timestamp: z.number().positive(),
  analysis: z.string(),
});

export type ValidatedSavedConfiguration = z.infer<typeof savedConfigurationSchema>;

/**
 * Valida una configuración guardada
 * @param data - Datos a validar
 * @returns Datos validados o null si hay error
 */
export function validateSavedConfiguration(
  data: unknown
): ValidatedSavedConfiguration | null {
  try {
    return savedConfigurationSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.errorWithContext('Error de validación en configuración guardada', error, {
        errors: error.errors,
      });
    } else {
      logger.errorWithContext('Error desconocido al validar configuración', error);
    }
    return null;
  }
}

/**
 * Valida un array de configuraciones guardadas
 * @param data - Array de datos a validar
 * @returns Array de configuraciones validadas (filtra las inválidas)
 */
export function validateSavedConfigurations(
  data: unknown
): ValidatedSavedConfiguration[] {
  if (!Array.isArray(data)) {
    logger.warn('Datos de configuraciones no es un array');
    return [];
  }

  const validated: ValidatedSavedConfiguration[] = [];
  for (let i = 0; i < data.length; i++) {
    const config = validateSavedConfiguration(data[i]);
    if (config) {
      validated.push(config);
    } else {
      logger.warn(`Configuración en índice ${i} es inválida y será omitida`);
    }
  }

  return validated;
}

/**
 * Valida un muñeco colocado
 * @param data - Datos del muñeco a validar
 * @returns Muñeco validado o null si hay error
 */
export function validatePlacedDoll(data: unknown): z.infer<typeof placedDollSchema> | null {
  try {
    return placedDollSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.errorWithContext('Error de validación en muñeco colocado', error);
    }
    return null;
  }
}

