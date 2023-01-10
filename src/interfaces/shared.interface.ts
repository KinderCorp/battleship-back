import { IdentifierInterface } from '@interfaces/entity.interface';

type Enumerate<
  N extends number,
  Acc extends number[] = [],
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

/**
 * Create a range of numbers
 * The first argument is included in the range
 * The second argument is excluded from the range
 */
export type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

/**
 * Get the types contained by the array
 */
export type ArrayItem<ArrayType> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export interface InsertedEntity<Entity extends IdentifierInterface> {
  identifiers: Record<string, Entity['id']>[];
  generatedMaps: Record<string, Partial<Entity>>[];
  raw: Record<string, Partial<Entity>>[];
}
