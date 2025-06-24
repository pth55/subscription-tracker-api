import {Router} from "express";
import authorize from "../middlewares/auth.middleware.js";
import {createSubscription, getAllSubscriptions, getAllUserSubscriptions} from "../controllers/subs.controller.js";

const SubsRouter = Router();

SubsRouter.get('/', getAllSubscriptions)

SubsRouter.get('/:id', (req, res) => {
    res.send({message:'GET Specific Subscriptions'});
})

SubsRouter.post('/', authorize, createSubscription);

SubsRouter.put('/:id', (req, res) => {
    res.send({message:'UPDATE Subscriptions'});
})

SubsRouter.delete('/:id', (req, res) => {
    res.send({message:'DELETE Subscriptions'});
})

// getting subs of a specific user
SubsRouter.get('/user/:id', authorize, getAllUserSubscriptions)

// CANCEL specific subscription of a user
SubsRouter.put('/:id/cancel', (req, res) => {
    res.send({message:'CANCEL a Subscriptions'});
})

SubsRouter.get('/upcoming-renewals', (req, res) => {
    res.send({message:'GET Upcoming Renewals'});
})

export default SubsRouter;