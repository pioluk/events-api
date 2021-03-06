/* global describe: true, beforeEach: true, it:true */

const { expect } = require('chai')

describe('models', () => {
  let models = null

  beforeEach(() => {
    models = require('../models')
  })

  describe('User model', () => {
    it('should exist', () => {
      expect(models.User).to.be.ok
      expect(models.User).to.be.an('object')
    })
  })

  describe('Event model', () => {
    it('should exist', () => {
      expect(models.Event).to.be.ok
      expect(models.Event).to.be.an('object')
    })
  })
})
