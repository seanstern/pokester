import { Request, RequestHandler } from "express";

export default interface RequestExtension<T extends Record<string, any>> {
  /**
   * Middleware that ensures that {@linkcode RequestExtension.get} can be
   * invoked on a request safely (i.e. without throwing);
   */
  extend: RequestHandler;
  /**
   * Given a request that has passed through {@linkcode extend},
   * returns a {@linkcode T}; may throw on requests that haven't passed through
   * {@linkcode extend}.
   *
   * @param req a request; should have been run through {@linkcode extend}
   *   prior to invoking this method.
   * @return an {@linkcode T}
   */
  get: (req: Request) => T;
}
