import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Listing } from '../models/Listing.js';

export const getAllListings = async (req: Request, res: Response) => {
  const listings = await Listing.find({});
  res.json(listings);
};

export const getListingById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid listing ID');
  }

  const listing = await Listing.findById(id);

  if (!listing) {
    throw new Error('Listing not found');
  }

  res.json(listing);
};

export const createListing = async (req: Request, res: Response) => {
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
    throw new Error('Invalid listing ID');
  }

  const updatedListing = await Listing.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedListing) {
    throw new Error('Listing not found');
  }

  res.json({
    message: 'Listing updated successfully',
    listing: updatedListing,
  });
};

export const deleteListing = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid listing ID');
  }

  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    throw new Error('Listing not found');
  }

  res.json({
    message: 'Listing deleted successfully',
    listing: deletedListing,
  });
};
