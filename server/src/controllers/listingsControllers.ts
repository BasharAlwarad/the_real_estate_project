import { Listing } from '#models';
import { httpErrors, asyncHandler } from '#utils';
import mongoose from 'mongoose';

export const getAllListings = asyncHandler(async (req, res, next) => {
  const listings = await Listing.find({});
  res.json(listings);
});

export const getListingById = asyncHandler(async (req, res, next) => {
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

export const createListing = asyncHandler(async (req, res, next) => {
  const newListing = new Listing(req.body);
  const savedListing = await newListing.save();
  res.status(201).json({
    message: 'Listing created successfully',
    listing: savedListing,
  });
});

export const updateListing = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid listing ID');
  }

  const updatedListing = await Listing.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedListing) {
    httpErrors.notFound('Listing not found');
  }

  res.json({
    message: 'Listing updated successfully',
    listing: updatedListing,
  });
});

export const deleteListing = asyncHandler(async (req, res, next) => {
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
    listing: deletedListing,
  });
});
