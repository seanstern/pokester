import { RequestHandler } from "express";

const emptyResponse: RequestHandler = (req, res) => res.end();

export const create: RequestHandler = jest.fn(emptyResponse);

export const get: RequestHandler = jest.fn(emptyResponse);

export const act: RequestHandler = jest.fn(emptyResponse);

export const getAll: RequestHandler = jest.fn(emptyResponse);
