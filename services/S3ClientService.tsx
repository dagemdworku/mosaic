import S3, { ManagedUpload } from 'aws-sdk/clients/s3';

class S3ClientService {
    s3: S3;

    constructor(endpoint: string, accessKeyId: string, secretAccessKey: string) {
        this.s3 = new S3({
            endpoint,
            accessKeyId,
            secretAccessKey,
            sslEnabled: false,
            s3ForcePathStyle: true,
            signatureVersion: 'v4',
        });
    }

    listBuckets = async (): Promise<S3.Buckets> => {
        return new Promise((resolve, reject) => {
            this.s3.listBuckets((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data?.Buckets ?? []);
                }
            });
        });
    };

    listVideosInBucket = async (bucketName: string): Promise<S3.ObjectList> => {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: bucketName,
            };

            this.s3.listObjectsV2(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data?.Contents ?? []);
                }
            });
        });
    };

    verify = async (): Promise<boolean> => {
        try {
            await this.listBuckets();
            return true;
        } catch (err) {
            return false
        }
    };

    uploadVideo = async (bucketName: string, uri: string, onProgress: (progress: number) => void) => {
        let name = uri.split("/").pop();
        if (name === undefined) throw new Error("Key is undefined.");

        const blob = await fetch(uri).then((r) => r.blob());

        const params: S3.PutObjectRequest = {
            Bucket: bucketName,
            Key: name,
            Body: blob,
        };

        const options = {
            partSize: 5 * 1024 * 1024,
            queueSize: 1,
        };

        const upload = this.s3.upload(params, options);

        upload.on('httpUploadProgress', (progress) => {
            alert('progress');
            const percent = Math.round((progress.loaded / progress.total) * 100);
            onProgress(percent);
        });

        return upload.promise();
    };

}

export default S3ClientService;