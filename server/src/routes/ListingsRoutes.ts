import { Router } from 'express';
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/listingsControllers.js';

const listingRouter = Router();

listingRouter.post(`/`, createListing);
listingRouter.get(`/`, getAllListings);
listingRouter.get(`/:id`, getListingById);
listingRouter.put(`/:id`, updateListing);
listingRouter.delete(`/:id`, deleteListing);

export default listingRouter;
