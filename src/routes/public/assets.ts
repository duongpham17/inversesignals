import express, { IRouter } from 'express';
import { find, findName, findSelect } from '../../controllers/assets';

const router: IRouter = express.Router();

router.get('/', find);
router.get('/select', findSelect);
router.get('/:name', findName);

export default router;