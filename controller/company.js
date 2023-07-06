const { error } = require("winston");
const pool = require("../db");
const appError = require('../utils/appError');
const path = require('path');
const basePath = require('path').resolve('./');
const insertJobFiles = require('../controller/files')

exports.getJobs = async (req, res, next) => {
    try {
        const jobs = await pool.query("SELECT * FROM jobs");
        res.json({
            statusCode: 200,
            data: jobs.rows,
        });
    } catch (error) {
        next(error);
    }
}

exports.getJobsByUserId = async (req, res, next) => {
    try {
        const { user_id, status, limit, offset } = req.query;
        if (user_id) {
            let query;
            let values;
            let countquery;
            if (status === '') {
                countquery = "SELECT COUNT(*) AS total_count FROM jobs WHERE user_id = $1";
                countvalue = [user_id];
                query = "SELECT * FROM jobs WHERE user_id = $1  LIMIT $2 OFFSET $3";
                values = [user_id, limit, offset];
            } else {
                countquery = "SELECT COUNT(*) AS total_count FROM jobs WHERE user_id = $1 AND status = $2";
                countvalue = [user_id, status]
                query = 'SELECT * FROM jobs WHERE user_id = $1 AND status = $2  LIMIT $3 OFFSET $4';
                values = [user_id, status, limit, offset];
            }
            const countResult = await pool.query(countquery, countvalue);
            const totalItems = countResult.rows[0].total_count;

            const jobs = await pool.query(query, values);
            res.json({
                statusCode: 200,
                data: jobs.rows,
                totalItems,
            });
        }
        else {
            throw new appError('Missing User Id', 406);
        }

    } catch (error) {
        next(error);
    }
}

exports.getJobById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (id) {
            const job = await pool.query("SELECT * FROM jobs WHERE job_id = $1", [id]);
            res.json({
                statusCode: 200,
                data: job.rows[0]
            });
        }
        else {
            throw new appError('Missing Job Id', 406);
        }

    } catch (error) {
        next(error);
    }
}

exports.createJob = async (req, res, next) => {
    try {
        const body = req.body;
        if (
            !body.job_category_id ||
            !body.job_work_id ||
            !body.user_id ||
            !body.material_type_id ||
            !body.job_title ||
            !body.quantity ||
            !body.descriptions ||
            !body.total_budget ||
            !body.job_type ||
            !body.job_deadline
        ) {
            throw new appError('MISSING_PROPERTIES', 406);
        } else {
            const job = await pool.query(
                `INSERT INTO jobs 
                (
                    job_category_id, 
                    job_work_id, 
                    document_id, 
                    user_id, 
                    material_type_id, 
                    job_title,
                    quantity, 
                    descriptions, 
                    total_budget, 
                    job_type, 
                    job_deadline, 
                    weight, 
                    max_transportation_cost, 
                    is_material_provided_by_company, 
                    status, 
                    created_at, 
                    updated_at
                ) 
                VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
                [
                    body.job_category_id.toString(),
                    body.job_work_id.toString(),
                    JSON.stringify(body.document_id),
                    parseInt(body.user_id),
                    parseInt(body.material_type_id),
                    body.job_title,
                    parseInt(body.quantity),
                    body.descriptions,
                    parseInt(body.total_budget),
                    body.job_type,
                    body.job_deadline,
                    parseInt(body.weight),
                    parseInt(body.max_transportation_cost),
                    body.is_material_provided_by_company,
                    'active'
                ]
            );
            res.json({
                statusCode: 201,
                data: job.rows[0],
                message: 'JOB_CREATED_SUCCESSFUllY'
            });
        }
    } catch (error) {
        next(error);
    }
}

exports.deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const job = await pool.query("DELETE FROM jobs WHERE job_id = $1", [id]);
            res.json({
                statusCode: 200,
                message: "Job is deleted successfully."
            });
        }
        else {
            res.status(406).send({
                statusCode: 406,
                message: "Missing Job Id"
            });
        }

    } catch (error) {
        console.error(error.message);
    }
}

exports.uploadFiles = async (req, res) => {

    const document_ids = [];

    if (req.files) {
        if (req.files.data_file && req.files.inspection_sheet) {
            const dataFile = await insertJobFiles.fileUpload(req.files.data_file);
            if (dataFile.length > 0) {
                document_ids.push({ data_file: dataFile[0].file_id });
            }
            else {
                throw new appError('Unable to save the data file', 409);
            }

            const inspectionSheetFile = await insertJobFiles.fileUpload(req.files.inspection_sheet);
            if (dataFile.length > 0) {
                document_ids.push({ inspection_sheet: inspectionSheetFile[0].file_id });
            }
            else {
                throw new appError('Unable to save the inspection sheet File', 409);
            }
        }
        else {
            throw new appError('Please upload the data file', 406);
        }

        if (req.files.inspection_sheet) {
            const otherDocumentsFile = await insertJobFiles.fileUpload(req.files.other_documents);
            if (otherDocumentsFile.length > 0) {
                var ids = [];
                for (var i = 0; i < otherDocumentsFile.length; i++) {
                    ids.push(otherDocumentsFile[i].file_id);
                }
                document_ids.push({ other_documents: ids });
            }
            else {
                throw new appError('Unable to save the inspection sheet File', 409);
            }
        }
        res.status(200).json({
            statusCode: 200,
            result: document_ids
        })
    }
    else {
        throw new appError('Missing files', 406);
    }
}

exports.updateByBidStatus = async (req, res) => {
    try {
        const { state, bidid } = req.query;
        if (bidid) {
            const updateQuery = 'UPDATE bids SET state = $1 WHERE bid_id = $2';
            await pool.query(updateQuery, [state, bidid]);
            res.json({
                statusCode: 200,
                message: "state is updated"
            });
        }
        else {
            res.status(406).send({
                statusCode: 406,
                message: "Missing Bid Id"
            });
        }
    } catch (error) {
        console.error(error.message);
    }
}
