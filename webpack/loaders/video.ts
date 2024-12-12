import { RuleSetRule } from 'webpack'

import { IS_DEV } from '../constants'
import { TLoader } from '../types'

const imageRegex: RegExp = /\.(mp4|webm|ogg|mov)$/

const universalLoader: RuleSetRule = {
  test: imageRegex,
  type: 'asset/resource',
  generator: {
    filename: `videos/${IS_DEV ? '[name][ext]' : '[name]-[hash][ext]'}`
  }
}

export const videoLoader: TLoader = {
  client: universalLoader,
  server: universalLoader
}
