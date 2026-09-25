import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get("/", requireAuth, (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      authenticated: true,
      user: req.user,
    },
  });
});

export default router;