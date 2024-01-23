import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import cors from "cors";

import __dirname from "./utils.js";
import mongoConnect from "./db/database.mongo.js";
import config from "./config/dotenv.config.js";
import initializePassport from "./config/passport.config.js";
import router from "./routes/router.js";

const app = express();
const port = config.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(cors());

mongoConnect();

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

initializePassport();
app.use(passport.initialize());

router(app);

app.listen(port, () => {
  console.log("Express server working on port: ", port);
});
