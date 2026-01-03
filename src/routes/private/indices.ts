import express, {IRouter} from 'express';
import { protect, restrict } from '../../controllers/authentication';
import { find, create, update, remove } from '../../controllers/indicies';

const router: IRouter = express.Router();

router.use(protect, restrict(["admin", "user"]));
router.get('/', find);
router.post('/', create);
router.patch('/', update);
router.delete('/:id', remove);

export default router;