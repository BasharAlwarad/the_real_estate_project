import { Router } from 'express';
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from '#controllers';
import { validateBodyZod } from '#middlewares';
import { listingInputSchema } from '#schemas';

export const listingRouter = Router();

listingRouter
  .route('/')
  .get(getAllListings)
  .post(validateBodyZod(listingInputSchema), createListing);

listingRouter
  .route('/:id')
  .get(getListingById)
  .put(validateBodyZod(listingInputSchema), updateListing)
  .delete(deleteListing);
