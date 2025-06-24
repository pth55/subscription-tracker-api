import User from "../models/User.js";

export const getUsers = async (req, res, next)=>{
    try {
        const users = await User.find({}).select("-password"); // -password - is for not selecting password field
        res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch(err){
        next(err);
    }
}

export const getUser = async (req, res, next)=>{
    try {
        // getting specific user by _id
        const user = await User.findById(req.params.id).select('-password'); // -password -> for not getting password field

        if(!user){
            const error = new Error("User Not Found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch(err){
        next(err);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { name, email } = req.body;

        // Build update object dynamically
        const updateFields = {};
        if (name && name.trim() !== '') updateFields.name = name.trim();
        if (email && email.trim() !== '') updateFields.email = email.trim();

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'No valid fields provided to update.' });
        }

        // Check for email conflict if email is being changed
        if (updateFields.email) {
            const existing = await User.findOne({ email: updateFields.email });
            if (existing && existing._id.toString() !== userId) {
                return res.status(409).json({ message: 'Email already in use by another user.' });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true, context: 'query' }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully.',
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next)=>{
    try {
        const userId = req.params.id;
        const UserFind = await User.findOne({_id: userId});
        if(!UserFind) {
            return res.status(404).json({
                success: false,
                message: 'User not found with that id.',
            });
        }
        const deletedUser = await User.deleteOne({_id: userId});
        if(!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'Error while deleting users.',
            })
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully.',
            data: UserFind
        })
        next();
    } catch(err) {
        next(err);
    }
}