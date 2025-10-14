import { Router } from 'express';
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from '#controllers';
import { validateBodyZod, requireAuth } from '#middlewares';
import { listingCreateSchema, listingUpdateSchema } from '#schemas';

export const listingRouter = Router();

listingRouter
  .route('/')
  .get(getAllListings)
  .post(requireAuth, validateBodyZod(listingCreateSchema), createListing);

listingRouter
  .route('/:id')
  .get(getListingById)
  .put(requireAuth, validateBodyZod(listingUpdateSchema), updateListing)
  .delete(requireAuth, deleteListing);
