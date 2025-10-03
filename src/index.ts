import express, { Router } from "express";

import authRoute from "../src/controller/auth/auth.route"
import movieRoute from "../src/controller/movie/movie.route"
import reviewRoute from "../src/controller/review/review.route"
import likeRoute from "../src/controller/like/like.route"
import Validate from "../src/controller/utils/validate";

const app = express();
const router = Router();
const port = 3000

app.use(express.json());
app.use(router);

router.use("/auth", authRoute)
router.use(Validate.jwtProtect);
router.use("/movie", movieRoute)
router.use("/review", reviewRoute)
router.use("/like", likeRoute)

app.listen(port, () => {
  console.log(`Server is running in port: ${port}`);
})
