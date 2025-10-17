import { Router } from 'express';
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/listingsControllers.js';

const listingRouter = Router();

const x = (req, res, next) => {
  console.log('Hello from middleware x');
  console.log(Date.now());

  next();
};
const y = (req, res, next) => {
  console.log('Hello from middleware y');
  console.log(req.bashar);
  next();
};
const z = (req, res, next) => {
  console.log('Hello from middleware z');
  req.amer = 'amer';
  next();
};

listingRouter.post(`/`, createListing);
listingRouter.get(`/`, x, y, z, getAllListings);
listingRouter.get(`/:id`, getListingById);
listingRouter.put(`/:id`, updateListing);
listingRouter.delete(`/:id`, deleteListing);

export default listingRouter;
