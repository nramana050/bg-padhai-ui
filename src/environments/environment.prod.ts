import { ApplicationConstant } from "src/app/framework/constants/app-constant";

export const environment = {
  production: true,
  apiURL: 'https://communityliveservices.sequation.com',
  logo: `./assets/logo/new_logo.png`,
  appTitle: window.location.host.split('-')[0].toUpperCase(),
  appInsights: {
      instrumentationKey: '43f4bcf0-3a46-43fe-a5b0-ecc18e4a66bb'
  },
  azureBlobStorage: 'https://communitylivesa.blob.core.windows.net',
  fileSizeLimit: '1GB',
    cdnUrl:'https://community-live-cdn.sequation.com',
    env:ApplicationConstant.PROD_ENV,
    buildId: "{jenkinsBuildId}",
};
