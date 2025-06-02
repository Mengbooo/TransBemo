import express from 'express';
import { saveRecord, getRecords, deleteRecord, clearRecords } from '../controllers/recordController.js';

const router = express.Router();

router.post('/', saveRecord);
router.get('/', getRecords);
router.delete('/:id', deleteRecord);
router.delete('/', clearRecords);

export default router;