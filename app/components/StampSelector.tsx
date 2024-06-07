import React, { useContext, useMemo } from "react";
import { PROVIDER_ID } from "@gitcoin/passport-types";
import { PlatformSpec } from "@gitcoin/passport-platforms";
import { PlatformGroupSpec } from "../config/providers";
import { useOnChainData } from "../hooks/useOnChainData";
import { OnchainTag } from "./OnchainTag";
import { CeramicContext } from "../context/ceramicContext";
import { ScorerContext } from "../context/scorerContext";
import { useCustomization } from "../hooks/useCustomization";
import { isDynamicCustomization } from "../utils/customizationUtils";
import { customSideBarGradient } from "./PlatformDetails";

type StampSelectorProps = {
  currentPlatform?: PlatformSpec | undefined;
  currentProviders: PlatformGroupSpec[] | undefined;
  verifiedProviders: PROVIDER_ID[] | undefined;
  selectedProviders: PROVIDER_ID[] | undefined;
  setSelectedProviders: (providerIds: PROVIDER_ID[]) => void;
};

const checkMark = () => (
  <svg className="inline-block" width="13" height="9" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.74412 4.33333L4.32795 8L11.0122 1"
      stroke="#C1F6FF"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export function StampSelector({
  currentPlatform,
  currentProviders,
  verifiedProviders,
  selectedProviders,
  setSelectedProviders,
}: StampSelectorProps) {
  const { allProvidersState } = useContext(CeramicContext);
  const { activeChainProviders } = useOnChainData();
  const { stampWeights } = useContext(ScorerContext);
  const includedGroupsAndProviders = useIncludedGroupsAndProviders(currentProviders || []);

  // check if provider is on-chain
  const isProviderOnChain = (provider: PROVIDER_ID) => {
    if (currentPlatform) {
      const providerObj = activeChainProviders.find((p) => p.providerName === provider);
      if (providerObj) {
        return providerObj.credentialHash === allProvidersState[provider]?.stamp?.credential.credentialSubject.hash;
      }
    }

    return false;
  };

  return (
    <>
      {/* each of the available providers in this platform */}
      {currentProviders?.map((stamp) => {
        // hide stamps based on filter
        if (includedGroupsAndProviders[stamp.platformGroup].length === 0) {
          return null;
        }

        return (
          <div key={stamp.platformGroup} className={`mt-6`}>
            <p className="mb-1 text-xl font-bold">{stamp.platformGroup}</p>
            {stamp.providers?.map((provider, i) => {
              if (!includedGroupsAndProviders[stamp.platformGroup].includes(provider.name)) {
                return null;
              }
              const verified = verifiedProviders?.indexOf(provider.name) !== -1;

              let textColor = verified ? "text-color-1" : "text-color-2";

              const rawWeight = stampWeights?.[provider.name];
              const weight = rawWeight ? +parseFloat(rawWeight).toFixed(2) : 0;

              return (
                <React.Fragment key={provider.name}>
                  <div
                    data-testid={`indicator-${provider.name}`}
                    className={`relative rounded ${verified ? "border-foreground-2" : "border-color-3"} text-base ${textColor} flex justify-between items-stretch border text-color-3 mt-4 `}
                  >
                    <div className={`p-4 border-r w-3/4 ${verified && customSideBarGradient}`}>
                      <p className={`${verified && "font-bold text-color-6"}`}>
                        {verified && checkMark()} {provider.title}
                      </p>
                      {provider.description && <p className="my-2 text-sm">{provider.description}</p>}
                    </div>

                    {/* TODO: dbl check with product this is not needed */}
                    {/* {FeatureFlags.FF_CHAIN_SYNC && isProviderOnChain(provider.name) && <OnchainTag marginLeft="3" />} */}
                    <div
                      className={`bg-gradient-to-r from-foreground-2 to-foreground-4 w-1/4 flex items-center ${verified && "text-background-4"}`}
                    >
                      <p className="text-center w-full">
                        <span className={`${verified && "font-bold"}`}>{weight}</span> <br />
                        points{" "}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

const useIncludedGroupsAndProviders = (specs: PlatformGroupSpec[]): Record<string, string[]> => {
  const customization = useCustomization();

  const included = useMemo(() => {
    const included: Record<string, string[]> = {};
    specs.forEach((spec) => {
      const providers = spec.providers?.map((p) => p.name) || [];

      if (!isDynamicCustomization(customization) || !customization.scorer?.weights) {
        included[spec.platformGroup] = providers;
        return;
      }

      included[spec.platformGroup] = providers.reduce((includedProviders, provider) => {
        if (parseFloat(customization.scorer?.weights?.[provider] || "0") > 0) {
          includedProviders.push(provider);
        }
        return includedProviders;
      }, [] as string[]);
    });

    return included;
  }, [specs, customization]);

  return included;
};
