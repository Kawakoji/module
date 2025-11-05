import { describe, it, expect } from '@jest/globals'
import { validators } from '../../utils/validation.js'

describe('Validation Utils', () => {
  describe('validateDeckName', () => {
    it('should accept valid deck name', () => {
      expect(validators.validateDeckName('Histoire')).toBe('Histoire')
    })

    it('should throw error for empty name', () => {
      expect(() => validators.validateDeckName('')).toThrow()
    })

    it('should throw error for name too long', () => {
      const longName = 'a'.repeat(101)
      expect(() => validators.validateDeckName(longName)).toThrow()
    })
  })

  describe('validateCardQuestion', () => {
    it('should accept valid question', () => {
      expect(validators.validateCardQuestion('Quelle est la capitale ?')).toBe(
        'Quelle est la capitale ?'
      )
    })

    it('should throw error for empty question', () => {
      expect(() => validators.validateCardQuestion('')).toThrow()
    })
  })

  describe('validateUUID', () => {
    it('should accept valid UUID', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000'
      expect(validators.validateUUID(uuid)).toBe(uuid)
    })

    it('should throw error for invalid UUID', () => {
      expect(() => validators.validateUUID('invalid-uuid')).toThrow()
    })
  })
})



