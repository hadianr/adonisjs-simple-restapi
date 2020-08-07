'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Hotel = use('App/Models/Hotel')
const { validate } = use('Validator')

/**
 * Resourceful controller for interacting with hotels
 */
class HotelController {
  /**
   * Show a list of all hotels.
   * GET hotels
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index ({ request, response }) {
    const result = await Hotel.all()
    const resData = {
      message: 'Hotel has been listed successfully.',
      data: result
    }
    return response.status(200).json(resData)
  }

  /**
   * Create/save a new hotel.
   * POST hotels
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const req = request.all()

    // rules validator
    const rules = {
      name: 'required',
      address: 'required'
    }
    const validation = await validate(req, rules)
    
    // Check if request body validation
    if (validation.fails()) return response.status(400).json({message: validation.messages()[0].message})

    const hotel = new Hotel()
    hotel.name = req.name
    hotel.address = req.address
    await hotel.save()
    const resData = {
      message: 'Hotel has been created successfully.',
      data: hotel
    }

    return response.status(201).json(resData)
  }

  /**
   * Display a single hotel.
   * GET hotels/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show ({ params, request, response }) {
    const hotel = await Hotel.find(params.id)
    const resData = {
      message: 'Hotel been fetched successfully.',
      data: hotel
    }

    return response.status(200).json(resData)
  }

  /**
   * Update hotel details.
   * PUT or PATCH hotels/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const req = request.all()
    const hotel = await Hotel.find(params.id)

    // rules validator
    const rules = {
      name: 'required',
      address: 'required'
    }
    const validation = await validate(req, rules)

    // Check if request body validation
    if (validation.fails()) return response.status(400).json({message: validation.messages()[0].message})
    
    // Check if hotel with params.id not found
    if(!hotel) return response.status(404).json({message: `Hotel with id ${params.id} is not found or has not been created`, data: {}})

    hotel.name = req.name
    hotel.address = req.address
    await hotel.save()

    const resData = {
      message: 'Hotel has been fetched successfully.',
      data: hotel
    }
    return response.status(200).json(resData)
  }

  /**
   * Delete a hotel with id.
   * DELETE hotels/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const hotel = await Hotel.find(params.id)
    if(!hotel) return response.status(404).json({message: `Hotel with id ${params.id} is not found or has not been created`, data: {}})
    await hotel.delete()

    const resData = {
      message: `Hotel with id ${params.id} has been deleted successfully.`,
      data: hotel
    }
    return response.status(200).json(resData)
  }
}

module.exports = HotelController
