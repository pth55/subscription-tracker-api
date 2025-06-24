import {Router} from 'express';
import {SignUp, SignOut, SignIn} from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post('/sign-up', SignUp);

authRouter.post('/sign-in', SignIn);

authRouter.post('/sign-out', authorize, SignOut);

export default authRouter;