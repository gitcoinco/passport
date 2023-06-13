// ---- Test subject
import { RequestPayload } from "@gitcoin/passport-types";
import {
  CyberProfilePremiumProvider,
  CyberProfilePaidProvider,
  CyberProfileFreeProvider,
} from "../Providers/cyberconnect";

const MOCK_ADDRESS_PREMIUM = "0xC47Aa859Fa329496dB6d498165da7e0B1FE13430"; // peiwen.cyber
const MOCK_ADDRESS_PAID = "0x000aB43e658935BA39504a1424b01756c1E9644c"; // gasless.cyber
const MOCK_ADDRESS_FREE = "0x000000096A20a3f50f7047c633301D1bf4FfE9dE"; // abcdefghijklmnopqrst.cyber
const MOCK_ADDRESS_NULL = "0x0000000000000000000000000000000000000000";
const MOCK_FAKE_ADDRESS = "FAKE_ADDRESS";

describe("Attempt premium verification", function () {
  it("handles valid verification attempt", async () => {
    const cc = new CyberProfilePremiumProvider();
    const verifiedPayload = await cc.verify({
      address: MOCK_ADDRESS_PREMIUM,
    } as unknown as RequestPayload);

    expect(verifiedPayload).toEqual({
      valid: true,
      record: {
        address: MOCK_ADDRESS_PREMIUM.toLocaleLowerCase(),
      },
    });
  });

  it("should return false for paid handle", async () => {
    const cc = new CyberProfilePremiumProvider();
    const verifiedPayload = await cc.verify({
      address: MOCK_ADDRESS_PAID,
    } as unknown as RequestPayload);

    expect(verifiedPayload).toEqual({
      valid: false,
      record: {},
    });
  });

  it("should return false for free handle", async () => {
    const cc = new CyberProfilePremiumProvider();
    const verifiedPayload = await cc.verify({
      address: MOCK_ADDRESS_FREE,
    } as unknown as RequestPayload);

    expect(verifiedPayload).toEqual({
      valid: false,
      record: {},
    });
  });

  it("should return false for null address", async () => {
    const cc = new CyberProfilePremiumProvider();
    const verifiedPayload = await cc.verify({
      address: MOCK_ADDRESS_NULL,
    } as unknown as RequestPayload);

    expect(verifiedPayload).toEqual({
      valid: false,
      record: {},
    });
  });

  it("should return false for invalid address", async () => {
    const cc = new CyberProfilePremiumProvider();
    const verifiedPayload = await cc.verify({
      address: MOCK_FAKE_ADDRESS,
    } as unknown as RequestPayload);

    expect(verifiedPayload).toEqual({
      valid: false,
      error: ["CyberProfile provider get user primary handle error"],
    });
  });
});

describe("Attempt paid verification", function () {
  it("handles valid verification attempt", async () => {
    const cc = new CyberProfilePaidProvider();
    const verifiedPayload = await cc.verify({
      address: MOCK_ADDRESS_PAID,
    } as unknown as RequestPayload);

    expect(verifiedPayload).toEqual({
      valid: true,
      record: {
        address: MOCK_ADDRESS_PAID.toLocaleLowerCase(),
      },
    });
  });

  it("should return false for premium handle", async () => {
    const cc = new CyberProfilePaidProvider();
    const verifiedPayload = await cc.verify({
      address: MOCK_ADDRESS_PREMIUM,
    } as unknown as RequestPayload);

    expect(verifiedPayload).toEqual({
      valid: false,
      record: {},
    });
  });

  it("should return false for free handle", async () => {
    const cc = new CyberProfilePaidProvider();
    const verifiedPayload = await cc.verify({
      address: MOCK_ADDRESS_FREE,
    } as unknown as RequestPayload);

    expect(verifiedPayload).toEqual({
      valid: false,
      record: {},
    });
  });

  it("should return false for null address", async () => {
    const cc = new CyberProfilePaidProvider();
    const verifiedPayload = await cc.verify({
      address: MOCK_ADDRESS_NULL,
    } as unknown as RequestPayload);

    expect(verifiedPayload).toEqual({
      valid: false,
      record: {},
    });
  });

  it("should return false for invalid address", async () => {
    const cc = new CyberProfilePaidProvider();
    const verifiedPayload = await cc.verify({
      address: MOCK_FAKE_ADDRESS,
    } as unknown as RequestPayload);

    expect(verifiedPayload).toEqual({
      valid: false,
      error: ["CyberProfile provider get user primary handle error"],
    });
  });
});

describe("Attempt free verification", function () {
  it("handles valid verification attempt", async () => {
    const cc = new CyberProfileFreeProvider();
    const verifiedPayload = await cc.verify({
      address: MOCK_ADDRESS_FREE,
    } as unknown as RequestPayload);

    expect(verifiedPayload).toEqual({
      valid: true,
      record: {
        address: MOCK_ADDRESS_FREE.toLocaleLowerCase(),
      },
    });
  });

  it("should return false for paid handle", async () => {
    const cc = new CyberProfileFreeProvider();
    const verifiedPayload = await cc.verify({
      address: MOCK_ADDRESS_PAID,
    } as unknown as RequestPayload);

    expect(verifiedPayload).toEqual({
      valid: false,
      record: {},
    });
  });

  it("should return false for premium handle", async () => {
    const cc = new CyberProfileFreeProvider();
    const verifiedPayload = await cc.verify({
      address: MOCK_ADDRESS_PREMIUM,
    } as unknown as RequestPayload);

    expect(verifiedPayload).toEqual({
      valid: false,
      record: {},
    });
  });

  it("should return false for null address", async () => {
    const cc = new CyberProfileFreeProvider();
    const verifiedPayload = await cc.verify({
      address: MOCK_ADDRESS_NULL,
    } as unknown as RequestPayload);

    expect(verifiedPayload).toEqual({
      valid: false,
      record: {},
    });
  });

  it("should return false for invalid address", async () => {
    const cc = new CyberProfileFreeProvider();
    const verifiedPayload = await cc.verify({
      address: MOCK_FAKE_ADDRESS,
    } as unknown as RequestPayload);

    expect(verifiedPayload).toEqual({
      valid: false,
      error: ["CyberProfile provider get user primary handle error"],
    });
  });
});
