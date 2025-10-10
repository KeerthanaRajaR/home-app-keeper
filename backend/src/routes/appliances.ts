import { Router } from 'express';
import {
  getAllAppliances,
  getApplianceById,
  createAppliance,
  updateAppliance,
  deleteAppliance
} from '../controllers/applianceController';

const router = Router();

router.get('/', getAllAppliances);
router.get('/:id', getApplianceById);
router.post('/', createAppliance);
router.put('/:id', updateAppliance);
router.delete('/:id', deleteAppliance);

export default router;