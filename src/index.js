const spreadAuth = require('./modules/spreadAuth');

module.exports = class SpreadDB {
  constructor({ client_email, private_key }) {
    this.client_email = client_email;
    this.private_key = private_key;
  }

  async register(spread_id) {
    let data = spreadAuth(spread_id, this.client_email, this.private_key);
    await data.loadInfo();
    let result = {};

    result = { ...result, ...data['_rawProperties'], sheetCount: data.sheetCount };
    result.spreadsheetId = data['spreadsheetId'];
    result.spreadsheetUrl = data['_spreadsheetUrl'];
    result.googleDriveUrl = `https://drive.google.com/file/d/${data['spreadsheetId']}/view`;

    let allSheets = [];
    const sheetID = Object.keys(data['_rawSheets']);

    sheetID.forEach((v, i) => {
      const val = data['_rawSheets'][v]['_rawProperties'];
      let res = {
        ...val,
        spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${data['spreadsheetId']}/edit#gid=${val.sheetId}`,
        ...val['gridProperties'],
        headerRowIndex: data['_rawSheets'][v]['_headerRowIndex'],
      };
      delete res['gridProperties'];
      allSheets.push(res);
    });

    for (let i = 0; i < allSheets.length; i++) {
      const sheet = data.sheetsByTitle[allSheets[i].title];
      let rows = [];
      try {
        rows = await sheet.getRows();
      } catch (e) {
        rows = [];
      }
      const jsonData = [];
      rows.forEach((row, i) => {
        const rowData = { index: i };
        sheet._headerValues.forEach((header, index) => {
          rowData[header.split(' ').join('_').toLowerCase()] = row._rawData[index];
        });
        jsonData.push(rowData);
      });
      allSheets[i].contentCounts = jsonData.length;
      allSheets[i].contents = jsonData;
    }

    result.rawSheets = allSheets;

    return {
      addValue: async (sheet_title, value = []) => {
        const sheet = data.sheetsByTitle[sheet_title];
        const insert = await sheet.addRows(value, { insert: true, raw: true });
        return !!insert;
      },
      addSheet: async (sheet_title, { headers = [] }) => {
        try {
          await data.addSheet({ title: sheet_title, headerValues: headers });
          return true;
        } catch (e) {
          return false;
        }
      },
      getData: () => {
        delete result.defaultFormat;
        delete result.spreadsheetTheme;
        return result;
      },
      getAllSheets: () => allSheets,
      getSheetByIndex: sheet_index => allSheets[sheet_index],
      getSheetById: sheet_id => allSheets.find(x => x.id === sheet_id),
      getSheetByTitle: sheet_title => allSheets.find(x => x.title === sheet_title),

      getAllContents: () => allSheets.map(x => x.contents),
      getContentByIndex: sheet_index => allSheets[sheet_index]?.contents,
      getContentById: sheet_id => allSheets.find(x => x.sheetId === sheet_id)?.contents,
      getContentByTitle: sheet_title => allSheets.find(x => x.title === sheet_title)?.contents,

      changeDocTitle: new_title => {
        try {
          if (!new_title) return false;
          data.updateProperties({ new_title });
          return true;
        } catch (e) {
          return false;
        }
      },
      changeSheetTitleByTitle: (sheet_title, new_title) => {
        try {
          if (!sheet_title && new_title) return false;
          const sheet = data.sheetsByTitle[sheet_title];
          sheet.updateProperties({ title: new_title });
          return true;
        } catch (e) {
          return false;
        }
      },
      changeSheetTitleById: (sheet_id, new_title) => {
        try {
          if (!sheet_id && new_title) return false;
          const sheet = data.sheetsById[sheet_id];
          sheet.updateProperties({ title: new_title });
          return true;
        } catch (e) {
          return false;
        }
      },
      changeSheetTitleByIndex: (sheet_index, new_title) => {
        try {
          if (!sheet_index && new_title) return false;
          const sheet = data.sheetsByIndex[sheet_index];
          sheet.updateProperties({ title: new_title });
          return true;
        } catch (e) {
          return false;
        }
      },
      deleteSheetById: async (sheet_id = null) => {
        try {
          await data.deleteSheet(sheet_id);
          return true;
        } catch (e) {
          return false;
        }
      },
      deleteSheetByIndex: async (sheet_index = null) => {
        try {
          const sheet = allSheets.find(x => x.index === sheet_index);
          await data.deleteSheet(sheet.sheetId);
          return true;
        } catch (e) {
          return false;
        }
      },
      deleteSheetByTitle: async (sheet_title = null) => {
        try {
          const sheet = allSheets.find(x => x.title === sheet_title);
          await data.deleteSheet(sheet.sheetId);
          return true;
        } catch (e) {
          return false;
        }
      },
      deleteSheetByTitle: async (sheet_title = null) => {
        try {
          const sheet = allSheets.find(x => x.title === sheet_title);
          await data.deleteSheet(sheet.sheetId);
          return true;
        } catch (e) {
          return false;
        }
      },
      deleteLatestRows: async (sheet_title, numRows = 1) => {
        const sheet = data.sheetsByTitle[sheet_title];
        const rows = await sheet.getRows();
        const deletedRows = rows.splice(-numRows);
        await Promise.all(deletedRows.map(row => row.delete()));
        return deletedRows.length > 0;
      },
      deleteRowsByCriteria: async (sheet_title, { key, value }) => {
        const doc = data.sheetsByTitle[sheet_title];
        const rows = await doc.getRows();
        const sheet = allSheets.find(x => x.title.toLowerCase() == sheet_title.toLowerCase())?.contents;
        const parse = sheet.find(x => x[key] == value);
        const del = rows[parse.index].delete();
        return !!del;
      },
      updateRowsByCriteria: async (sheet_title, { key, value }, { update_key, update_value }) => {
        const doc = data.sheetsByTitle[sheet_title];
        const pay = await doc.getRows();
        const sheet = allSheets.find(x => x.title.toLowerCase() == sheet_title.toLowerCase())?.contents;
        const rows = sheet.find(x => x[key.toLowerCase()] == value.toLowerCase())
        const update = pay[rows.index].set(update_key, update_value);
        await pay[rows.index].save();
        return !!update;
      },
    };
  }
};
