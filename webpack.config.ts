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

// Tailwind and PostCSS Configuration
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


// Merge TailwindConfig and VideoConfig with Each Existing Config
const mergedConfigs = configs.map(config => merge(config, tailwindConfig))

module.exports = mergedConfigs
