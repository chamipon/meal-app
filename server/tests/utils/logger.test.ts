import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createLogger } from '../../utils/logger.js'

describe('createLogger', () => {
  let consoleSpy: any

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should create a logger with the specified prefix', () => {
    const logger = createLogger('TEST')
    expect(logger).toHaveProperty('log')
    expect(logger).toHaveProperty('info')
    expect(logger).toHaveProperty('warn')
    expect(logger).toHaveProperty('error')
    expect(logger).toHaveProperty('success')
  })

  it('should log messages with correct console methods', () => {
    const logger = createLogger('TEST', false)
    
    logger.log('test message')
    logger.info('info message')
    logger.warn('warn message')
    logger.error('error message')
    logger.success('success message')

    expect(consoleSpy.log).toHaveBeenCalledTimes(2) // log + success
    expect(consoleSpy.info).toHaveBeenCalledOnce()
    expect(consoleSpy.warn).toHaveBeenCalledOnce()
    expect(consoleSpy.error).toHaveBeenCalledOnce()
  })

  it('should include prefix in log output', () => {
    const logger = createLogger('TEST', false)
    logger.log('test message')

    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('[TEST]'),
      'test message'
    )
  })

  it('should include timestamp when showTimestamp is true', () => {
    const logger = createLogger('TEST', true)
    logger.log('test message')

    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\].*\[TEST\]/),
      'test message'
    )
  })

  it('should not include timestamp when showTimestamp is false', () => {
    const logger = createLogger('TEST', false)
    logger.log('test message')

    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.not.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/),
      'test message'
    )
  })

  it('should handle multiple arguments', () => {
    const logger = createLogger('TEST', false)
    logger.log('message', 'arg1', 'arg2', 123)

    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('[TEST]'),
      'message',
      'arg1',
      'arg2',
      123
    )
  })

  it('should use different icons for different log levels', () => {
    const logger = createLogger('TEST', false)
    
    logger.info('info')
    logger.warn('warn')  
    logger.error('error')
    logger.success('success')

    const infoCall = consoleSpy.info.mock.calls[0][0]
    const warnCall = consoleSpy.warn.mock.calls[0][0]
    const errorCall = consoleSpy.error.mock.calls[0][0]
    const successCall = consoleSpy.log.mock.calls[0][0] // success uses console.log

    expect(infoCall).toContain('ℹ️')
    expect(warnCall).toContain('⚠️')
    expect(errorCall).toContain('❌')
    expect(successCall).toContain('✅')
  })
})
