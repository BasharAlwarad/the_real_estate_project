import { Router } from 'express';
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from '#controllers';
import { validateBodyZod, requireAuth, isListingOwner } from '#middlewares';
import { listingCreateSchema, listingUpdateSchema } from '#schemas';

export const listingRouter = Router();

listingRouter
  .route('/')
  .get(getAllListings)
  .post(requireAuth, validateBodyZod(listingCreateSchema), createListing);

listingRouter
  .route('/:id')
  .get(getListingById)
  .put(
    requireAuth,
    isListingOwner,
    validateBodyZod(listingUpdateSchema),
    updateListing
  )
  .delete(requireAuth, isListingOwner, deleteListing);
