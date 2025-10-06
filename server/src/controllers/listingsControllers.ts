import { Listing } from '#models';
import { httpErrors } from '#utils';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

export const getAllListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listings = await Listing.find({});
    res.json(listings);
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      httpErrors.badRequest('Invalid listing ID');
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      httpErrors.notFound('Listing not found');
    }

    res.json(listing);
  } catch (error) {
    next(error);
  }
};

export const createListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newListing = new Listing(req.body);
    const savedListing = await newListing.save();
    res.status(201).json({
      message: 'Listing created successfully',
      listing: savedListing,
    });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
