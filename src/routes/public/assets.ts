import express, { IRouter } from 'express';
import { find, findName, findSelect, historicalStocks, streamStocks } from '../../controllers/assets';

const router: IRouter = express.Router();

router.get('/', find);
router.get('/select', findSelect);
router.get('/stocks', historicalStocks);
router.get('/stocks/stream/:id', streamStocks);
router.get('/:name', findName);

export default router;