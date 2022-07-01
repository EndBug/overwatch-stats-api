const ow = require('overwatch-stats-api')

const stats = await ow.getAllStats('xQc-11273', 'pc')
console.log(stats)
