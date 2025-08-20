import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'

// Mock all dependencies
vi.mock('../../services/cnf.service', () => ({
  default: {
    getFoodList: vi.fn(),
    getFood: vi.fn()
  }
}))

vi.mock('../../schemas/ingredient.schema', () => ({
  default: vi.fn().mockImplementation(() => ({
    save: vi.fn()
  }))
}))

vi.mock('../../utils/logger', () => ({
  createLogger: () => ({
    log: vi.fn(),
    success: vi.fn(),
    error: vi.fn()
  })
}))

// Import after mocking
import IngredientController from '../../controllers/ingredient.controller.js'
import CNFService from '../../services/cnf.service.js'
import Ingredient from '../../schemas/ingredient.schema.js'

const mockedCNFService = vi.mocked(CNFService)
const MockedIngredient = vi.mocked(Ingredient)

describe('IngredientController CNF Integration', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let jsonSpy: any
  let statusSpy: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    jsonSpy = vi.fn().mockReturnThis()
    statusSpy = vi.fn().mockReturnThis()
    
    mockRes = {
      status: statusSpy,
      json: jsonSpy
    }

    // Reset ingredient mock for each test
    MockedIngredient.mockImplementation(() => ({
      save: vi.fn()
    }) as any)
    MockedIngredient.findOne = vi.fn()
  })

  describe('getCNFFoodsList', () => {
    it('should fetch and return CNF foods list', async () => {
      const mockFoods = [
        { food_code: 1, food_description: 'Apple' },
        { food_code: 2, food_description: 'Banana' }
      ]
      mockedCNFService.getFoodList.mockResolvedValueOnce(mockFoods)
      mockReq = {}

      await IngredientController.getCNFFoodsList(mockReq as Request, mockRes as Response)

      expect(statusSpy).toHaveBeenCalledWith(200)
      expect(jsonSpy).toHaveBeenCalledWith({
        count: 2,
        foods: mockFoods.slice(0, 50)
      })
    })

    it('should handle errors when fetching CNF foods list', async () => {
      const mockError = new Error('API Error')
      mockedCNFService.getFoodList.mockRejectedValueOnce(mockError)
      mockReq = {}

      await IngredientController.getCNFFoodsList(mockReq as Request, mockRes as Response)

      expect(statusSpy).toHaveBeenCalledWith(500)
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'Failed to fetch CNF foods list' })
    })
  })

  describe('addCNFIngredient', () => {
    it('should require food_code in request body', async () => {
      mockReq = { body: {} }

      await IngredientController.addCNFIngredient(mockReq as Request, mockRes as Response)

      expect(statusSpy).toHaveBeenCalledWith(400)
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'food_code is required' })
    })

    it('should handle duplicate CNF ingredient', async () => {
      const existingIngredient = {
        food_code: 123,
        food_description: 'Apple',
        source: 'cnf'
      }
      MockedIngredient.findOne.mockResolvedValueOnce(existingIngredient)
      
      mockReq = { body: { food_code: 123 } }

      await IngredientController.addCNFIngredient(mockReq as Request, mockRes as Response)

      expect(statusSpy).toHaveBeenCalledWith(409)
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'CNF ingredient already exists',
        ingredient: existingIngredient
      })
    })
  })
})
