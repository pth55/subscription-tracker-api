import Subs from '../models/Subs.js'
import { SERVER_URL } from '../config/env.js'
import { workflowClient } from '../config/upstash.js'

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subs.create({
            ...req.body,
            user: req.user._id,
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        })

        res.status(201).json({ success: true, data: { subscription, workflowRunId } });
    } catch (e) {
        next(e);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // Check if the user is the same as the one in the token
        if(req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subs.find({ user: req.params.id });

        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        next(e);
    }
}
export const getAllUserSubscriptions = async (req, res, next) => {
    try {
        // checking current url id with the authorized middleware one - ensure that authorized user and user sending this request are same
        if(req.params.id !== req.user.id) {
            const error = new Error("You're not the owner of this account!!");
            error.status = 401;
            throw error;
        }

        const subs = await Subs.find({user: req.params.id});
        res.status(200).json({
            status: "success",
            data: subs,
        });
    } catch (e) {
        next(e);
    }
}

export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subs = await Subs.find({});
        res.status(200).json({
            status: "success",
            data: subs,
        })
    } catch (e) {
        next(e);
    }
}

// export const getAllUserSubscriptions = async (req, res, next) => {
//     try {
//         // checking current url id with the authorized middleware one - ensure that authorized user and user sending this request are same
//         if(req.params.id !== req.user.id) {
//             const error = new Error("You're not the owner of this account!!");
//             error.status = 401;
//             throw error;
//         }
//
//         const subs = await Subs.find({user: req.params.id});
//         res.status(200).json({
//             status: "success",
//             data: subs,
//         });
//     } catch (e) {
//         next(e);
//     }
// }