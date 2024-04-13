import authController from "../controllers/auth.controller.js";
import cartsController from "../controllers/carts.controller.js";
import productsController from "../controllers/products.controller.js";
import viewsController from "../controllers/views.controller.js";
import mockController from "../controllers/mock.controller.js";
import loggerTestController from "../controllers/loggerTest.controller.js";
import mailController from "../controllers/mail.controller.js";
import userController from "../controllers/user.controller.js";
import adminController from "../controllers/admin.controller.js";
import handlerError from "../middlewares/errors/handler.error.js";

const router = (app) => {
  app.use("/", viewsController);
  app.use("/api/sessions", authController);
  app.use("/api/products", productsController);
  app.use("/api/carts", cartsController);
  app.use("/mockingproducts", mockController);
  app.use("/loggerTest", loggerTestController);
  app.use("/resetpassword", mailController);
  app.use("/api/users", userController);
  app.use("/admin", adminController);
  app.use(handlerError);
};

export default router;
