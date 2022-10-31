import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

import { createUser } from "../../useCases/user/createUser";
import { getUserByID } from "../../useCases/user/getUserByID";
import { getAllUsers } from "../../useCases/user/getAllUsers";
import { updateUser } from "../../useCases/user/updateUser";
import { deleteUser } from "../../useCases/user/deleteUser";

export const userRouter = Router();

userRouter.get("/", getAllUsers);

// userRouter.get("/:id", ensureAuthenticated, getUserByID);

userRouter.post("/:id", createUser);

userRouter.put("/", ensureAuthenticated, updateUser);

userRouter.delete("/:id", ensureAuthenticated, deleteUser);
