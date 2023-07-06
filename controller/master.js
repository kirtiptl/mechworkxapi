const { error } = require("winston");
const pool = require("../db");
const appError = require('../utils/appError');

exports.getcategory = async (req, res, next) => {
    try {
        const jobs = await pool.query("SELECT * FROM job_categories");
        res.json({
            statusCode: 200,
            data: jobs.rows,
        });
    } catch (error) {
       next(error);
    }
}

exports.getjobwork = async (req, res, next) => {
    try {
        const jobs = await pool.query("SELECT * FROM job_works");
        res.json({
            statusCode: 200,
            data: jobs.rows,
        });
    } catch (error) {
       next(error);
    }

}

exports.getmaterial = async (req, res, next) => {
    try {
        const jobs = await pool.query("SELECT * FROM material_types");
        res.json({
            statusCode: 200,
            data: jobs.rows,
        });
    } catch (error) {
       next(error);
    }

}

exports.getjobworkbyid = async (req, res, next) => {
    try {
        const { job_category_id } = req.query;
        if (job_category_id) {
            const job = await pool.query("SELECT * FROM job_works WHERE job_category_id= $1", [job_category_id]);
            res.json({
                statusCode: 200,
                data: job.rows,
            });
        }
        else {
            throw new appError('Missing Job Id', 406);
        }

    } catch (error) {
       next(error);
    }
}