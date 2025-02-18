import { RequestHandler } from 'express';
import Menu from '../../models/MenuModel';

const getMenu: RequestHandler = async (req, res) => {
    try {
        // Prepare the query object
        const query: any = req.params.id ? { _id: req.params.id } : { ...req.query };

        // Check if 'createdAt' query parameters are present for filtering
        if (req.query.createdAtGt) {
            query.createdAt = { ...query.createdAt, $gt: new Date(req.query.createdAtGt as string) };
        }

        if (req.query.createdAtLt) {
            query.createdAt = { ...query.createdAt, $lt: new Date(req.query.createdAtLt as string) };
        }

        // Fetch menu items based on the query
        const menuItems = await Menu.find(query);

        // Send the successful response
        res.status(200).json({
            message: "Menu Fetched Successfully",
            status: "success",
            data: menuItems
        });
    } catch (error) {
        console.error(error);
        // Send the error response
        res.status(400).json({
            message: "Error Fetching Menu",
            status: "error",
            data: null
        });
    }
};

export default getMenu;
