"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const partnerSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    urlName: { type: String, required: true },
    organization: { type: String, required: true },
    customerLocations: { type: Boolean, required: false },
    willWorkRemotely: { type: Boolean, required: false },
    website: { type: Boolean, required: true },
    service: { type: Boolean, required: false },
    offices: { type: Array, required: false }
});
exports.default = (0, mongoose_1.model)("contacts", partnerSchema);
