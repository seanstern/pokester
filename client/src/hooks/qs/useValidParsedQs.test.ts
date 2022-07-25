import { getValidParsedQs, ValidParsedQsSpec } from "./useValidParsedQs";

describe("getValidParsedQs", () => {
  describe("returns object without key(s)", () => {
    test("when queryString contains no keys in validParsedQsSpec", () => {
      const qsKey = "notInvValidParsedQsSpecKey";
      const qsVal = "someVal";

      const qs = `?${qsKey}=${qsVal}`;

      const validParsedQsKey = "validParsedQsKey";
      const validParsedQsVal = "validParsedQsVal";
      const validParsedQsSpec: ValidParsedQsSpec<{
        [validParsedQsKey]: typeof validParsedQsVal;
      }> = {
        [validParsedQsKey]: (qv: any): qv is typeof validParsedQsVal =>
          qv === validParsedQsVal,
      };

      const vpq = getValidParsedQs(qs, validParsedQsSpec);

      expect((vpq as any)[qsKey]).toBeUndefined();
      expect(vpq[validParsedQsKey]).toBeUndefined();
    });

    test("when queryString contains key(s) that do not pass validity check in validParsedQsSpec", () => {
      const validParsedQsKey = "validParsedQsKey";
      const validParsedQsVal = "validParsedQsVal";
      const validParsedQsSpec: ValidParsedQsSpec<{
        [validParsedQsKey]: typeof validParsedQsVal;
      }> = {
        [validParsedQsKey]: (qv: any): qv is typeof validParsedQsVal =>
          qv === validParsedQsVal,
      };

      const qsKey = validParsedQsKey;
      const qsVal = "someVal";

      const qs = `?${qsKey}=${qsVal}`;

      const vpq = getValidParsedQs(qs, validParsedQsSpec);

      expect(vpq[validParsedQsKey]).toBeUndefined();
    });
  });

  test("returns object with key(s) when queryString contains key(s) that pass validity check", () => {
    const validParsedQsKey = "validParsedQsKey";
    const validParsedQsVal = "validParsedQsVal";
    const validParsedQsSpec: ValidParsedQsSpec<{
      [validParsedQsKey]: typeof validParsedQsVal;
    }> = {
      [validParsedQsKey]: (qv: any): qv is typeof validParsedQsVal =>
        qv === validParsedQsVal,
    };

    const qsKey = validParsedQsKey;
    const qsVal = validParsedQsVal;

    const qs = `?${qsKey}=${qsVal}`;

    const vpq = getValidParsedQs(qs, validParsedQsSpec);

    expect(vpq[validParsedQsKey]).toBe(validParsedQsVal);
  });
});

describe("useValidParsedQs", () => {
  // Opting not test test because of guidance in
  // https://kentcdodds.com/blog/how-to-test-custom-react-hooks
  // TL;DR this hook will be tested in real world example usage
  // via consuming components
});
