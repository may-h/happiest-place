import {Analysis} from "../../../entity/Analysis.entity";

export class createImageDto {
    filename: string;
    orgFilename: string;
    lat: any;
    lng: any;
    url: string;
    avgHappinessRate: any;
    analysis: Analysis
}