# @zaadevofc/spreadsheet-db
> Using [Google Sheets API](https://developers.google.com/sheets/api/guides/concepts) as a fast and efficient SQL Database alternative, just kidding :/
full thanks for library support by ❤️ [google-spreadsheet](https://www.npmjs.com/package/google-spreadsheet) ❤️

[![NPM version](https://img.shields.io/npm/v/@zaadevofc/spreadsheet-db)](https://www.npmjs.com/package/@zaadevofc/spreadsheet-db)
[![Known Vulnerabilities](https://snyk.io/test/github/zaadevofc/spreadsheet-db/badge.svg?targetFile=package.json)](https://snyk.io/test/github/zaadevofc/spreadsheet-db?targetFile=package.json)
[![NPM](https://img.shields.io/npm/dw/@zaadevofc/spreadsheet-db)](https://www.npmtrends.com/@zaadevofc/spreadsheet-db)

- **CRUD** - to eazy and very simple like a database
- **JSON FORMAT** - the results will be in JSON format which is very easy for management
- **EXPORT** - download sheet/docs in various formats `xlsx,ods,tsv,csv,pdf,zip`

**Docs -**
Meanwhile, currently the documentation is only in the readme file for this library [https://github.com/zaadevofc/spreadsheet-db#readme](https://github.com/zaadevofc/spreadsheet-db#readme)

-------------

> 🔥 **Installation** - `npm i @zaadevofc/spreadsheet-db --save` or `yarn add @zaadevofc/spreadsheet-db`

## ~ Authentication 🔓
> first of all, we need the `private_key` and `client_email` from your Service account, follow the steps below:

### @ Create Project 
1. visit google console to create new project [here](https://console.cloud.google.com/projectcreate)
2. follow the commands requested, then when finished proceed to the next step

### @ Create Credentials
1. visit [Service accounts page](https://console.cloud.google.com/apis/credentials)
2. click blue **+ CREATE CREDENTIALS** and select **Service account** option
3. enter name, description, click **CREATE**
4. you can skip permissions, click **CONTINUE**
5. click your project select tab **keys** and click **ADD KEY** anda then click **Create new key** button
6. select the **JSON** key type option
7. click **Create** button
8. your JSON key file is generated and downloaded to your machine (it is the only copy!)
9. click **DONE**

> and you must enable sheets APi :

1. click [here](https://console.cloud.google.com/apis/library/sheets.googleapis.com) to enable the sheets APi
2. **enable** the api

![image tutorial](https://raw.githubusercontent.com/zaadevofc/zaadevofc/main/zaadevofc-spreadsheet-db-tutor-7.png)

## ~ Congrats 🎉

your credentials more or less will look like this :

```json
{
    "type": "",
    "project_id": "",
    "private_key_id": "",
    "private_key": "",
    "client_email": "",
    "client_id": "",
    "auth_uri": "",
    "token_uri": "",
    "auth_provider_x509_cert_url": "",
    "client_x509_cert_url": "",
    "universe_domain": ""
}
```

this library only requires `private_key` and `client_email` properties. so you can save the file safely, and put the required properties into the `.env` file

### ~ Preparing 🔨

> **Note** - you have to create a _spreadsheet_ first on the [Google Sheets page](https://docs.google.com/spreadsheets) and you have to update its privacy to **public** and **be allowed to edit it**

![image tutorial](https://raw.githubusercontent.com/zaadevofc/zaadevofc/main/zaadevofc-spreadsheet-db-tutor-1.png)


later we will register your **spreadsheets ID**, below is where the ID is located :

![image tutorial](https://raw.githubusercontent.com/zaadevofc/zaadevofc/main/zaadevofc-spreadsheet-db-tutor-2.png)


## ~ Configuration ⚙️

```js
const SpreadDB = require('@zaadevofc/spreadsheet-db')
const spreadDB = new SpreadDB({ 
    client_email: process.env.SERVICE_CLIENT_EMAIL, 
    private_key: process.env.GOOGLE_PRIVATE_KEY 
});
```

> **Note** - To keep the examples concise, I'm calling await at the top level which is not allowed by default in most versions of node. If you need to call await in a script at the root level, you must instead wrap it in an async function like so:

```js
(async () => {
    // async function here
})()
```

## ~ How to use 🌈

#### 🛠️ register your spreadsheets id :

```js
const db = await spreadDB.register(/* your spreadsheets id */)

// if you want to use multiple id
const db1 = await spreadDB.register(/* your spreadsheets id */)
const db2 = await spreadDB.register(/* your spreadsheets id */)
```

#### 🛠️ create new sheet :

> **Note** - the sheet display is something like this :

![image tutorial](https://raw.githubusercontent.com/zaadevofc/zaadevofc/main/zaadevofc-spreadsheet-db-tutor-3.png)


```js
await db.addSheet(/* name your new sheet */)
// example
await db.addSheet('users')
```

the changes will look like this:

![image tutorial](https://raw.githubusercontent.com/zaadevofc/zaadevofc/main/zaadevofc-spreadsheet-db-tutor-5.png)

#### 🛠️ adding value to sheet
> **Note** - i recommend that you create a header first before giving it a value with this program, you can see the example below:

> _**you must place the header starting from column A1 and add at least 1 value so that the program follows the previous style**_

#### ✅ correct header

![image tutorial](https://raw.githubusercontent.com/zaadevofc/zaadevofc/main/zaadevofc-spreadsheet-db-tutor-12.png)

#### ❌ wrong header

![image tutorial](https://raw.githubusercontent.com/zaadevofc/zaadevofc/main/zaadevofc-spreadsheet-db-tutor-13.png)

#### example table :

![image tutorial](https://raw.githubusercontent.com/zaadevofc/zaadevofc/main/zaadevofc-spreadsheet-db-tutor-9.png)

code :

```js
// add multiple value
await db.addValue('users', [
    [12345, 'alex', 12],
    [12346, 'dodo', 18],
    [12347, 'adit', 22],
]);
```

result :

![image tutorial](https://raw.githubusercontent.com/zaadevofc/zaadevofc/main/zaadevofc-spreadsheet-db-tutor-10.png)

the contents of the array depend on how many rows there are in your header

| ID | NAME | AGE | HOBBY | WORK |
|:----:|:------:|:-----:|:-------:|:------:|
|  array[0]  |   array[1]   |  array[2]   |   array[3]    |   array[4]

#### code :

```js
await db.addValue('users', [
    [/* value array [0] */, /* value array [1] */, /* value array [2] */, /* value array [3] */, /* value array [4] */],
]);
```

#### 🛠️ delete latest rows from sheet

example table :

| ID |  NAME  | AGE |
|:--:|:------:|:---:|
|  1 |  jamal |  23 |
|  2 | rosyid |  20 |
|  3 |   ditha  |  21 |
|  4 |  keja  |  25 |

with this function :

```js
await db.deleteLatestRows(/* your sheet title/name */);
//example
await db.deleteLatestRows('users');
```

later it will be like this :

| ID |  NAME  | AGE |
|:--:|:------:|:---:|
|  1 |  jamal |  23 |
|  2 | rosyid |  20 |
|  3 |   ditha  |  21 |

#### 🛠️ delete rows by criteria

example table :

| ID |  NAME  | AGE |
|:--:|:------:|:---:|
|  1 |  jamal |  23 |
|  2 | rosyid |  20 |
|  3 |   ditha  |  21 |
|  4 |  keja  |  25 |

```js
await db.deleteRowsByCriteria(/* your sheet title/name */, { 
    key: /* this key alias the header */, 
    value: /* value of key */ 
});
// example
await db.deleteRowsByCriteria('users', { 
    key: 'AGE', 
    value: 20 
});
```

result :

| ID |  NAME  | AGE |
|:--:|:------:|:---:|
|  1 |  jamal |  23 |
|  3 |   ditha  |  21 |
|  4 |  keja  |  25 |

#### 🛠️ delete sheet :

this function will delete a sheet based on existing properties:

```js
await db.deleteSheetById(/* your sheet id */);
await db.deleteSheetByIndex(/* your sheet index */);
await db.deleteSheetByTitle(/* your sheet name/title */);
```

#### 🛠️ update rows by criteria

example table :

| ID |  NAME  | AGE |
|:--:|:------:|:---:|
|  1 |  jamal |  23 |
|  2 | rosyid |  20 |
|  3 |   ditha  |  21 |
|  4 |  keja  |  25 |

```js
await db.updateRowsByCriteria('users', 
{ 
    key: 'NAME', 
    value: 'ditha' 
},{ 
    update_key: 'AGE', 
    update_value: 32
})
```

result :

| ID |  NAME  | AGE |
|:--:|:------:|:---:|
|  1 |  jamal |  23 |
|  2 | rosyid |  20 |
|  3 |   ditha  |  32 |
|  4 |  keja  |  25 |


#### 🛠️ update sheet or doc properties

this is doc title/name :

![image tutorial](https://raw.githubusercontent.com/zaadevofc/zaadevofc/main/zaadevofc-spreadsheet-db-tutor-11.png)

this is sheet title/name :

![image tutorial](https://raw.githubusercontent.com/zaadevofc/zaadevofc/main/zaadevofc-spreadsheet-db-tutor-3.png)

you can use the code below :

```js
db.changeDocTitle(/* new doc title/name */);
db.changeSheetTitleByTitle(/* sheet title/name */, /* new sheet title/name */);
db.changeSheetTitleById(/* sheet id */, /* new sheet title/name */);
db.changeSheetTitleByIndex(/* sheet index */, /* new sheet title/name */);
```

#### 🛠️ get all data

fetching all data from your doc :

```js
db.getData()
```

//=> result :

```js
{
  title: '',
  locale: '',
  autoRecalc: '',
  timeZone: '',
  sheetCount: 0,
  spreadsheetId: '',
  spreadsheetUrl: '',
  googleDriveUrl: '',
  rawSheets: [],
}
```

//=> rawSheets :
```js
{
    sheetId: 0,
    title: '',
    index: 0,
    sheetType: '',
    spreadsheetUrl: '',
    rowCount: 0,
    columnCount: 0,
    headerRowIndex: 0,
    contentCounts: 0,
    contents: [],
}
```

//=> contents :
> the `contents` of the content property depend on the contents of your sheet, I give an example using a table like this:

| ID |  NAME  | AGE |
|:--:|:------:|:---:|
|  1 |  jamal |  23 |
|  2 | rosyid |  20 |
|  3 |   ditha  |  32 |
|  4 |  keja  |  25 |

result of property `contents` :

```js
{
    { index: 0, id: '1', name: 'jamal', age: '23' },
    { index: 1, id: '2', name: 'rosyid', age: '20' },
    { index: 2, id: '3', name: 'ditha', age: '32' },
    { index: 3, id: '4', name: 'kejaa', age: '25' }
}
```

#### 🛠️ get data sheet

this will return a **data sheet** based on existing properties:

```js
db.getAllSheets();
db.getSheetByIndex(/* your sheet index */);
db.getSheetById(/* your sheet id */);
db.getSheetByTitle(/* your sheet title */);
```

#### 🛠️ get data contents

this will return a **sheet contents** based on existing properties:

```js
db.getAllContents();
db.getContentByIndex(/* your sheet index */);
db.getContentById(/* your sheet id */);
db.getContentByTitle(/* your sheet title */);
```

## Support & Contributions

This module was written and is actively maintained by [zaadevofc](https://github.com/zaadevofc). If you want to develop this module, you can do that because this module is free and open source

> **Want to help support it? Buy me inspiration**
[Saweria](https://saweria.co/zaadevofc)

## License
This is free and unencumbered public domain software. For more info, see https://unlicense.org.