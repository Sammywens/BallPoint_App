import User from '../../models/User.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';

// Update user
// PATCH /users/:id
// Authorized

const updateUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { username, roles, active, password } = req.body;

    // Confirm user ID is provided
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Retrieve user from the database
        let user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check for duplicate username if provided in the request body
        if (username !== undefined) {
            const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();
            if (duplicate && duplicate._id.toString() !== userId) {
                return res.status(409).json({ message: 'Duplicate username' });
            }
            // Update username if not a duplicate
            user.username = username;
        }

        // Update other fields based on request body
        if (roles !== undefined) {
            user.roles = roles;
        }
        if (active !== undefined) {
            user.active = active;
        }
        if (password !== undefined) {
            user.password = await bcrypt.hash(password, 10);
        }

        // Save the updated user
        user = await user.save();

        res.json({ message: `${user.username} updated` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default updateUser;
