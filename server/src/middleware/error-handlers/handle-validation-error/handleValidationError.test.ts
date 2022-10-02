import handleReqBodyValidationError, {
  getSendBody,
} from "./handleValidationError";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { ValidationError } from "yup";

test("handles single ValidationError", () => {
  const req = getMockReq();
  const { res, next } = getMockRes();
  const singleError = new ValidationError("some error");

  handleReqBodyValidationError(singleError, req, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.send).toHaveBeenCalledTimes(1);
  expect(res.send).toHaveBeenCalledWith(getSendBody(singleError));
});

test("handles multiple ValidationErrors", () => {
  const req = getMockReq();
  const { res, next } = getMockRes();
  const multipleErrors = new ValidationError([
    new ValidationError("some error"),
    new ValidationError("another error"),
  ]);

  handleReqBodyValidationError(multipleErrors, req, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.send).toHaveBeenCalledTimes(1);
  expect(res.send).toHaveBeenCalledWith(getSendBody(multipleErrors));
});

test("handles non-ValidationErrors", () => {
  const req = getMockReq();
  const { res, next } = getMockRes();
  const nonValidationError = new Error("not validation");

  handleReqBodyValidationError(nonValidationError, req, res, next);

  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(next).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledWith(nonValidationError);
});
