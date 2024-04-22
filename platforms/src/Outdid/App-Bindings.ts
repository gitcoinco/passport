import axios from "axios";
import { AppContext, PlatformOptions, ProviderPayload } from "../types";
import { Platform } from "../utils/platform";

export class OutdidPlatform extends Platform {
    platformId = "Outdid";
    path = "outdid";
    clientId: string = null;
    redirectUri: string = null;
 
    constructor(options: PlatformOptions = {}) {
        super();
        this.clientId = options.clientId as string;
        this.redirectUri = options.redirectUri as string;
    }

    async getProviderPayload(appContext: AppContext): Promise<ProviderPayload> {
        const { successRedirect, requestID } = (await axios.post(`${process.env.NEXT_PUBLIC_PASSPORT_PROCEDURE_URL?.replace(
          /\/*?$/,
          ""
        )}/outdid/connect`, {
          callback: `${this.redirectUri}?error=false&code=null&state=outdid`,
          userDid: appContext.userDid,
        })).data as { successRedirect: string, requestID: string };
        const width = 800;
        const height = 900;
        const left = appContext.screen.width / 2 - width / 2;
        const top = appContext.screen.height / 2 - height / 2;

        // Pass data to the page via props
        appContext.window.open(
          successRedirect,
          "_blank",
          `toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
        );

        const response = await appContext.waitForRedirect(this);

        return {
          requestID,
          code: "success",
          sessionKey: response.state,
          userDid: appContext.userDid,
        };
      }
}