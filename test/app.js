/* global describe: true, beforeEach: true, afterEach: true, it:true */

describe('app', () => {
  let app = null

  beforeEach(() => {
    app = require('../app')()
  })

  afterEach(done => {
    app.close(done)
  })

  it('should start', () => {})
})
