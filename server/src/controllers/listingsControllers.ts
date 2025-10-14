import { Listing } from '#models';
import { httpErrors } from '#utils';
import {
  ListingController,
  CreateListingRequest,
  UpdateListingRequest,
  ApiResponse,
  ListingResponse,
} from '#types';
import mongoose from 'mongoose';

/**
 * Listing controllers for real estate management
 *
 * These controllers handle CRUD operations for real estate listings.
 * API documentation is maintained externally in: /docs/api/
 */

export const getAllListings: ListingController<
  never,
  ApiResponse<ListingResponse[]>
> = async (req, res) => {
  const listings = await Listing.find({});
  res.json({
    success: true,
    message: 'Listings retrieved successfully',
    data: listings as ListingResponse[],
  });
};

export const getListingById: ListingController<
  never,
  ApiResponse<ListingResponse>
> = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid listing ID');
  }

  const listing = await Listing.findById(id);

  if (!listing) {
    httpErrors.notFound('Listing not found');
  }

  res.json({
    success: true,
    message: 'Listing retrieved successfully',
    data: listing as ListingResponse,
  });
};

export const createListing: ListingController<
  CreateListingRequest,
  ApiResponse<ListingResponse>
> = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    httpErrors.unprocessableEntity('Request body cannot be empty');
  }

  const newListing = new Listing(req.body);
  const savedListing = await newListing.save();

  res.status(201).json({
    success: true,
    message: 'Listing created successfully',
    data: savedListing as ListingResponse,
  });
};

export const updateListing: ListingController<
  UpdateListingRequest,
  ApiResponse<ListingResponse>
> = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
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
    success: true,
    message: 'Listing updated successfully',
    data: updatedListing as ListingResponse,
  });
};

export const deleteListing: ListingController<
  never,
  ApiResponse<ListingResponse>
> = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid listing ID');
  }

  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    httpErrors.notFound('Listing not found');
  }

  res.json({
    success: true,
    message: 'Listing deleted successfully',
    data: deletedListing as ListingResponse,
  });
};
