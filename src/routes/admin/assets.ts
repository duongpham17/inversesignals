import express, {IRouter} from 'express';
import { protect, restrict } from '../../controllers/authentication';
import { find, create, update, remove, findId, findSelect } from '../../controllers/assets';

const router: IRouter = express.Router();

router.use(protect, restrict(["admin"]));
router.get('/', find);
router.post('/', create);
router.patch('/', update);

router.get('/select', findSelect);

router.delete('/:id', remove);
router.get('/:id', findId);

export default router;