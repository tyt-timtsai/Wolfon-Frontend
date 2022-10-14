import axios from 'axios';
import constants from './constants';

export default class Uploader {
  constructor(options) {
    // this must be bigger than or equal to 5MB
    this.chunkSize = options.chunkSize || 1024 * 1024 * 5;
    // number of parallel uploads
    this.threadsQuantity = Math.min(options.threadsQuantity || 5, 15);
    this.file = options.file;
    this.fileName = options.fileName;
    this.aborted = false;
    this.uploadedSize = 0;
    this.progressCache = {};
    this.activeConnections = {};
    this.parts = [];
    this.uploadedParts = [];
    this.fileId = null;
    this.fileKey = null;
    this.room = null;
    this.onProgressFn = () => {};
    this.onErrorFn = () => {};
  }

  start() {
    this.initialize();
  }

  async initialize() {
    // console.log('Start multipart upload ...');
    try {
      // adding the the file extension (if present) to fileName
      let { fileName } = this;
      const ext = this.file.type.split('/').pop();
      if (ext) {
        fileName += `.${ext}`;
      }
      // retrieving the pre-signed URLs
      const numberOfparts = Math.ceil(this.file.size / this.chunkSize);

      const multipartUpload = {
        fileName,
        parts: numberOfparts,
      };

      // console.log('Get multipart upload urls...');
      const urlsResponse = await axios.post(`${constants.SERVER_URL}/api/v1/live/upload`, multipartUpload);
      this.fileId = urlsResponse.data.fileId;
      this.fileKey = urlsResponse.data.fileKey;
      const newParts = urlsResponse.data.parts;
      this.parts.push(...newParts);

      this.sendNext();
    } catch (error) {
      await this.complete(error);
    }
  }

  sendNext() {
    const activeConnections = Object.keys(this.activeConnections).length;
    // console.log(activeConnections);
    // console.log(this.activeConnections);
    if (activeConnections >= this.threadsQuantity) {
      // console.log('bigger');
      return;
    }
    if (!this.parts.length) {
      if (!activeConnections) {
        this.complete();
      }
      // console.log('return');
      return;
    }

    const part = this.parts.pop();
    // console.log(part);
    // console.log(this.file);
    if (this.file && part) {
      const sentSize = (part.PartNumber - 1) * this.chunkSize;
      const chunk = this.file.slice(sentSize, sentSize + this.chunkSize);
      const sendChunkStarted = () => {
        this.sendNext();
      };

      this.sendChunk(chunk, part, sendChunkStarted)
        .then(() => {
          this.sendNext();
        })
        .catch((error) => {
          console.log(error);
          this.parts.push(part);

          this.complete(error);
        });
    }
  }

  async complete(error) {
    if (error && !this.aborted) {
      this.onErrorFn(error);
      return;
    }

    if (error) {
      this.onErrorFn(error);
      return;
    }

    try {
      await this.sendCompleteRequest();
    } catch (err) {
      this.onErrorFn(err);
    }
  }

  async sendCompleteRequest() {
    if (this.fileId && this.fileKey) {
      const completeUploadData = {
        fileId: this.fileId,
        fileKey: this.fileKey,
        parts: this.uploadedParts,
        roomId: this.room,
      };

      const completeResult = await axios.post(`${constants.SERVER_URL}/api/v1/live/complete`, completeUploadData);
      // console.log('Complete multipart upload ...');
      this.url = completeResult.data.Location;
    }
  }

  sendChunk(chunk, part, sendChunkStarted) {
    return new Promise((resolve, reject) => {
      this.upload(chunk, part, sendChunkStarted)
        .then((status) => {
          if (status !== 200) {
            reject(new Error('Failed chunk upload'));
            return;
          }
          // console.log('Upload successfully');
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  handleProgress(part, event) {
    if (this.file) {
      if (event.type === 'progress' || event.type === 'error' || event.type === 'abort') {
        this.progressCache[part] = event.loaded;
      }

      if (event.type === 'uploaded') {
        this.uploadedSize += this.progressCache[part] || 0;
        delete this.progressCache[part];
      }

      const inProgress = Object.keys(this.progressCache)
        .map(Number)
        // eslint-disable-next-line no-return-assign, no-param-reassign
        .reduce((memo, id) => (memo += this.progressCache[id]), 0);

      const sent = Math.min(this.uploadedSize + inProgress, this.file.size);

      const total = this.file.size;

      const percentage = Math.round((sent / total) * 100);

      this.onProgressFn({
        sent,
        total,
        percentage,
      });
    }
  }

  upload(file, part, sendChunkStarted) {
    // uploading each part with its pre-signed URL
    return new Promise((resolve, reject) => {
      if (this.fileId && this.fileKey) {
        // eslint-disable-next-line no-multi-assign
        const xhr = (this.activeConnections[part.PartNumber - 1] = new XMLHttpRequest());

        sendChunkStarted();
        const progressListener = this.handleProgress.bind(this, part.PartNumber - 1);

        xhr.upload.addEventListener('progress', progressListener);
        xhr.addEventListener('error', progressListener);
        xhr.addEventListener('abort', progressListener);
        xhr.addEventListener('loadend', progressListener);

        xhr.open('PUT', part.signedUrl);

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            let ETag;
            // console.log(xhr.getAllResponseHeaders());
            if (xhr.getAllResponseHeaders().indexOf('etag') > 0) {
              ETag = xhr.getResponseHeader('etag');
              // console.log(ETag);

              const uploadedPart = {
                PartNumber: part.PartNumber,
                ETag: ETag.replaceAll('"', ''),
              };
              this.uploadedParts.push(uploadedPart);
              resolve(xhr.status);
              delete this.activeConnections[part.PartNumber - 1];
              // console.log('connections deleted');
            }
          }
        };

        xhr.onerror = (error) => {
          reject(error);
          delete this.activeConnections[part.PartNumber - 1];
        };

        xhr.onabort = () => {
          reject(new Error('Upload canceled by user'));
          delete this.activeConnections[part.PartNumber - 1];
        };

        xhr.send(file);
      }
    });
  }

  onProgress(onProgress) {
    this.onProgressFn = onProgress;
    return this;
  }

  onError(onError) {
    this.onErrorFn = onError;
    return this;
  }

  abort() {
    Object.keys(this.activeConnections)
      .map(Number)
      .forEach((id) => {
        this.activeConnections[id].abort();
      });

    this.aborted = true;
  }
}
