import authController from "../controllers/auth.controller.js";
import cartsController from "../controllers/carts.controller.js";
import productsController from "../controllers/products.controller.js";
import viewsController from "../controllers/views.controller.js";
import mockController from "../controllers/mock.controller.js";

const router = (app) => {
  app.use("/", viewsController);
  app.use("/api/sessions", authController);
  app.use("/api/products", productsController);
  app.use("/api/carts", cartsController);
  app.use("/mockingproducts", mockController);
};

export default router;
