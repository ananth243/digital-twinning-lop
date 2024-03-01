import {Router} from "express";
import { getDataFromDB, insertDataIntoDB } from "../helpers/sensorHelper.js";

const router = new Router();

router.get('/fetch-data', async (req, res) => {
    try{
        const json_data = await getDataFromDB();
        res.status(200).send({status: 'ok', data: json_data})
    } catch(e){
        res.status(500).send({status: 'failure'})
    }
})

router.post('/insert-data', async (req, res) => {
    const {
        date,
        location,
        max_temp,
        min_temp,
        avg_temp,
        max_wind,
        total_precip,
        total_snow,
        avg_visiblilty,
        avg_humidity,
        will_it_rain,
        chance_of_rain,
        will_it_snow,
        chance_of_snow,
        condition,
        uv_index
    } = req.body
    try {
        await insertDataIntoDB(
            client,
            date,
            location,
            max_temp,
            min_temp,
            avg_temp,
            max_wind,
            total_precip,
            total_snow,
            avg_visiblilty,
            avg_humidity,
            will_it_rain,
            chance_of_rain,
            will_it_snow,
            chance_of_snow,
            condition,
            uv_index
        );
        res.status(200).send({status: 'ok'})
    } catch (e) {
        res.status(500).send({status: 'failure', error: e})
    }
})

export default router;