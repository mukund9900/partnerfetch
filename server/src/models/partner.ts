
import {model, Schema} from "mongoose";
import {IPartners}from "../types/partner";

const partnerSchema: Schema = new Schema({
    id: {type: Number, required: true},
    urlName: {type: String, required: true},
    organization: {type: String, required: true},
    customerLocations: {type: Boolean, required: false},
    willWorkRemotely: {type: Boolean, required: false},
    website: {type: Boolean, required: true},
    service: {type: Boolean, required: false},
    offices: {type: Array, required: false}
});

export default model<IPartners>("contacts", partnerSchema);