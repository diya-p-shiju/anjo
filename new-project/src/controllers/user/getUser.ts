import { RequestHandler } from 'express';
import User from '../../models/UserModel';

const getUser: RequestHandler = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, role } = req.query; // Get the pagination parameters (with default values)
        const query: any = {}; // Initialize query object

        // If a role is provided, filter by role
        if (role) {
            query.role = role;
        }

        // If there is no ID parameter, fetch users with pagination
        if (!req.params.id) {
            const users = await User.find(query) // Apply role filter if any
                .skip((Number(page) - 1) * Number(pageSize)) // Skip the previous pages' data
                .limit(Number(pageSize)); // Limit the results to the page size

            // Get the total count of users for pagination
            const total = await User.countDocuments(query);

            return res.status(200).json({
                message: "Users Fetched Successfully",
                status: "success",
                data: users,
                pagination: {
                    current: Number(page),
                    pageSize: Number(pageSize),
                    total: total,
                }
            });
        }

        // If the ID is provided, fetch a single user by ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: "error",
                data: null
            });
        }

        return res.status(200).json({
            message: "User Fetched Successfully",
            status: "success",
            data: user
        });
    } catch (error) {
        return res.status(400).json({
            message: "Error Fetching Users",
            status: "error",
            data: null
        });
    }
};

export default getUser;
