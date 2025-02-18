import { RequestHandler } from 'express'


const postRoot: RequestHandler = async (req, res): Promise<any> => {
    const json = req.body
    return res.json(json)
}

export default postRoot