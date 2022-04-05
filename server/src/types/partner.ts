import { Document } from 'mongoose'
import {Schema} from "mongoose";
export interface IPartners extends Document {
    id: number;
    urlName: string;
    organization: string;
    customerLocations: string,
    willWorkRemotely: boolean,
    website: string,
    service: string,
    offices: any[]
}

