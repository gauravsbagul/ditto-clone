module.exports = {
  project: {
    ios: {},
    android: {} // grouped into "project"
  },
  assets: ['./src/assets/fonts'], // stays the same
  dependencies: {
    '@nozbe/watermelondb': { // this disables autolinking for this package (autolinking not supported)
      platforms: {
        ios: null,
        android: null // disable Android platform, other platforms will still autolink if provided
      }
    }
  }
}
