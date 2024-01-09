import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { db } from "./config/database.config.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import config from "./config/dotenv.config.js";
import initializePassport from "./config/passport.config.js";
import { viewRouter } from "./routes/views.router.js";
import { authRouter } from "./routes/auth.router.js";
import { productRouter } from "./routes/products.router.js";
import { cartRouter } from "./routes/carts.router.js";

const app = express();
const port = config.PORT;

app.listen(port, () => {
  console.log("Express server working on port: ", port);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

app.use("/", viewRouter);
app.use("/api/sessions", authRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
