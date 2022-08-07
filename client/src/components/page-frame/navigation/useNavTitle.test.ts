import { flatNavConfig } from "./navConfig";
import { getNavTitle } from "./useNavTitle";

describe("getNavTitle", () => {
  describe("when exact is true", () => {
    describe("returns navConfig based title when given paths that match navConfig exactly", () => {
      test.each(flatNavConfig)("$path returns $title", ({ path, title }) => {
        expect(getNavTitle(path, true)).toBe(title);
      });
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
      test.each(flatNavConfig)("$path returns $title", ({ path, title }) => {
        expect(getNavTitle(path, false)).toBe(title);
      });
    });

    describe("returns navConfig based title when given paths that do not match navConfig exactly", () => {
      const noMatchPathComponent = "nomatch";
      test.each(flatNavConfig)(
        `$path/${noMatchPathComponent} returns $title`,
        ({ path, title }) => {
          expect(getNavTitle(`${path}/${noMatchPathComponent}`, false)).toBe(
            title
          );
        }
      );
    });
  });
});
