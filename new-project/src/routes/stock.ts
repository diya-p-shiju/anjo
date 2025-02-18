import express from 'express'
import { removeInventory, updateInventory } from '../controllers/inventory/index'

const stock = express.Router()

stock.put('/', updateInventory)
stock.delete('/', removeInventory)

export default stock