export const SIGNED_URL_EXPIRED_IN = 3600;

export enum MediaMineTypes {
	IMAGES_JPEG = 'images/jpeg',
	IMAGES_PNG = 'images/png'
}

export enum MediaExtensions {
    JPG = 'jpg',
    JPEG = 'jpeg',
    PNG = 'png'
}

export enum SignedUrlCommandTypes {
    PUT_OBJECT = 'PUT_OBJECT',
    GET_OBJECT = 'GET_OBJECT'
}

export const mapExtensionToMineType = (extension: string) => {
    return {
        [MediaExtensions.JPEG]: MediaMineTypes.IMAGES_JPEG,
        [MediaExtensions.JPG]: MediaMineTypes.IMAGES_JPEG,
        [MediaExtensions.PNG]: MediaMineTypes.IMAGES_PNG
    }[extension]?.toString();
}

export const isValidFileExtension = (key: string, mineType: string) => {
    if (!key) return false;

    const splitted = key.split('.');
    const extension = splitted[splitted.length - 1];
    return mapExtensionToMineType(extension) === mineType;
}