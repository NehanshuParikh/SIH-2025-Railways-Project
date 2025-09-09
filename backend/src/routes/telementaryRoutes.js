import { addTelemetry, getTelemetryByTrain } from "../controllers/telementaryController";
import { authRoleMiddleware } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/v1/telemetry", addTelemetry);
router.get("/v1/view/telemetry/:trainId",authRoleMiddleware(['Admin','Operator']), getTelemetryByTrain);

export default router;