// Import the necessary modules and mock axios
import { RequestPayload } from "@gitcoin/passport-types";
import { AllowListProvider } from "../Providers/allowList"; // Adjust the import path as necessary
import { ProviderExternalVerificationError } from "../../types";
import axios from "axios";

jest.mock("axios");

const MOCK_ADDRESS = "0xcF314CE817E25b4F784bC1f24c9A79A525fEC50f";

const payload = {
  address: MOCK_ADDRESS,
  proofs: {
    allowList: "test",
  },
} as unknown as RequestPayload;

describe("AllowListProvider verification", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles valid allow list verification attempt", async () => {
    // Mocking axios response for a valid case
    const axiosMock = (axios.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("registry/allow-list")) {
        return Promise.resolve({
          data: {
            on_list: true,
          },
        });
      }
    });

    const allowListProvider = new AllowListProvider();
    const verification = await allowListProvider.verify(payload);

    expect(verification).toEqual({
      valid: true,
      record: {
        address: MOCK_ADDRESS,
        allowList: "test",
      },
    });
  });

  it("handles invalid allow list verification attempt", async () => {
    // Mocking axios response for an invalid case
    (axios.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("registry/allow-list")) {
        return Promise.resolve({
          data: {
            on_list: false,
          },
        });
      }
    });

    const allowListProvider = new AllowListProvider();
    const verification = await allowListProvider.verify(payload);

    expect(verification).toEqual({
      valid: false,
      record: {
        address: MOCK_ADDRESS,
        allowList: "test",
      },
    });
  });

  it("handles errors during allow list verification", async () => {
    // Simulating an axios error
    (axios.get as jest.Mock).mockRejectedValue("Network error");

    const allowListProvider = new AllowListProvider();
    await expect(
      allowListProvider.verify({
        address: MOCK_ADDRESS,
      } as RequestPayload)
    ).rejects.toThrow(ProviderExternalVerificationError);
  });
});
