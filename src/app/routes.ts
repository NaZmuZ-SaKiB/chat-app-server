import { Router } from "express";
import { AuthRouter } from "./modules/Auth/auth.route";
import { MessageRouter } from "./modules/Message/message.route";
import { ConversationRouter } from "./modules/Conversation/conversation.route";
import { UserRouter } from "./modules/User/user.route";

const MainRouter = Router();

type TRoute = {
  path: string;
  router: Router;
};

const routes: TRoute[] = [
  {
    path: "/auth",
    router: AuthRouter,
  },
  {
    path: "/user",
    router: UserRouter,
  },
  {
    path: "/message",
    router: MessageRouter,
  },
  {
    path: "/conversation",
    router: ConversationRouter,
  },
];

routes.map((route) => MainRouter.use(route.path, route.router));

export default MainRouter;
