import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            })
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be more than 6 letters"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })
        // res.clearCookie("jwt");
        return res.status(201).json({
            success: true,
            message: "Account created successfully"
        })
    } catch (error) {
        console.log("Error ", error);
        return res.status(500).json({
            success: false,
            message: "Error in signup controller"
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }
        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }
        generateToken(res, user, `Welcome back ${user.name}`);
    } catch (error) {
        console.log("Error ", error);
        return res.status(500).json({
            success: false,
            message: "Error in login controller"
        })
    }
}

export const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (error) {
        console.log("Error ", error);
        return res.status(500).json({
            success: false,
            message: "Error in logout controller"
        })
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password").populate("enrolledCourses");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log("Error ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load user"
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { name } = req.body;
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        //delete old photo
        if (user.photoUrl) {
            const publicId = user.photoUrl.split("/").pop().split(".")[0]; //extracting public id
            if (publicId) {
                await deleteMedia(publicId);
            }
        }

        //upload new photo
        const cloudResponse = await uploadMedia(profilePhoto.path);
        const { secure_url: photoUrl } = cloudResponse;

        const updatedData = { name, photoUrl };
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");

        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully"
        })
    } catch (error) {
        console.log("Error ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile"
        })
    }
}