const pool = require("../db");
const path = require('path');
const basePath = require('path').resolve('./');

exports.fileUpload = async function insertJobFiles(files) {
    
    const fileData = files;

    let query = `INSERT INTO files 
            (
                file_name,
                path, 
                mine_type,
                created_at,
                updated_at        
            )    
            VALUES `;
    let counter = 0;
    let queryParameters = [];

    for (let i = 0; i < fileData.length; i++) {

        fileData[i]['path'] = path.join(basePath, path.sep, fileData[i]['path']);

        if (counter != 0) {
            query += `,`;
        }
        query += `($${counter + 1}, $${counter + 2}, $${counter + 3
            }, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
        counter = counter + 3;

        queryParameters.push(
            fileData[i]['filename'],
            fileData[i]['path'],
            fileData[i]['mimetype'],
        );
    }
    if (counter != 0) {
        query += ` RETURNING *`;
    }

    const fileDataQuery = await pool.query(query, queryParameters);
    return fileDataQuery.rows;
}