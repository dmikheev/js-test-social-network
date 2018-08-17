import get from 'lodash/get';

interface IEntitiesCollection<TItem> {
  [key: string]: TItem;
}
type TKeyPath = string | string[];
type TKeyPathFunc<T> = (item: T) => string;

export function addOrReplaceEntities<TItem, TCol extends IEntitiesCollection<TItem>>(
  source: TCol,
  keyPath: TKeyPath | TKeyPathFunc<TItem>,
  ...mergeDataParams: TItem[][]
): TCol {
  const result = Object.assign({}, source);

  mergeDataParams.forEach((mergeData) => {
    mergeData.forEach((entity: any) => {
      let key;
      if (typeof keyPath === 'function') {
        key = keyPath(entity);
      } else {
        key = get(entity, keyPath);
      }
      if (!key) {
        throw new Error(`Invalid key property in entitiesUtils::addOrReplaceEntities()`);
      }

      result[key] = entity;
    });
  });

  return result;
}

export function mergeEntities<TItem, TCol extends IEntitiesCollection<TItem>>(
  source: TCol,
  keyPath: TKeyPath,
  ...mergeDataParams: TItem[][]
): TCol {
  return mergeEntitiesBy(
     source,
    keyPath,
    (existingItem: TItem, mergingItem: any) => ({
      ...(existingItem as any),
      ...mergingItem,
    }),
    ...mergeDataParams,
  );
}
export function mergeEntitiesBy<TItem, TCol extends IEntitiesCollection<TItem>>(
  source: TCol,
  keyPath: TKeyPath,
  iteratee: (existingItem: TItem | undefined, mergingItem: any) => TItem,
  ...mergeDataParams: any[][]
): TCol {
  const result = Object.assign({}, source);

  mergeDataParams.forEach((mergeData) => {
    mergeData.forEach((entity: any) => {
      const key = get(entity, keyPath);
      if (!key) {
        throw new Error(`Invalid key property with path "${keyPath}" in entitiesUtils::mergeEntitiesBy()`);
      }

      result[key] = iteratee(source[key], entity);
    });
  });

  return result;
}
