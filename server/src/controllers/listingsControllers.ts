import { Listing } from '#models';
import { httpErrors, asyncHandler } from '#utils';
import mongoose from 'mongoose';

export const getAllListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find();
  res.json(listings);
});

export const getListingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid listing ID');
  }

  const listing = await Listing.findById(id);

  if (!listing) {
    httpErrors.notFound('Listing not found');
  }

  res.json(listing);
});

export const createListing = asyncHandler(async (req, res) => {
  const newListing = await Listing.create(req.body);
  res.status(201).json(newListing);
});

export const updateListing = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid listing ID');
  }

  const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedListing) {
    httpErrors.notFound('Listing not found');
  }

  res.json(updatedListing);
});

export const deleteListing = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid listing ID');
  }

  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    httpErrors.notFound('Listing not found');
  }

  res.json({
    message: 'Listing deleted successfully',
  });
});
