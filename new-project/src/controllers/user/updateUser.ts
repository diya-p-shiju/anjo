import { RequestHandler, Request, Response } from 'express';
import User from '../../models/UserModel';


const updateUser: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const updateData = req.body;

    // Validate input data (e.g., checking if the body has necessary fields)
    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({
            message: 'No data provided to update',
            status: 'error',
            data: null
        });
    }

    try {
        // Find the user by ID and update it with the provided data
        const updatedData = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedData) {
            return res.status(404).json({
                message: `${User.modelName} not found`,
                status: 'error',
                data: null
            });
        }

        // Respond with the updated data
        res.status(200).json({
            message: `${User.modelName} Updated Successfully`,
            status: 'success',
            data: updatedData
        });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({
            message: `Error updating ${User.modelName}`,
            status: 'error',
            data: null
        });
    }
};

export default updateUser

const deleteUser: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    

    try {
        // Find the user by ID and delete it
        console.log(id);
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                message: `${User.modelName} not found`,
                status: 'error',
                data: null
            }); 
        }

        // Respond with a success message
        res.status(200).json({
            message: `${User.modelName} Deleted Successfully`,
            status: 'success',
            data: deletedUser
        });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({
            message: `Error deleting ${User.modelName}`,
            status: 'error',
            data: null
        });
    }
};

export { deleteUser };