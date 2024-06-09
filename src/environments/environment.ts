import { ApplicationConstant } from "src/app/framework/constants/app-constant";

export const environment = {
  production: false,
  apiURL: 'https://baigan.net',
  logo: `./assets/logo/Captr_Logo_kw.png`,
  appTitle: window.location.host.split('-')[0].toUpperCase(),
  appInsights: {
    instrumentationKey: '451221f0-7c79-4813-9ea3-a8b385b2fd5b'
  },
  azureBlobStorage: 'https://sequationdevsav2.blob.core.windows.net',
  fileSizeLimit: '1GB',
  cdnUrl:'https://sequation-dev-v2-cdn.sequation.net',
  env:ApplicationConstant.DEV_ENV,
  buildId: "{jenkinsBuildId}",
};
