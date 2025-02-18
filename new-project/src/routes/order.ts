import express from 'express'
import createOrder from '../controllers/order/createOrder'
import getOrder from '../controllers/order/getOrder'
import updateOrder from '../controllers/order/updateOrder'
import updateInventory from '../controllers/order/updateInventory'

const order = express.Router()

order.post('/', createOrder)
order.get("/", getOrder)
order.get("/:id", getOrder)
order.put('/:id', updateOrder)
order.patch('/:id', updateOrder)





export default order