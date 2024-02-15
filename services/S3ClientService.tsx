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

    verify = async (): Promise<boolean> => {
        try {
            await this.listBuckets();
            return true;
        } catch (err) {
            return false
        }
    };

}

export default S3ClientService;