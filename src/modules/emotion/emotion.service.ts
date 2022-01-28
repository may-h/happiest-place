import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
// import {AnalysisGroupRepository} from "./analysisGroup.repository";
import {ConfigService} from "@nestjs/config";
import * as exif from 'exif-parser';
import  { BlobServiceClient, StorageSharedKeyCredential, BlobSASPermissions, generateBlobSASQueryParameters } from '@azure/storage-blob';
import {Readable} from "stream";
import * as msRest from "@azure/ms-rest-js";
import * as Face from "@azure/cognitiveservices-face";


@Injectable()
export class EmotionService {
    private readonly AZURE_STORAGE_ACCOUNT_NAME: string;
    private readonly AZURE_STORAGE_KEY: string;
    private readonly AZURE_STORAGE_CONTAINER: string;
    private readonly sharedKeyCredential;
    private blobServiceClient;

    private readonly FACE_KEY;
    private readonly FACE_END_POINT;
    private FACE_API_CLIENT;

    constructor(
        // @InjectRepository(AnalysisGroupRepository)
        // private analysisGroupRepository: AnalysisGroupRepository,
        private readonly config: ConfigService
    ) {
        // storage
        this.AZURE_STORAGE_ACCOUNT_NAME = config.get('AZURE_STORAGE_ACCOUNT_NAME');
        this.AZURE_STORAGE_KEY = config.get('AZURE_STORAGE_KEY')
        this.AZURE_STORAGE_CONTAINER = config.get('AZURE_STORAGE_CONTAINER')
        this.sharedKeyCredential = new StorageSharedKeyCredential(this.AZURE_STORAGE_ACCOUNT_NAME, this.AZURE_STORAGE_KEY);
        this.blobServiceClient = new BlobServiceClient(
            // When using AnonymousCredential, following url should include a valid SAS or support public access
            `https://${this.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
            this.sharedKeyCredential
        );

        // face api
        // 엔드포인트 및 키를 사용하여 클라이언트를 인스턴스화 &&  FaceClient 개체
        this.FACE_KEY = config.get('FACE_KEY');
        this.FACE_END_POINT = config.get('FACE_END_POINT');
        this.FACE_API_CLIENT = new Face.FaceClient(new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': this.FACE_KEY } }), this.FACE_END_POINT);

    }

    // extract exif from image.
    getGps(file) {
        let {GPSLatitude: lat, GPSLongitude: lng} = exif.create(file.buffer).parse().tags;

        return ({lat, lng})
    }

    generateBlobName (originalName)  {
        const identifier = Math.random().toString().replace(/0\./, '');
        return `${identifier}-${originalName}`;
    };

    uploadBlob = async (file, blobName) => {
        const uploadOptions = { bufferSize: 4 * 1024 * 1024, maxBuffers: 20 };

        const stream = Readable.from(file.buffer);
        const containerClient = this.blobServiceClient.getContainerClient(this.AZURE_STORAGE_CONTAINER);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        try {
            const result = await blockBlobClient.uploadStream(
                stream,
                uploadOptions.bufferSize,
                uploadOptions.maxBuffers,
                {
                    blobHTTPHeaders: { blobContentType: "image/jpeg" }
                }
            );
            console.log(`File uploaded to Azure Blob Storage. - ${blobName}`);
            // console.log('upload result -> ', result);
            // return {blobName, result};
            return await this.getUrl(blobName);
        } catch (err) {
            return ({ message: err.message });
        }
    }

    async getUrl(name) {
        const sasOptions = {
            containerName: this.AZURE_STORAGE_CONTAINER,
            blobName: name,
            startsOn: new Date(),
            expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
            permissions: BlobSASPermissions.parse("r")
        };


        const sasToken = generateBlobSASQueryParameters(sasOptions, this.sharedKeyCredential).toString();
        // console.log(`SAS token for blob is: ${sasToken}`);

        const containerClient = this.blobServiceClient.getContainerClient(this.AZURE_STORAGE_CONTAINER);
        return `${containerClient.getBlockBlobClient(name).url}?${sasToken}`;
    }

    async getEmotion(url) {
        let detected_faces = await this.FACE_API_CLIENT.face.detectWithUrl(url,
            {
                // returnFaceAttributes: ["Accessories","Age","Blur","Emotion","Exposure","FacialHair","Gender","Glasses","Hair","HeadPose","Makeup","Noise","Occlusion","Smile"],
                returnFaceAttributes: ["Emotion","Smile"],
                detectionModel: "detection_01"
            });
        return detected_faces;
    }

    getAvgHappinessRate(emotionArr) {
        // console.log(JSON.stringify(emotionArr, null, 4))
        const sum = emotionArr.reduce((a, b) => a.faceAttributes.emotion.happiness + b.faceAttributes.emotion.happiness);
        return (sum / emotionArr.length) || 0;
    }

     async run(files, userId) {
/*
        //동기
        console.time('sync')
        for await (const file of files){
            const gps = this.getGps(file);
            console.log('gqs->', gps);
            const url = await this.uploadBlob(file, 'abcd');
            // result image db에 저장
            console.log('url->', url);
            const emotionData = await this.getEmotion(url);
            const avgSmile = this.getAvgHappinessRate(emotionData)
            console.log(avgSmile);
        }
        console.timeEnd('sync')
 */

         console.time('promise')
         let result = [];
        for await (const file of files) {
            const res = await Promise.all([
                this.getGps(file),
                this.uploadBlob(file, 'abcd'),
                this.getAvgHappinessRate(await this.getEmotion(await this.getUrl('abcd')))
            ]).then(values => ({gps: values[0], url: values[1], happiness: values[2]}));

            result.push(res);
        }
         console.timeEnd('promise')


        return result;
    }

}