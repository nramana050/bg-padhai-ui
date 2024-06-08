export class FileUploadOptions {
    maxFileSize: number;
    showPreviews: boolean;
    preserveFiles: boolean;
    label?: string;
    multiple: boolean;
    acceptAllFiles?: boolean;
    accept?: string[] = [];
    // Format is only applicable which file objects doesn't have type field values
    // Format is to be used by the extension of the file itself (only for inclusion not for exclusion)
    formats?: string[] = [];
}

export class FileUploadDocumentOptions {
    maxFileSize: number;
    showPreviews: boolean;
    preserveFiles: boolean;
    label?: string;
    multiple: boolean;
    acceptAllFiles?: boolean;

}

export class FileTypes {
    // MS TYPES
    public static DOCX: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    public static DOC: string = 'application/msword';
    public static ODT: string = 'application/vnd.oasis.opendocument.text';
    public static ODP: string = 'application/vnd.oasis.opendocument.presentation';
    public static ODS: string = 'application/vnd.oasis.opendocument.spreadsheet';
    public static XLS: string = 'application/vnd.ms-excel';
    public static XLSX: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    public static PPS_PPT: string = 'application/vnd.ms-powerpoint';
    public static PPTX: string = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    public static PDF: string = 'application/pdf';
    public static PUBLISHER: string = 'application/vnd.ms-publisher';
    public static EPUB: string = 'application/epub+zip';
    public static TXT: string = 'text/plain';
    public static HTML: string = 'text/html';
    public static JPEG: string = 'image/jpeg';
    public static PNG: string = 'image/png';
    public static RTF: string = 'application/rtf';
    public static ZIP: string = 'application/x-zip-compressed';


    // MEDIA
    public static MP4: string = 'video/mp4';
    public static FLV: string = 'video/flv';
    public static MP3: string = 'audio/mp3';
    public static WAV: string = 'audio/wav';
    public static MPEG = 'audio/mpeg';
}

export class FileFormats {
    public static FLV = 'flv';
    public static DOCX: string = 'docx';
    public static DOC_RTF: string = 'doc';
    public static ODT: string = 'odt';
    public static ODP: string = 'odp';
    public static ODS: string = 'ods';
    public static XLS: string = 'xls';
    public static XLSX: string = 'xlsx';
    public static PPS_PPT: string = 'ppt';
    public static PPTX: string = 'pptx';
    public static PPS: string = 'pps';
    public static PDF: string = 'pdf';
    public static PUBLISHER: string = 'pub';
    public static EPUB: string = 'epub';
    public static TXT: string = 'txt';
    public static HTML: string = 'html';
    public static JPEG: string = 'jpeg';
    public static PNG: string = 'png';
    public static JPG: string = 'jpg';
    public static ZIP: string = 'zip';
    public static HTM: string = 'htm';
    public static MP4: string = 'mp4';
    public static MP3: string = 'mp3';
    public static WAV: string = 'wav';
    public static MPEG: string = 'mpeg';
    public static RTF: string = 'rtf';

}

export class FileError {
    file: File;
    message: string;

    constructor(file: File, message: string) {
        this.file = file;
        this.message = message;
    }
}