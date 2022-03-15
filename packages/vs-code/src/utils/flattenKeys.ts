type JSONObject = string

interface FlattenableObject {
  [key: string]: any
}

/**
 * Accepts a nested Object and returns a flatter version of it by collapsing it into an
 * object where its keys represent the path to value in the original Object.
 *
 * @param object Object to flatten.
 */
const flattenKeys = (object: Record<string, any>) => {
  return flattenKeys.inner(object)
}

flattenKeys.inner = (object: FlattenableObject, prefix?: string): Record<string, JSONObject> => {
  return Object.fromEntries(
    Object.entries(object).flatMap(([key, value]) => {
      const nextPrefix = prefix ? [...prefix.split('.'), key].join('.') : key

      if (Array.isArray(value)) {
        return [[nextPrefix, value]]
      } else if (typeof value === 'object') {
        return Object.entries(flattenKeys.inner(value, nextPrefix))
      } else {
        return [[nextPrefix, value]]
      }
    })
  )
}

export default flattenKeys
