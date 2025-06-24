import {Router} from "express";
import {getUsers, getUser, updateUser, deleteUser} from "../controllers/users.controller.js";
import {SignUp} from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', getUsers);

// create new user
userRouter.post('/', SignUp);

userRouter.get('/:id', authorize, getUser);

userRouter.put('/:id', authorize, updateUser);

userRouter.delete('/:id', authorize, deleteUser);

export default userRouter;