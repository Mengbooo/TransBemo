import express from 'express';
import { saveRecord, getRecords } from '../controllers/recordController.js';

const router = express.Router();

router.post('/', saveRecord);
router.get('/', getRecords);

export default router;