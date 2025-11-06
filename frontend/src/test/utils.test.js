import { describe, it, expect } from 'vitest'

// Tests d'exemple pour les utilitaires
describe('Utils', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15T10:30:00Z')
    const formatted = date.toLocaleDateString('fr-FR')
    expect(formatted).toBeTruthy()
  })

  it('should validate email format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    expect(emailRegex.test('test@example.com')).toBe(true)
    expect(emailRegex.test('invalid-email')).toBe(false)
  })
})




