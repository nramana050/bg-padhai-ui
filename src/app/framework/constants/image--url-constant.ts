import { environment } from "../../../environments/environment";

export const ImageUrl = {

    CONTENT_IMAGE: `${environment.azureBlobStorage}/images/`,
    CONTENT_BIG_IMAGE: `${environment.azureBlobStorage}/images/`,
    IMAGES: environment.azureBlobStorage,
    LOGO_IMAGE: `${environment.azureBlobStorage}`
};
