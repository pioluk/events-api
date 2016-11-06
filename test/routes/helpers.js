/* global describe,it */

const { expect } = require('chai')
const { isNonEmptyString, parseArray, prop } = require('../../routes/helpers')

describe('helpers', () => {
  describe('isNonEmptyString', () => {
    it('should work correctly', () => {
      expect(isNonEmptyString('')).to.be.false
      expect(isNonEmptyString('non-empty string')).to.be.true
    })
  })

  describe('prop', () => {
    it('should return value of a property if the property exists', () => {
      const obj = { foo: 'bar' }
      expect(prop('foo', obj)).to.equal('bar')
    })

    it('should return undefined if property does not exist on an object', () => {
      const obj = {}
      expect(prop('foo', obj)).to.be.undefined
    })
  })

  describe('parseArray', () => {
    it('should parse string into array', () => {
      const str = 'elem1,elem2'
      const result = parseArray(str)
      expect(result).to.be.an.instanceof(Array)
      expect(result.length).to.equal(2)
      expect(result[0]).to.equal('elem1')
      expect(result[1]).to.equal('elem2')
    })

    it('should not return an array containing empty strings', () => {
      const result = parseArray('')
      for (const elem of result) {
        expect(isNonEmptyString(elem)).to.be.true
      }
    })
  })

  describe('retrieveArrayFromFormData', () => {
    it('', () => {})
  })
})
