import { ApplicationConstant } from "src/app/framework/constants/app-constant";

export const environment = {
    production: true,
    apiURL: 'https://testservices.sequation.net',
    logo: `./assets/logo/new_logo.png`,
    appTitle: window.location.host.split('-')[0].toUpperCase(),
    appInsights: {
        instrumentationKey: '4abf521f-9d5b-40c8-800f-227a61202a9f'
    },
    azureBlobStorage: 'https://sequationtestsav2.blob.core.windows.net',
    fileSizeLimit: '1GB',
    cdnUrl:'https://sequation-test-cdn-v2.sequation.net',
    env:ApplicationConstant.TEST_ENV,
    buildId: "{jenkinsBuildId}",
};
