import { Response } from "express";

interface ResponsePayload {
  message?: string;
  status?: string;
  code?: number;
  data?: any;
  errors?: any;
}

export const sendSuccess = (res: Response, payload: ResponsePayload) => {
  res.status(200).json({
    status: "SUCCESS",
    code: 200,
    ...payload,
    message: payload.message || "Resource found.",
  });
};

export const sendCreated = (res: Response, payload: ResponsePayload) => {
  res.status(201).json({
    status: "SUCCESS",
    code: 201,
    ...payload,
    message: payload.message || "Data created.",
  });
};

export const sendNotFound = (res: Response, message: string) => {
  res.status(404).json({
    status: "ERROR",
    code: 404,
    message: message || "Resource not found.",
  });
};

export const sendConflict = (res: Response, message: string) => {
  res.status(409).json({
    status: "CONFLICT",
    code: 409,
    message: message || "There is a conflict.",
  });
};

export const sendInvalid = (res: Response, message: string) => {
  res.status(422).json({
    status: "ERROR",
    code: 422,
    message: message || "Invalid attributes.",
  });
};

export const sendUnauthorized = (res: Response, message: string) => {
  res.status(401).json({
    status: "ERROR",
    code: 401,
    message: message || "You are not authorized.",
  });
};

export const sendForbidden = (res: Response, message: string) => {
  res.status(403).json({
    status: "ERROR",
    code: 403,
    message: message || "You don't have access to request this site.",
  });
};

export const sendInternalError = (res: Response, errors: any) => {
  res.status(500).json({
    status: "ERROR",
    code: 500,
    message: "Something Error.",
    errors,
  });
};

export const sendError = (
  res: Response,
  code: number,
  payload: ResponsePayload
) => {
  res.status(code).json({
    status: payload?.status || "ERROR",
    code,
    message: payload.message || "Something failed.",
    data: payload?.data,
  });
import { Response } from 'express';

interface ResponsePayload {
  message?: string;
  status?: string;
  code?: number;
  data?: any;
  errors?: any;
  
}

export const sendSuccess = (
  res: Response,
  payload: ResponsePayload
) => {
  res.status(200).send({
    status: "SUCCESS",
    code: 200,
    ...payload,
    message: payload.message || "Resource found.",
  });
};

export const sendCreated = (
  res: Response,
  payload: ResponsePayload
) => {
  res.status(201).send({
    status: "SUCCESS",
    code: 201,
    ...payload,
    message: payload.message || "Data created.",
  });
};

export const sendNotFound = (
  res: Response,
  message: string
) => {
  res.status(404).send({
    status: "ERROR",
    code: 404,
    message: message || "Resource not found.",
  });
};

export const sendConflict = (
  res: Response,
  message: string
) => {
  res.status(409).send({
    status: "CONFLICT",
    code: 409,
    message: message || "There is a conflict.",
  });
};

export const sendInvalid = (
  res: Response,
  message: string
) => {
  res.status(422).send({
    status: "ERROR",
    code: 422,
    message: message || "Invalid attributes.",
  });
};

export const sendUnauthorized = (
  res: Response,
  message: string
) => {
  res.status(401).json({
    status: "ERROR",
    code: 401,
    message: message || "You are not authorized.",
  });
};

export const sendForbidden = (
  res: Response,
  message: string
) => {
  res.status(403).json({
    status: "ERROR",
    code: 403,
    message: message || "You don't have access to request this site.",
  });
};

export const sendInternalError = (
  res: Response,
  errors: any
) => {
  res.status(500).send({
    status: "ERROR",
    code: 500,
    message: "Something Error.",
    errors,
  });
};

export const sendError = (
  res: Response,
  code: number,
  payload: ResponsePayload
) => {
  res.status(code).json({
    status: payload?.status || "ERROR",
    code,
    message: payload.message || "Something failed.",
    data: payload?.data,
  });
};
