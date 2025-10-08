import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Listing } from '#models';
import { httpErrors } from '#utils';

export const getAllListings = async (req: Request, res: Response) => {
  const listings = await Listing.find({});
  res.json(listings);
};

export const getListingById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid listing ID');
  }

  const listing = await Listing.findById(id);

  if (!listing) {
    httpErrors.notFound('Listing not found');
  }

  res.json(listing);
};

export const createListing = async (req: Request, res: Response) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    httpErrors.unprocessableEntity('Request body cannot be empty');
  }

  const newListing = new Listing(req.body);
  const savedListing = await newListing.save();
  res.status(201).json({
    message: 'Listing created successfully',
    listing: savedListing,
  });
};

export const updateListing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid listing ID');
  }

  // Check if listing exists first
  const existingListing = await Listing.findById(id);
  if (!existingListing) {
    httpErrors.notFound('Listing not found');
  }

  const updatedListing = await Listing.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({
    message: 'Listing updated successfully',
    listing: updatedListing,
  });
};

export const deleteListing = async (req: Request, res: Response) => {
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
};
