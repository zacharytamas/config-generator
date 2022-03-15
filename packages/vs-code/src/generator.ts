import { set } from 'lodash-es';
import prettier from 'prettier';

// TODO Needs to also accept Objects of JSON objects
type JSONObject = string | boolean | number | JSONObject[]

type Key = string | string[]

export default class Generator {
  private value: any = {}

  constructor() {}

  public toString(): string {
    return prettier.format(JSON.stringify(this.value), { parser: 'json' })
  }

  public setProperty(key: Key, value: JSONObject) {
    set(this.value, key, value)
    return this
  }
}
