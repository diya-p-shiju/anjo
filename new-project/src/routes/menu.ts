import express from 'express'
import createMenu from '../controllers/menu/createMenu'
import getMenu from '../controllers/menu/getMenu'
import updateMenu from '../controllers/menu/updateMenu'

const menu = express.Router()

menu.post('/', createMenu)
menu.get("/", getMenu)
menu.get("/:id", getMenu)
menu.put('/', updateMenu)



export default menu