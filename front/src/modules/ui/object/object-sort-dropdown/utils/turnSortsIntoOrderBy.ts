import { Field } from '~/generated/graphql';

import { Sort } from '../types/Sort';

export const turnSortsIntoOrderBy = (
  sorts: Sort[],
  fields: Pick<Field, 'id' | 'name'>[],
) => {
  const sortsObject: Record<string, 'AscNullsFirst' | 'DescNullsLast'> = {};
  if (!sorts.length) {
    const createdAtField = fields.find((field) => field.name === 'createdAt');
    if (createdAtField) {
      return {
        createdAt: 'DescNullsFirst',
      };
    }
    return {
      [fields[0].name]: 'DescNullsFirst',
    };
  }
  sorts.forEach((sort) => {
    const correspondingField = fields.find(
      (field) => field.id === sort.fieldMetadataId,
    );
    if (!correspondingField) {
      throw new Error(
        `Could not find field ${sort.fieldMetadataId} in metadata object`,
      );
    }
    const direction =
      sort.direction === 'asc' ? 'AscNullsFirst' : 'DescNullsLast';

    sortsObject[correspondingField.name] = direction;
  });

  return sortsObject;
};
