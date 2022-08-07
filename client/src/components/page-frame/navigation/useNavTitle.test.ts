import { flatNavConfig } from "./navConfig";
import { getNavTitle } from "./useNavTitle";

describe("getNavTitle", () => {
  describe("when exact is true", () => {
    describe("returns navConfig based title when given paths that match navConfig exactly", () => {
      test.each(flatNavConfig)(
        "$path returns $humanName",
        ({ path, humanName }) => {
          expect(getNavTitle(path, true)).toBe(humanName);
        }
      );
    });

    describe("returns undefined when given paths that do not match navConfig exactly", () => {
      const noMatchPathComponent = "nomatch";
      test.each(flatNavConfig)(
        `$path/${noMatchPathComponent} returns undefined`,
        ({ path }) => {
          expect(
            getNavTitle(`${path}/${noMatchPathComponent}`, true)
          ).toBeUndefined();
        }
      );
    });
  });

  describe("when exact is false", () => {
    describe("returns navConfig based title when given paths that match navConfig exactly", () => {
      test.each(flatNavConfig)(
        "$path returns $humanName",
        ({ path, humanName }) => {
          expect(getNavTitle(path, false)).toBe(humanName);
        }
      );
    });

    describe("returns navConfig based title when given paths that do not match navConfig exactly", () => {
      const noMatchPathComponent = "nomatch";
      test.each(flatNavConfig)(
        `$path/${noMatchPathComponent} returns $humanName`,
        ({ path, humanName }) => {
          expect(getNavTitle(`${path}/${noMatchPathComponent}`, false)).toBe(
            humanName
          );
        }
      );
    });
  });
});
