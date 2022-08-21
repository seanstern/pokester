import { Fixture, FixtureModule } from "./fixtures";

/**
 * Given a fixture module, returns each fixture as cases table that
 * can be consumed by jest's describe.each
 * (c.f. https://jestjs.io/docs/api#describeeachtablename-fn-timeout)
 * or test.each
 * (c.f https://jestjs.io/docs/api#testeachtablename-fn-timeout)
 *
 * @example
 * import * as FooFixtureModule from "Foo.fixture";
 * const fooCasesTable = toJestCasesTable(FooFixtureModule);
 * describe.each(fooCasesTable)("$description", ({ create }) => {
 *   const fixture = create();
 *   ...
 * })
 *
 * @param fixtureModule a fixture module
 * @returns a fixture cases table that can be consumed by jest's
 *   describe.each or test.each
 */
const asJestCasesTable = <T>(fixtureModule: FixtureModule<T>): Fixture<T>[] =>
  Object.values(fixtureModule);

export default asJestCasesTable;
