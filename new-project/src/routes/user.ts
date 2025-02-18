import express from 'express'
import loginRoute from '../controllers/user/login';
import refreshTokenRoute from '../controllers/user/refresh';
import createUserRoute from '../controllers/user/createUser';
import updateUser, { deleteUser } from '../controllers/user/updateUser';
import getUser from '../controllers/user/getUser';
import getCredit from '../controllers/user/getCredit';
import updateCredit from '../controllers/user/updateCredit';



const user = express.Router()

user.post('/', createUserRoute)
user.get("/", getUser)
user.get("/:id", getUser)
user.put('/:id', updateUser)
user.delete('/:id', deleteUser)
user.get('/credit/:id', getCredit)
user.put('/credit/:id', updateCredit)





user.post('/login', loginRoute);
user.post('/refresh-token', refreshTokenRoute);

export default user