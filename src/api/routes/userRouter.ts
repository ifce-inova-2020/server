import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

import { createUser } from "../../stories/user/createUser";
import { getUserByID } from "../../stories/user/getUserByID";
import { getAllUsers } from "../../stories/user/getAllUsers";
import { updateUser } from "../../stories/user/updateUser";
import { deleteUser } from "../../stories/user/deleteUser";

export const userRouter = Router();

userRouter.get("/", getAllUsers);

// userRouter.get("/:id", ensureAuthenticated, getUserByID);

userRouter.post("/:id", createUser);

userRouter.put("/", ensureAuthenticated, updateUser);

userRouter.delete("/:id", ensureAuthenticated, deleteUser);
