// ===================================================================
// COMMON EXPRESS TYPES
// ===================================================================

import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

// Enhanced Express types with better type safety
export interface TypedRequest<
  TBody = any,
  TParams extends ParamsDictionary = ParamsDictionary,
  TQuery extends Query = Query
> extends Request<TParams, any, TBody, TQuery> {}

export interface TypedResponse<T = any> extends Response {
  json: (body: T) => this;
}

export type AsyncController<
  TBody = any,
  TParams extends ParamsDictionary = ParamsDictionary,
  TQuery extends Query = Query,
  TResponse = any
> = (
  req: TypedRequest<TBody, TParams, TQuery>,
  res: TypedResponse<TResponse>,
  next: NextFunction
) => Promise<void>;

// Specific controller types for our endpoints
export type UserController<TBody = any, TResponse = any> = AsyncController<
  TBody,
  UserParams,
  UserQuery,
  TResponse
>;

export type ListingController<TBody = any, TResponse = any> = AsyncController<
  TBody,
  ListingParams,
  ListingQuery,
  TResponse
>;

// ===================================================================
// MODEL INTERFACES
// ===================================================================

import { Document } from 'mongoose';

// User related types
export interface IUser extends Document {
  userName: string;
  email: string;
  image: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  userName: string;
  email: string;
  image?: string;
  password: string;
}

export interface UpdateUserRequest {
  userName?: string;
  email?: string;
  image?: string;
  password?: string;
}

export interface UserResponse {
  _id: string;
  userName: string;
  email: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

// Listing related types
export interface IListing extends Document {
  title: string;
  price: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateListingRequest {
  title: string;
  price: number;
  image?: string;
}

export interface UpdateListingRequest {
  title?: string;
  price?: number;
  image?: string;
}

export interface ListingResponse {
  _id: string;
  title: string;
  price: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===================================================================
// API RESPONSE TYPES
// ===================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  stack?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ===================================================================
// HTTP ERROR TYPES
// ===================================================================

export interface HttpError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export interface ErrorWithStack extends Error {
  stack?: string;
}

// ===================================================================
// MIDDLEWARE TYPES
// ===================================================================

export type ErrorHandler = (
  err: ErrorWithStack,
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

// ===================================================================
// VALIDATION TYPES
// ===================================================================

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ===================================================================
// DATABASE TYPES
// ===================================================================

export interface MongoQuery<T = any> {
  filter?: Partial<T>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  skip?: number;
  populate?: string | string[];
}

export interface DatabaseConfig {
  uri: string;
  options?: Record<string, any>;
}

// ===================================================================
// UTILITY TYPES
// ===================================================================

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ===================================================================
// ROUTE PARAMETER TYPES
// ===================================================================

export interface IdParam extends ParamsDictionary {
  id: string;
}

export interface UserParams extends IdParam {}

export interface ListingParams extends IdParam {}

// ===================================================================
// QUERY PARAMETER TYPES
// ===================================================================

export interface PaginationQuery extends ParsedQs {
  page?: string;
  limit?: string;
}

export interface SearchQuery extends PaginationQuery {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface UserQuery extends SearchQuery {
  email?: string;
  userName?: string;
}

export interface ListingQuery extends SearchQuery {
  minPrice?: string;
  maxPrice?: string;
  title?: string;
}

// ===================================================================
// EXPORT ALL TYPES
// ===================================================================

// Re-export Express types for convenience
export { Request, Response, NextFunction } from 'express';
export { ParamsDictionary, Query } from 'express-serve-static-core';
export { ParsedQs } from 'qs';
export { Document } from 'mongoose';
