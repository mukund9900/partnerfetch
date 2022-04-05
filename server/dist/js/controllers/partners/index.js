"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPartnersWithInKmRange = exports.getPartners = void 0;
const partner_1 = __importDefault(require("../../models/partner"));
const dataLat = 51.5144636;
const dataLong = -0.142571;
const getPartnerDetails = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return yield partner_1.default.find().select('id organization offices').lean();
    });
};
const getPartners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let partnersInRange = [];
        const partners = yield getPartnerDetails();
        partners.forEach(function (data) {
            data.offices.forEach(function (officeData) {
                partnersInRange.push({
                    id: data.id,
                    company: data.organization,
                    address: officeData.address
                });
            });
        });
        res.status(200).json(partnersInRange);
    }
    catch (error) {
        throw error;
    }
});
exports.getPartners = getPartners;
//https://www.movable-type.co.uk/scripts/latlong.html
/*
Haversine formula:
a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
c = 2 ⋅ atan2( √a, √(1−a) )
d = R ⋅ c
where	φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km);
note that angles need to be in radians to pass to trig functions!
*/
function distance(lat1, lon1, lat2, lon2) {
    let p = 0.017453292519943295; // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
const fetchPartnersWithInKmRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        // the calculated distance should be less than max km and greater than min km given
        // minkm >= VALUE >= maxkm
        let partnersInRange = [];
        let partners = yield partner_1.default.find({}).select('id organization offices').lean();
        partners.forEach(function (partnerdata) {
            (partnerdata.offices).forEach(function (officeData) {
                let coords = (officeData.coordinates).toString().split(',');
                const lat = parseFloat(coords[0]);
                const long = parseFloat(coords[1]);
                const range = distance(dataLat, dataLong, lat, long);
                if (range >= parseFloat(body.minKm) && range <= parseFloat(body.maxKm)) {
                    partnersInRange.push({
                        company: partnerdata.organization,
                        address: officeData.address,
                        id: partnerdata.id,
                        range: Math.round(range)
                    });
                }
            });
        });
        res.status(200)
            .json(partnersInRange);
    }
    catch (e) {
    }
});
exports.fetchPartnersWithInKmRange = fetchPartnersWithInKmRange;
