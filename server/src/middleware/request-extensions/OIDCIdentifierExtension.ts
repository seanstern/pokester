import RequestExtension from "./RequestExtension";

export type OIDCIdentifier = {
  iss: string;
  sub: string;
};
/**
 * Given anything, returns true when it is of type {@linkcode OIDCIdentifer};
 * false otherwise.
 *
 * @param idTokenClaims anything
 * @returns true when {@link idTokenClaims} is of type
 *   {@linkcode OIDCIdentifer}; false otherwise
 */
const isOIDCIdentifier = (
  idTokenClaims: any
): idTokenClaims is OIDCIdentifier => {
  return (
    typeof idTokenClaims?.iss === "string" &&
    typeof idTokenClaims?.sub === "string"
  );
};

type OIDCIdentifierExtension = RequestExtension<OIDCIdentifier>;

/**
 * Given an HTTP request, an HTTP response, and a callback, attempts to ensure
 * the request contains sufficient information to return the
 * {@linkcode OIDCIdentifier} contained therein. Calls the callback with no
 * errors upon success; calls the callback with error information upon failure.
 *
 * @param req an HTTP request
 * @param res an HTTP response
 * @param next the callback
 */
const extend: OIDCIdentifierExtension["extend"] = (req, res, next) => {
  try {
    if (!isOIDCIdentifier(req.oidc.idTokenClaims)) {
      throw new Error("OIDC identifier missing");
    }
    next();
    return;
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * Given a request that has been extended by {@linkcode extend}, returns the
 * {@linkcode OIDCIdentifier} component of the request.
 *
 * @param req the request
 * @returns  the {@linkcode OIDCIdentifier} component of the request.
 */
const get: OIDCIdentifierExtension["get"] = (req) => {
  const { idTokenClaims } = req.oidc;
  if (!isOIDCIdentifier(idTokenClaims)) {
    throw new Error("OIDC identifier missing");
  }
  const { iss, sub } = idTokenClaims;
  return { iss, sub };
};

export default { extend, get } as OIDCIdentifierExtension;
