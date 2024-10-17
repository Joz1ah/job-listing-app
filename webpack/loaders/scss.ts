import { RuleSetRule } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import { TLoader } from '../types'

const scssRegex: RegExp = /\.s?[ac]?ss$/
const scssModuleRegex: RegExp = /\.module\.s?[ac]?ss$/

const universalLoader = (isServer: boolean = false): RuleSetRule => ({
  test: scssRegex,
  oneOf: [
    {
      test: scssModuleRegex,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            emit: !isServer
          }
        },
        {
          loader: 'css-loader',
          options: {
            modules: {
              mode: 'local',
              localIdentName: '[folder]__[local]--[hash:base64:5]',
              namedExport: false,
              exportLocalsConvention: 'as-is'
            }
          }
        },
        'postcss-loader', // Add this line
        {
          loader: 'sass-loader'
        }
      ]
    },
    {
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            emit: !isServer
          }
        },
        'css-loader',
        'postcss-loader', // Add this line
        'sass-loader'
      ]
    }
  ]
})

export const scssLoader: TLoader = {
  client: universalLoader(),
  server: universalLoader(true)
}