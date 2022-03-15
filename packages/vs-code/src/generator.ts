import { set } from 'lodash-es';
import prettier from 'prettier';

import flattenKeys from './utils/flattenKeys.js';

// TODO Needs to also accept Objects of JSON objects
type JSONObject = string | boolean | number | JSONObject[]

type Key = string | string[]

export default class Generator {
  private value: any = {}

  constructor() {}

  public toString(): string {
    return prettier.format(JSON.stringify(flattenKeys(this.value)), { parser: 'json' })
  }

  public setProperty(key: Key, value: JSONObject) {
    set(this.value, key, value)
    return this
  }

  public setNoFlatten(key: Key) {
    const adjustedKey = Array.isArray(key) ? [...key, '__noFlatten'] : `${key}.__noFlatten`
    set(this.value, adjustedKey, true)
    return this
  }
}
