import { Router } from 'express';
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from '#controllers';
import { zodValidate } from '#middlewares';
import { listingInputSchema } from '#schemas';
import { de } from 'zod/v4/locales';

export const listingRouter = Router();

listingRouter
  .route('/')
  .get(getAllListings)
  .post(zodValidate(listingInputSchema), createListing);

listingRouter
  .route('/:id')
  .get(getListingById)
  .put(zodValidate(listingInputSchema), updateListing)
  .delete(de);
