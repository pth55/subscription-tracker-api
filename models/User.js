import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minLength: 3,
        maxLength: 50,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email address."]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 5,
    }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;