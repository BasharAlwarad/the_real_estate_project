import { Router } from 'express';
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from '#controllers';
import { validateBodyZod } from '#middlewares';
import { listingCreateSchema, listingUpdateSchema } from '#schemas';

export const listingRouter = Router();

listingRouter
  .route('/')
  .get(getAllListings)
  .post(validateBodyZod(listingCreateSchema), createListing);

listingRouter
  .route('/:id')
  .get(getListingById)
  .put(validateBodyZod(listingUpdateSchema), updateListing)
  .delete(deleteListing);
