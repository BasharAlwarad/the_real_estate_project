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

/**
 * @openapi
 * /listings:
 *   get:
 *     tags:
 *       - Listings
 *     summary: Get all listings
 *     description: Retrieve all real estate listings from the database
 *     responses:
 *       200:
 *         description: Successfully retrieved all listings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Listing'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     tags:
 *       - Listings
 *     summary: Create a new listing
 *     description: Create a new real estate listing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ListingCreate'
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Beautiful Ocean View House"
 *               price:
 *                 type: number
 *                 example: 750000
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file upload
 *     responses:
 *       201:
 *         description: Listing created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListingResponse'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Unprocessable entity - empty request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /listings/{id}:
 *   get:
 *     tags:
 *       - Listings
 *     summary: Get listing by ID
 *     description: Retrieve a specific real estate listing by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *           example: "507f1f77bcf86cd799439011"
 *         description: MongoDB ObjectId of the listing
 *     responses:
 *       200:
 *         description: Successfully retrieved the listing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 *       400:
 *         description: Bad request - invalid listing ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     tags:
 *       - Listings
 *     summary: Update listing by ID
 *     description: Update a specific real estate listing by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *           example: "507f1f77bcf86cd799439011"
 *         description: MongoDB ObjectId of the listing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ListingUpdate'
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Beautiful Ocean View House"
 *               price:
 *                 type: number
 *                 example: 850000
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New image file upload
 *     responses:
 *       200:
 *         description: Listing updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListingResponse'
 *       400:
 *         description: Bad request - invalid listing ID or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags:
 *       - Listings
 *     summary: Delete listing by ID
 *     description: Delete a specific real estate listing by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *           example: "507f1f77bcf86cd799439011"
 *         description: MongoDB ObjectId of the listing
 *     responses:
 *       200:
 *         description: Listing deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListingResponse'
 *       400:
 *         description: Bad request - invalid listing ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

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
