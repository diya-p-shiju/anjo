import express from 'express'
import createReview from '../controllers/review/createReview'
import getReview from '../controllers/review/getReview'


const review = express.Router()

review.post('/', createReview)
review.get("/", getReview)
review.get("/:id", getReview)



export default review