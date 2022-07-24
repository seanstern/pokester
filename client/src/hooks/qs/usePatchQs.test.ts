import { patchQs, PatchQsSpec, PatchValueMap } from "./usePatchQs";

describe("patchQs", () => {
  test("returns unchanged queryString when patchSpec contains keys absent from queryString with validity checks that fail", () => {
    const qsKey = "notInPatchSpecKey";
    const qsVal = "someVal";
    const qs = `?${qsKey}=${qsVal}`;

    const validPatchKey = "patchSpecKey";
    const validPatchValue = "patchSpecValue";
    type ValidPatch = {
      [validPatchKey]: typeof validPatchValue;
    };

    const patchSpec: PatchQsSpec<ValidPatch> = {
      [validPatchKey]: (qv: any): qv is typeof validPatchValue =>
        qv === validPatchValue,
    };

    const patchValueMap: PatchValueMap<ValidPatch> = {
      [validPatchKey]: "invalidPatchSpecValue",
    };

    const patchedQs = patchQs(qs, patchSpec, patchValueMap);

    expect(patchedQs).toBe(qs);
  });

  test("returns queryString with keys that did not pass validity checks removed", () => {
    const validPatchKey = "patchSpecKey";
    const validPatchValue = "patchSpecValue";
    type ValidPatch = {
      [validPatchKey]: typeof validPatchValue;
    };

    const qsKey = validPatchKey;
    const qsVal = validPatchValue;
    const qs = `?${qsKey}=${qsVal}`;

    const patchSpec: PatchQsSpec<ValidPatch> = {
      [validPatchKey]: (qv: any): qv is typeof validPatchValue =>
        qv === validPatchValue,
    };

    const patchValueMap: PatchValueMap<ValidPatch> = {
      [validPatchKey]: "invalidPatchSpecValue",
    };

    const patchedQs = patchQs(qs, patchSpec, patchValueMap);

    expect(patchedQs).toBe("");
  });

  test("returns queryString with keys that pass validity checks added", () => {
    const qs = `?`;

    const validPatchKey = "patchSpecKey";
    const validPatchValue = "patchSpecValue";
    type ValidPatch = {
      [validPatchKey]: typeof validPatchValue;
    };

    const patchSpec: PatchQsSpec<ValidPatch> = {
      [validPatchKey]: (qv: any): qv is typeof validPatchValue =>
        qv === validPatchValue,
    };

    const patchValueMap: PatchValueMap<ValidPatch> = {
      [validPatchKey]: validPatchValue,
    };

    const patchedQs = patchQs(qs, patchSpec, patchValueMap);

    expect(patchedQs).toBe(`?${validPatchKey}=${validPatchValue}`);
  });

  test("returns queryString with keys that pass validity checks replaced", () => {
    const validPatchKey = "patchSpecKey";
    enum ValidPatchValue {
      INITIAL_VALUE = "initialValidValue",
      FINAL_VAUE = "finalValidValue",
    }
    type ValidPatch = {
      [validPatchKey]: ValidPatchValue;
    };

    const qsKey = validPatchKey;
    const qsVal = ValidPatchValue.INITIAL_VALUE;
    const qs = `?${qsKey}=${qsVal}`;

    const patchSpec: PatchQsSpec<ValidPatch> = {
      [validPatchKey]: (qv: any): qv is ValidPatchValue =>
        Object.values(ValidPatchValue).includes(qv),
    };

    const patchValueMap: PatchValueMap<ValidPatch> = {
      [validPatchKey]: ValidPatchValue.FINAL_VAUE,
    };

    const patchedQs = patchQs(qs, patchSpec, patchValueMap);

    expect(patchedQs).toBe(`?${validPatchKey}=${ValidPatchValue.FINAL_VAUE}`);
  });
});

describe("usePatchQs", () => {
  // Opting not test test because of guidance in
  // https://kentcdodds.com/blog/how-to-test-custom-react-hooks
  // TL;DR this hook will be tested in real world example usage
  // via consuming components
});
