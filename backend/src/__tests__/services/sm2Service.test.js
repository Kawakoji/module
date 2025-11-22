import { describe, it, expect } from '@jest/globals'
import { calculateSM2 } from '../../services/sm2Service.js'

describe('SM2 Service', () => {
  it('should calculate new values for easy answer', () => {
    const card = {
      ease_factor: 2.5,
      interval: 10,
      repetitions: 3,
    }

    const result = calculateSM2(card, 3) // Easy

    expect(result.ease_factor).toBeGreaterThan(2.5)
    expect(result.interval).toBeGreaterThan(10)
    expect(result.repetitions).toBe(4)
  })

  it('should reset interval for hard answer', () => {
    const card = {
      ease_factor: 2.5,
      interval: 10,
      repetitions: 3,
    }

    const result = calculateSM2(card, 1) // Hard

    expect(result.interval).toBe(1)
    expect(result.repetitions).toBe(0)
    expect(result.ease_factor).toBeLessThan(2.5)
  })

  it('should handle first review correctly', () => {
    const card = {
      ease_factor: 2.5,
      interval: 1,
      repetitions: 0,
    }

    const result = calculateSM2(card, 3) // Easy

    expect(result.interval).toBe(6) // First review = 6 days
    expect(result.repetitions).toBe(1)
  })
})








