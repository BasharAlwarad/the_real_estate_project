/**
 * Swagger/OpenAPI Reusable Components
 *
 * This file contains reusable components for API documentation:
 * - Examples: Realistic data samples for requests/responses
 * - Parameters: Common path/query parameters (IDs, pagination)
 * - Headers: Standard HTTP headers used across endpoints
 *
 * These components are referenced in YAML documentation files to ensure
 * consistency and reduce duplication across the API documentation.
 *
 * @openapi
 * components:
 *   examples:
 *     UserExample:
 *       summary: Sample User
 *       description: Example of a complete user object
 *       value:
 *         _id: "507f1f77bcf86cd799439011"
 *         userName: "john_doe"
 *         email: "john.doe@example.com"
 *         image: "https://res.cloudinary.com/demo/image/upload/profile.jpg"
 *         createdAt: "2025-10-10T10:30:00.000Z"
 *         updatedAt: "2025-10-10T15:45:00.000Z"
 *
 *     ListingExample:
 *       summary: Sample Listing
 *       description: Example of a complete listing object
 *       value:
 *         _id: "507f1f77bcf86cd799439012"
 *         title: "Beautiful Ocean View House"
 *         price: 750000
 *         image: "https://res.cloudinary.com/demo/image/upload/house.jpg"
 *         createdAt: "2025-10-10T10:30:00.000Z"
 *         updatedAt: "2025-10-10T15:45:00.000Z"
 *
 *     UserCreateExample:
 *       summary: Create User Request
 *       description: Example request body for creating a new user
 *       value:
 *         userName: "jane_smith"
 *         email: "jane.smith@example.com"
 *         password: "securePassword123"
 *         image: "https://example.com/profile.jpg"
 *
 *     ListingCreateExample:
 *       summary: Create Listing Request
 *       description: Example request body for creating a new listing
 *       value:
 *         title: "Modern Downtown Apartment"
 *         price: 450000
 *         image: "https://example.com/apartment.jpg"
 *
 *     UserUpdateExample:
 *       summary: Update User Request
 *       description: Example request body for updating a user (partial update)
 *       value:
 *         userName: "jane_smith_updated"
 *         email: "jane.new@example.com"
 *
 *     ListingUpdateExample:
 *       summary: Update Listing Request
 *       description: Example request body for updating a listing (partial update)
 *       value:
 *         title: "Modern Downtown Apartment - Updated"
 *         price: 475000
 *
 *     ValidationErrorExample:
 *       summary: Validation Error
 *       description: Example validation error response
 *       value:
 *         error: "Validation failed"
 *         details:
 *           field: "email"
 *           message: "Please enter a valid email"
 *
 *     NotFoundErrorExample:
 *       summary: Not Found Error
 *       description: Example 404 error response
 *       value:
 *         error: "User not found"
 *
 *     ServerErrorExample:
 *       summary: Server Error
 *       description: Example 500 server error response
 *       value:
 *         error: "Internal server error"
 *
 *     SuccessResponseExample:
 *       summary: Success Response
 *       description: Example successful operation response
 *       value:
 *         message: "User created successfully"
 *         user:
 *           _id: "507f1f77bcf86cd799439011"
 *           userName: "john_doe"
 *           email: "john.doe@example.com"
 *           image: "https://res.cloudinary.com/demo/image/upload/profile.jpg"
 *           createdAt: "2025-10-10T10:30:00.000Z"
 *           updatedAt: "2025-10-10T15:45:00.000Z"
 *
 *   parameters:
 *     UserIdParam:
 *       name: id
 *       in: path
 *       required: true
 *       description: MongoDB ObjectId of the user
 *       schema:
 *         type: string
 *         format: objectid
 *         pattern: '^[0-9a-fA-F]{24}$'
 *         example: "507f1f77bcf86cd799439011"
 *
 *     ListingIdParam:
 *       name: id
 *       in: path
 *       required: true
 *       description: MongoDB ObjectId of the listing
 *       schema:
 *         type: string
 *         format: objectid
 *         pattern: '^[0-9a-fA-F]{24}$'
 *         example: "507f1f77bcf86cd799439012"
 *
 *     LimitParam:
 *       name: limit
 *       in: query
 *       description: Maximum number of results to return
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 100
 *         default: 10
 *         example: 20
 *
 *     OffsetParam:
 *       name: offset
 *       in: query
 *       description: Number of results to skip for pagination
 *       schema:
 *         type: integer
 *         minimum: 0
 *         default: 0
 *         example: 0
 *
 *   headers:
 *     ContentType:
 *       description: Content type of the response
 *       schema:
 *         type: string
 *         example: "application/json"
 *
 *     Location:
 *       description: URL of the newly created resource
 *       schema:
 *         type: string
 *         format: uri
 *         example: "http://localhost:3000/users/507f1f77bcf86cd799439011"
 */

/**
 * This file contains only Swagger/OpenAPI component definitions.
 *
 * Usage:
 * - Referenced in YAML docs via: $ref: '#/components/examples/UserExample'
 * - Provides consistent examples across all API endpoints
 * - Ensures realistic data in Swagger UI testing interface
 * - Reduces duplication in documentation files
 *
 * No runtime TypeScript code is exported from this file.
 */
export {};
