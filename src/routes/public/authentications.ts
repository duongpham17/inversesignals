import express, {IRouter} from 'express';
import { protect, persist, login, signup, reset, forgot } from '../../controllers/authentication';

const router: IRouter = express.Router();

router.get('/load', protect, persist);
router.post('/login', login);
router.post('/signup', signup);
router.post('/reset', reset);
router.post('/forgot', forgot);

export default router;