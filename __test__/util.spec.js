const { handleResponse, exist } = require('../utils')

describe('test util', () => {
  it('handleResponse should return correct data ', async () => {
    const promise = new Promise(resolve => resolve(123))
    const [err, data] = await handleResponse(promise)
    expect(err).toBeNull()
    expect(data).toBe(123)
  })

  it('handleResponse should return error data', async () => {
    const promise = new Promise((resolve, reject) =>
      reject({
        response: {
          data: {
            message: '404 Not Found'
          }
        }
      })
    )
    const [err, data] = await handleResponse(promise)

    expect(err).toEqual({
      message: '404 Not Found'
    })
    expect(data).toBeNull()
  })

  it('handleResponse should return hybrid error data', async () => {
    const promise = new Promise((resolve, reject) =>
      reject({
        response: {
          data: {
            message: '404 Not Found'
          }
        }
      })
    )
    const [err, data] = await handleResponse(promise, {
      msg: 'extraError'
    })

    expect(err).toEqual({
      message: '404 Not Found',
      msg: 'extraError'
    })
    expect(data).toBeNull()
  })

  it('exist should return false', () => {
    const arr = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const result = exist(arr, item => item.id === 4)
    expect(result).toBeFalsy()
  })

  it('exist should return true', () => {
    const arr = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const result = exist(arr, item => item.id === 2)
    expect(result).toBeTruthy()
  })
})
