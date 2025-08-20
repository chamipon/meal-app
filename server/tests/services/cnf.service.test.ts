import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import CNFService from '../../services/cnf.service.js'

vi.mock('axios', () => ({
  default: {
    get: vi.fn()
  }
}))

vi.mock('../../utils/logger', () => ({
  createLogger: () => ({
    log: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  })
}))

const mockedAxios = axios as any

describe('CNFService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getFoodList', () => {
    it('should fetch and return food list successfully', async () => {
      const mockFoods = [
        { food_code: 1, food_description: 'Apple' },
        { food_code: 2, food_description: 'Banana' }
      ]
      mockedAxios.get.mockResolvedValueOnce({ data: mockFoods })

      const result = await CNFService.getFoodList()

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://food-nutrition.canada.ca/api/canadian-nutrient-file/food?lang=en&type=json'
      )
      expect(result).toEqual(mockFoods)
    })

    it('should throw error when API call fails', async () => {
      const mockError = new Error('Network error')
      mockedAxios.get.mockRejectedValueOnce(mockError)

      await expect(CNFService.getFoodList()).rejects.toThrow('Network error')
    })
  })

  describe('getFood', () => {
    it('should fetch food with nutrients successfully', async () => {
      const mockFood = { food_code: 123, food_description: 'Apple' }
      const mockNutrients = [
        { nutrient_name_id: 1, nutrient_value: 10 },
        { nutrient_name_id: 2, nutrient_value: 20 }
      ]
      const mockNutrientName = { nutrient_group_id: 1, nutrient_name: 'Protein' }

      mockedAxios.get
        .mockResolvedValueOnce({ data: [mockFood] }) // getFood call
        .mockResolvedValueOnce({ data: mockNutrients }) // getNutrients call
        .mockResolvedValue({ data: mockNutrientName }) // getNutrientName calls

      const result = await CNFService.getFood(123)

      expect(result.food_code).toBe(123)
      expect(result.nutrients).toHaveLength(2)
      expect(result.nutrients[0]).toHaveProperty('nutrient_name')
    })

    it('should throw error when food not found', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] })

      await expect(CNFService.getFood(999)).rejects.toThrow('No food found for id 999')
    })

    it('should filter nutrients by group when provided', async () => {
      const mockFood = { food_code: 123, food_description: 'Apple' }
      const mockNutrients = [
        { nutrient_name_id: 1, nutrient_value: 10 },
        { nutrient_name_id: 2, nutrient_value: 20 }
      ]
      const mockNutrientName1 = { nutrient_group_id: 1, nutrient_name: 'Protein' }
      const mockNutrientName2 = { nutrient_group_id: 2, nutrient_name: 'Fat' }

      mockedAxios.get
        .mockResolvedValueOnce({ data: [mockFood] })
        .mockResolvedValueOnce({ data: mockNutrients })
        .mockResolvedValueOnce({ data: mockNutrientName1 })
        .mockResolvedValueOnce({ data: mockNutrientName2 })

      const result = await CNFService.getFood(123, [1]) // Only group 1

      expect(result.nutrients).toHaveLength(1)
      expect(result.nutrients[0].nutrient_name.nutrient_group_id).toBe(1)
    })

    it('should handle nutrient name fetch failures gracefully', async () => {
      const mockFood = { food_code: 123, food_description: 'Apple' }
      const mockNutrients = [{ nutrient_name_id: 1, nutrient_value: 10 }]

      mockedAxios.get
        .mockResolvedValueOnce({ data: [mockFood] })
        .mockResolvedValueOnce({ data: mockNutrients })
        .mockRejectedValueOnce(new Error('Nutrient name not found'))

      const result = await CNFService.getFood(123)

      expect(result.nutrients).toHaveLength(0) // Should be filtered out
    })
  })

  describe('getNutrients', () => {
    it('should fetch nutrients for a food successfully', async () => {
      const mockNutrients = [
        { nutrient_name_id: 1, nutrient_value: 10 },
        { nutrient_name_id: 2, nutrient_value: 20 }
      ]
      mockedAxios.get.mockResolvedValueOnce({ data: mockNutrients })

      const result = await CNFService.getNutrients(123)

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://food-nutrition.canada.ca/api/canadian-nutrient-file/nutrientamount?lang=en&type=json&id=123'
      )
      expect(result).toEqual(mockNutrients)
    })

    it('should throw error when API call fails', async () => {
      const mockError = new Error('Network error')
      mockedAxios.get.mockRejectedValueOnce(mockError)

      await expect(CNFService.getNutrients(123)).rejects.toThrow('Network error')
    })
  })

  describe('getNutrientGroups', () => {
    it('should fetch nutrient groups successfully', async () => {
      const mockGroups = [
        { nutrient_group_id: 1, nutrient_group_name: 'Proximate' },
        { nutrient_group_id: 2, nutrient_group_name: 'Minerals' }
      ]
      mockedAxios.get.mockResolvedValueOnce({ data: mockGroups })

      const result = await CNFService.getNutrientGroups()

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://food-nutrition.canada.ca/api/canadian-nutrient-file/nutrientgroup?lang=en&type=json'
      )
      expect(result).toEqual(mockGroups)
    })

    it('should handle optional groups parameter', async () => {
      const mockGroups = [
        { nutrient_group_id: 1, nutrient_group_name: 'Proximate' }
      ]
      mockedAxios.get.mockResolvedValueOnce({ data: mockGroups })

      const result = await CNFService.getNutrientGroups([1, 2])

      expect(result).toEqual(mockGroups)
    })

    it('should throw error when API call fails', async () => {
      const mockError = new Error('Network error')
      mockedAxios.get.mockRejectedValueOnce(mockError)

      await expect(CNFService.getNutrientGroups()).rejects.toThrow('Network error')
    })
  })

  describe('getNutrientName', () => {
    it('should fetch nutrient name successfully', async () => {
      const mockNutrientName = {
        nutrient_name_id: 1,
        nutrient_name: 'Protein',
        nutrient_group_id: 1
      }
      mockedAxios.get.mockResolvedValueOnce({ data: mockNutrientName })

      const result = await CNFService.getNutrientName(1)

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://food-nutrition.canada.ca/api/canadian-nutrient-file/nutrientname?lang=en&type=json&id=1'
      )
      expect(result).toEqual(mockNutrientName)
    })

    it('should throw error when API call fails', async () => {
      const mockError = new Error('Nutrient not found')
      mockedAxios.get.mockRejectedValueOnce(mockError)

      await expect(CNFService.getNutrientName(999)).rejects.toThrow('Nutrient not found')
    })
  })
})
