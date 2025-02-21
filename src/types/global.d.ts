declare interface Window {
    ImageCapture: new (track: MediaStreamTrack) => ImageCapture;
}

declare class ImageCapture {
    constructor(track: MediaStreamTrack);
    grabFrame(): Promise<ImageBitmap>;
    takePhoto(): Promise<Blob>;
}
