const { JWT } = require('google-auth-library');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'];
module.exports = auth = (spread_id, client_email, private_key) => new GoogleSpreadsheet(spread_id, new JWT({ email: client_email, key: private_key, scopes: SCOPES }));