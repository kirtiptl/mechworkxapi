const pool = require("../db");
const appError = require('../utils/appError');
const catchAsync = require("../utils/catchAsync");

exports.getBids = catchAsync(async (req, res, next) => {
    try {
        const bids = await pool.query("SELECT * FROM bids");
        res.json({
            statusCode: 200,
            data: bids.rows || [],
        });
    } catch (error) {
       next(error);
    }
});

exports.getBidsByUserId = catchAsync(async (req, res, next) => {
    try {
        const { user_id } = req.query;
        if (user_id) {
            const bids = await pool.query("SELECT * FROM bids WHERE user_id = $1", [user_id]);
            res.json({
                statusCode: 200,
                data: bids.rows || [],
            });
        }
        else {
            throw new appError('Missing User Id', 406);
        }

    } catch (error) {
        next(error);
    }
});

exports.getBidById = catchAsync(async (req, res, next) => {
    try {
        const { id } = req.params;
        if (id) {
            const bid = await pool.query("SELECT * FROM bids WHERE bid_id = $1", [id]);
            res.json({
                statusCode: 200,
                data: bid.rows[0] || []
            });
        }
        else {
            throw new appError('Missing bid Id', 406);
        }

    } catch (error) {
       next(error);
    }
});

exports.createBid = catchAsync(async (req, res, next) => {
    try {
        const body = req.body;
        const date = new Date();
        if (
            !body.job_id ||
            !body.user_id ||
            !body.bidding_amount ||
            !body.bidding_breakdown ||
            !body.delivery_days ||
            !body.scope_of_transportation ||
            !body.status
        ) {
            throw new appError('MISSING_PROPERTIES', 406);
        } else {
            const job = await pool.query(
                `INSERT INTO bids 
                (
                    job_id,
                    user_id,
                    bidding_amount,
                    bidding_breakdown,
                    delivery_days,
                    scope_of_transportation,
                    status,
                    created_at, 
                    updated_at
                ) 
                VALUES
                ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
                [
                    body.job_id,
                    body.user_id,
                    body.bidding_amount,
                    body.bidding_breakdown,
                    body.delivery_days,
                    body.scope_of_transportation,
                    body.status,
                ]
            );
            res.json({
                statusCode: 201,
                data:job.rows[0],
                message: 'BIDS_CREATED_SUCCESSFUllY'
            });
        }
    } catch (error) {
        next(error);
    }
});

exports.deleteBid = catchAsync(async (req, res) => {
    try {
        const { id } = req.query;
        if (id) {
            await pool.query("DELETE FROM bids WHERE bid_id = $1", [id]);
            res.json({
                statusCode: 200,
                message: "Bid is deleted successfully."
            });
        }
        else {
            res.status(406).send({
                statusCode: 406,
                message: "Missing bid Id"
            });
        }

    } catch (error) {
        console.error(error.message);
    }
});

exports.getBidsByStatus = catchAsync(async (req, res, next) => {
    const { user_id, status} = req.query;
    if(user_id && status) {
        const bids = await pool.query("SELECT * FROM bids WHERE user_id = $1 AND status =$2", [user_id, status]);
        res.json({
            statusCode: 200,
            data: bids.rows || []
        });
    }
    else {
        throw new appError('Missing User Id Or Status', 406);
    }
})

exports.getBidsByJobId = catchAsync(async (req, res, next) => {
    const { job_id } = req.query;
    if(job_id) {
        const bids = await pool.query("SELECT * FROM bids WHERE job_id = $1", [job_id]);
        res.json({
            statusCode: 200,
            data: bids.rows || []
        });
    }
    else {
        throw new appError('Missing Job Id', 406);
    }
})

exports.updatestatus = catchAsync(async (req, res, next) => {
    try{
        const { state,bidid} = req.query;
      if (bidid) {
        const updateQuery = 'UPDATE bids SET state = $1 WHERE bid_id = $2';
        await pool.query(updateQuery, [state, bidid]); 
        res.json({
            statusCode: 200,
            message: "state is updated",
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
})
