import { Router } from 'express';
import applianceRoutes from './appliances';

const router = Router();

router.use('/appliances', applianceRoutes);

export default router;