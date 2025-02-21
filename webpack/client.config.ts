import path from 'path'

import {
  Configuration,
  HotModuleReplacementPlugin,
  WebpackPluginInstance,
  DefinePlugin,
} from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import LoadablePlugin from '@loadable/webpack-plugin'
import CssoWebpackPlugin from 'csso-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import 'webpack-dev-server'

import { ALIAS, DEV_SERVER_PORT, DIST_DIR, IS_DEV, IS_LAZY_COMPILATION, SRC_DIR } from './constants'
import * as Loaders from './loaders'

const withReport = Boolean(process.env.npm_config_withReport)

const entry: string[] = [
  path.resolve(SRC_DIR, 'index.tsx'),
  ...(IS_DEV
    ? [
        ...(process.env.NO_SSR === 'true'
          ? []
          : ['webpack-hot-middleware/client']),
        'css-hot-loader/hotModuleReplacement'
      ]
    : [])
]

const filename = (ext: string): string =>
  IS_DEV ? `[name].${ext}` : `[name].[chunkhash].${ext}`

const plugins: WebpackPluginInstance[] = [
  new DefinePlugin({
    NO_SSR: process.env.NO_SSR === 'true',
    'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
    'process.env.API_URL': JSON.stringify(process.env.API_URL),
    'process.env.SIGNUP_API_URL': JSON.stringify(process.env.SIGNUP_API_URL),
    'process.env.AUTH_API_URL': JSON.stringify(process.env.AUTH_API_URL),
    'process.env.SEARCH_API_URL': JSON.stringify(process.env.SEARCH_API_URL),
    'process.env.PAYMENT_API_URL': JSON.stringify(process.env.PAYMENT_API_URL),
    'process.env.JOBFEED_API_URL': JSON.stringify(process.env.JOBFEED_API_URL),
    'process.env.PERFECTMATCH_API_URL': JSON.stringify(process.env.PERFECTMATCH_API_URL),
    'process.env.NOTIFICATIONS_API_URL': JSON.stringify(process.env.NOTIFICATIONS_API_URL),
    'process.env.ACCOUNT_API_URL': JSON.stringify(process.env.ACCOUNT_API_URL),
    'process.env.AUTHORIZE_NET_CLIENT_KEY': JSON.stringify(process.env.AUTHORIZE_NET_CLIENT_KEY),
    'process.env.AUTHORIZE_NET_API_LOGIN_ID': JSON.stringify(process.env.AUTHORIZE_NET_API_LOGIN_ID),
  }),
  ...(process.env.NO_SSR === 'true'
    ? [
        new HtmlWebpackPlugin({
          title: 'My App',
          template: './src/assets/index.html'
        })
      ]
    : []),
  new ForkTsCheckerWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: IS_DEV ? '[name].css' : '[name].[contenthash].css'
  }),
  new LoadablePlugin({
    filename: 'stats.json',
    writeToDisk: true
  }) as { apply: () => void },
  ...(IS_DEV
    ? [new HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()]
    : [
        new CssoWebpackPlugin(),
        new BundleAnalyzerPlugin({
          analyzerMode: withReport ? 'server' : 'disabled'
        })
      ]),
  new CopyPlugin({
    patterns: [
      { from: `${SRC_DIR}/i18n/translations`, to: 'lang' },
      ...(process.env.NO_SSR === 'true'
        ? [{ from: `${SRC_DIR}/sw.js`, to: 'sw.js' }]
        : [])
    ]
  })
]

const clientConfig: Configuration = {
  name: 'client',
  target: 'web',
  entry,
  plugins,
  output: {
    path: DIST_DIR,
    filename: filename('js'),
    publicPath: '/'
  },
  devtool: IS_DEV ? 'source-map' : false,
  resolve: {
    alias: ALIAS,
    extensions: ['.tsx', '.ts', '.js', '.scss', '.css', '.mjs'],
    fallback: {
      url: false,
      path: false
    }
  },
  module: {
    rules: Object.values(Loaders).map((el) => el.client)
  },
  ...(process.env.NO_SSR === 'true' && {
    devServer: {
      historyApiFallback: true,
      port: DEV_SERVER_PORT
    }
  }),
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all'
        }
      }
    }
  },
  experiments: {
    lazyCompilation: IS_LAZY_COMPILATION
  }
}

export { clientConfig }
