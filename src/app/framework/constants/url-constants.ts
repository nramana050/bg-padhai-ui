import { environment } from '../../../environments/environment';

export const BaseUrl = {
    LOGO: environment.logo,
    APPTITLE: environment.appTitle,
    azureBlobStorage: environment.azureBlobStorage,
    // CLIENT_URL: window.location.host,
    PADHAI: environment.apiURL + '/padhai-java-api',
    // PADHAI: 'http://localhost:8080/padhai-java-api',    
};
