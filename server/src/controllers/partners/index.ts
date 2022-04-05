import {Response, Request} from "express";
import { IPartners } from "../../types/partner";
import Partner from "../../models/partner";
import { Stream } from "stream";

const dataLat:number = 51.5144636;
const dataLong:number = -0.142571;


const getPartnerDetails = async function (){
    return await Partner.find().select('id organization offices').lean();
}
interface IPartnercardDetails {
    company: string,
    address: string,
    id: number,
    range?: number
}
interface rangePost {
    maxKm: string,
    minKm: string
}

export const getPartners = async (req: Request, res: Response): Promise<any> => {
    try{
        let partnersInRange : IPartnercardDetails[] = [];

        const partners = await getPartnerDetails();

        partners.forEach(function(data){
            data.offices.forEach(function(officeData: {[key: string]: any}){
                partnersInRange.push({
                    id: data.id,
                    company: data.organization,
                    address: officeData.address
                })
            })
        })

        res.status(200).json(partnersInRange);
    }
    catch(error){
        throw error;
    }
}
//https://www.movable-type.co.uk/scripts/latlong.html
    /* 
    Haversine formula:	
    a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
    c = 2 ⋅ atan2( √a, √(1−a) )
    d = R ⋅ c
    where	φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km);
    note that angles need to be in radians to pass to trig functions!
    */
function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}


export const fetchPartnersWithInKmRange = async (req: Request, res: Response): Promise<any> => {
    try{

        
        const body = req.body as Pick<rangePost, 'minKm' | 'maxKm'>
        

        // the calculated distance should be less than max km and greater than min km given
        // minkm >= VALUE >= maxkm

        let partnersInRange : IPartnercardDetails[] = [];
       
        let partners = await Partner.find({}).select('id organization offices').lean();


        partners.forEach(function(partnerdata){
        

            (partnerdata.offices).forEach(function(officeData : {[key: string]: any}){


                let coords : string[] = (officeData.coordinates).toString().split(',');
                

                const lat = parseFloat(coords[0]);
                const long = parseFloat(coords[1]);
                const range : number = distance(dataLat, dataLong, lat, long);
                
                if( range >= parseFloat(body.minKm)  && range <= parseFloat(body.maxKm)){
                    partnersInRange.push({
                        company: partnerdata.organization, 
                        address: officeData.address, 
                        id: partnerdata.id,
                        range: Math.round(range)
                    })
                }
                
            })
        })

        res.status(200)
        .json(partnersInRange)


    }
    catch(e){

    }
}
