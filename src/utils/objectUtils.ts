/**
 * Renames a specific property in an object.
 * @param {T} obj - The object to modify.
 * @param {keyof T} oldKey - The existing key to rename.
 * @param {string} newKey - The new key name.
 * @returns {Omit<T, keyof T> & Record<string, any>} A new object with the renamed property.
 */
export function renameProperty<T extends Record<string, any>>(
    obj: T,
    oldKey: keyof T,
    newKey: string
  ): Omit<T, keyof T> & Record<string, any> {
    if (!(oldKey in obj)) {
      throw new Error(`Property "${String(oldKey)}" does not exist in the object.`);
    }
  
    const { [oldKey]: oldValue, ...rest } = obj; 
    return { ...rest, [newKey]: oldValue };
  }
  