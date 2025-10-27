import { Request, Response, NextFunction } from 'express';
import { User, Listing } from '#models';

/**
 * Owner Authorization Middleware
 *
 * Verifies that the authenticated user is the owner of the resource they're trying to access.
 * This middleware must be used AFTER requireAuth middleware.
 *
 * For User resources: Checks if req.userId matches the :id param
 * For Listing resources: Checks if req.userId matches the listing's owner field
 */

/**
 * Checks if the authenticated user owns the user account
 */
export const isUserOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).userId as string | undefined;
    const resourceId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!resourceId) {
      res.status(400).json({
        success: false,
        message: 'Resource ID is required',
      });
      return;
    }

    // Check if the authenticated user is trying to access their own account
    if (userId !== resourceId) {
      res.status(403).json({
        success: false,
        message: 'Access denied: You can only modify your own account',
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authorization check failed',
    });
  }
};

/**
 * Checks if the authenticated user owns the listing
 */
export const isListingOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).userId as string | undefined;
    const listingId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!listingId) {
      res.status(400).json({
        success: false,
        message: 'Listing ID is required',
      });
      return;
    }

    // Fetch the listing to check ownership
    const listing = await Listing.findById(listingId);

    if (!listing) {
      res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
      return;
    }

    // Check if the authenticated user owns this listing
    if (listing.owner.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Access denied: You can only modify your own listings',
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authorization check failed',
    });
  }
};
