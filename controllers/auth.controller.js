import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {JWT_EXPIRES_IN, JWT_SECRET} from '../config/env.js';
import BlacklistedToken from '../models/BlacklistedToken .js';

export const SignUp = async (req, res, next) => {
    //
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        // create user and insert
        const {name, email, password} = req.body;

        // check if user already exist
        const existingUser = await User.findOne({email});

        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        // otherwise - if user is new
        // hash the password before inserting
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // insert user
        const newUser = await User.create([{name, email, password:hashedPassword}], session);

        // generate jwt for new user -
        const token = jwt.sign({userId: newUser[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        res.status(201).json({
            success: true,
            message: 'User successfully created!',
            data: {
                token,
                user: newUser[0],
            }
        });
        await session.commitTransaction();
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const SignIn = async (req, res, next) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        // if user not found with that email
        if (!user) {
            const error = new Error('User NOT found');
            error.statusCode = 404;
            throw error;
        }

        const comparePassword = await bcrypt.compare(password, user.password);
        if(!comparePassword) {
            const error = new Error('Invalid password.');
            error.statusCode = 401;
            throw error;
        }

        // if everything is fine
        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        res.status(201).json({
            success: true,
            message: 'User successfully logged in!',
            data: {
                token,
                user,
            }
        })
    } catch (e) {
        next(e);
    }
}

export const SignOut = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        await BlacklistedToken.create({ token });

        res.status(200).json({
            success: true,
            message: 'Signed out successfully, token invalidated.'
        });
    } catch (error) {
        next(error);
    }
};
