import { IS_DEV } from './webpack/constants'
import { clientConfig } from './webpack/client.config'
import { serverConfig } from './webpack/server.config'

import { merge } from 'webpack-merge'

const configs = []

if (process.env.NO_SSR === 'true') {
  configs.push(clientConfig)
} else {
  configs.push(serverConfig)

  if (!IS_DEV) {
    configs.push(clientConfig)
  }
}

// Add Tailwind and PostCSS configuration to all configs
const tailwindConfig = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  }
}

// Merge tailwindConfig with each existing config
const mergedConfigs = configs.map(config => merge(config, tailwindConfig))

module.exports = mergedConfigs