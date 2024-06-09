import { environment } from '../../../environments/environment';

export const BaseUrl = {
    LOGO: environment.logo,
    APPTITLE: environment.appTitle,
    azureBlobStorage: environment.azureBlobStorage,
    // CLIENT_URL: window.location.host,
    PADHAI: environment.apiURL + '/padhai-java-api',
    // PADHAI: 'https://baigan.net/padhai-java-api',    
};
