// --- React Methods
import React, { useContext } from "react";

// --- Identity tools
import { PROVIDER_ID } from "@dpopp/types";
import { fetchVerifiableCredential } from "@dpopp/identity/dist/commonjs";

// pull context
import { UserContext } from "../../context/userContext";

import { Card } from "../Card";
import { ProviderSpec } from "../../config/providers";

const iamUrl = process.env.NEXT_PUBLIC_DPOPP_IAM_URL || "";

const providerId: PROVIDER_ID = "Simple";

export default function SimpleCard(): JSX.Element {
  const { address, signer, handleAddStamp, allProvidersState } = useContext(UserContext);
  // fetch an example VC from the IAM server
  const handleFetchCredential = (): void => {
    fetchVerifiableCredential(
      iamUrl,
      {
        address: address || "",
        type: "Simple",
        version: "0.0.0",
        proofs: {
          valid: "true",
          username: "test",
        },
      },
      signer as { signMessage: (message: string) => Promise<string> }
    )
      .then((res): void => {
        handleAddStamp({
          provider: "Simple",
          credential: res.credential,
        });
      })
      .catch((e): void => {
        throw e;
      });
  };

  const issueCredentialWidget = (
    <button data-testid="button-verify-simple" className="verify-btn" onClick={handleFetchCredential}>
      Connect Simple
    </button>
  );

  return (
    <Card
      providerSpec={allProvidersState[providerId]!.providerSpec as ProviderSpec}
      verifiableCredential={allProvidersState[providerId]!.stamp?.credential}
      issueCredentialWidget={issueCredentialWidget}
    />
  );
}
