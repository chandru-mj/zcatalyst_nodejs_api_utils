/**
 * catalystDBFunctions.js
 * @description :: exports all CRUD methods for Zoho Catalyst.
 */

const { values } = require("lodash");

/**
 * @description : Executes a ZCQL query using the provided app object and returns a Promise that resolves with the query response.
 * @param {zcatalyst-sdk-node} app: The catalyst app object used to execute the ZCQL query.
 * @param {string} query: The ZCQL query to be executed.
 * @return {Promise<Object>} : Returns the response promise object
 */
function ZCQL(app, query) {
  const zcql = app.zcql();
  const zcqlPromise = zcql.executeZCQLQuery(query);
  return new Promise((resolve, reject) => {
    zcqlPromise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @description : Retrieves the count of records from a specified table based on the given criteria.
 * @param {zcatalyst-sdk-node} app : The catalyst application object.
 * @param {string} tableName : The name of the table to retrieve the count from.
 * @param {string} [criteria] : The optional criteria to filter the records - sql WHERE clause.
 * @return {Promise<Object>} : Returns the response promise object.
 */
function getCount(app, tableName, criteria) {
  const zcql = app.zcql();
  criteria = criteria ? ` WHERE ${criteria}` : "";
  const zcqlPromise = zcql.executeZCQLQuery(
    `SELECT COUNT(ROWID) FROM ${tableName}${criteria}`
  );
  return new Promise((resolve, reject) => {
    zcqlPromise
      .then((response) => {
        const recCount = parseInt(response[0][tableName].ROWID);
        resolve({ totalRecords: recCount });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @description : Deletes a row from a specified table in the datastore.
 * @param {zcatalyst-sdk-node} app : the catalyst application object
 * @param {string} tableName : the name of the table
 * @param {string} ROWID : the ID of the row to delete
 * @return {Promise<Object>} : Returns the response promise object
 */
function deleteRow(app, tableName, ROWID) {
  const datastore = app.datastore();
  const table = datastore.table(tableName);
  const rowPromise = table.deleteRow(ROWID);
  return new Promise((resolve, reject) => {
    rowPromise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @description : Deletes rows from a table in the specified app's datastore.
 * @param {zcatalyst-sdk-node} app : The catalyst application object.
 * @param {string} tableName : The name of the table.
 * @param {Array} ROWIDs : An array of ROWIDs to delete.
 * @return {Promise<Object>} : Returns the response promise object.
 */
function deleteRows(app, tableName, ROWIDs) {
  const datastore = app.datastore();
  const table = datastore.table(tableName);
  const rowPromise = table.deleteRows(ROWIDs);
  return new Promise((resolve, reject) => {
    rowPromise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @description : Inserts a row into the specified table in the given app's datastore.
 * @param {zcatalyst-sdk-node} app : The catalyst application object.
 * @param {string} tableName : The name of the table to insert the row into.
 * @param {Object} insertData : The data to insert into the row.
 * @return {Promise<Object>} : Returns the response promise object
 */
function insertRow(app, tableName, insertData) {
  const datastore = app.datastore();
  const table = datastore.table(tableName);
  const insertPromise = table.insertRow(insertData);
  return new Promise((resolve, reject) => {
    insertPromise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
/**
 * @description : Inserts rows into a specified table in the given app's datastore.
 * @param {zcatalyst-sdk-node} app : The catalyst application object.
 * @param {string} tableName : The name of the table to insert rows into.
 * @param {Array} insertData : An array of objects representing the rows to be inserted.
 * @return {Promise} : Returns the response promise object
 */
function insertRows(app, tableName, insertData) {
  const datastore = app.datastore();
  const table = datastore.table(tableName);
  const insertPromise = table.insertRows(insertData);
  return new Promise((resolve, reject) => {
    insertPromise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
/**
 * @description : Retrieves a specific row from the given table using the app's datastore.
 * @param {zcatalyst-sdk-node} app : the app object
 * @param {string} table : the name of the table
 * @param {string} ROWID : the ID of the row to retrieve
 * @return {Promise} : Returns the response promise object
 */
function getRow(app, tableName, ROWID) {
  const datastore = app.datastore();
  const table = datastore.table(tableName);
  const rowPromise = table.getRow(ROWID);
  return new Promise((resolve, reject) => {
    rowPromise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @description : Retrieves a paged set of rows from a given table based on the provided criteria.
 * @param {zcatalyst-sdk-node} app : The catalyst application object.
 * @param {string} tableName : The name of the table to retrieve rows from.
 * @param {number} pageNumber : The page number to retrieve. Defaults to 1.
 * @param {number} recordPerPage : The number of records to retrieve per page. Defaults to 200.
 * @param {string} criteria : The criteria to filter the rows. Optional.
 * @return {Promise<Object>} : Returns the response promise object.
 */
async function getZcqlPagedRows(
  app,
  tableName,
  pageNumber,
  recordPerPage,
  criteria
) {
  var page = pageNumber || 1;
  var maxRec = recordPerPage || 200;
  maxRec = maxRec > 200 ? 200 : maxRec;
  var totalPage,
    recCount = 0;
  var dataSet = [];
  var hasMorecords = false;
  let criteriaValue = criteria ? ` WHERE ${criteria}` : "";
  const zcql = app.zcql();

  return new Promise(async (resolve, reject) => {
    try {
      recCount = await zcql
        .executeZCQLQuery(
          `SELECT COUNT(ROWID) FROM ${tableName}${criteriaValue}`
        )
        .then((response) => {
          return parseInt(response[0][tableName].ROWID);
        })
        .catch((err) => {
          throw new Error(err);
        });
      console.log(`recCount: ${JSON.stringify(recCount)}`);
      hasMorecords = recCount > maxRec ? true : false;
      totalPage = Math.ceil(recCount / maxRec);
      const offset = (page - 1) * maxRec + 1;
      await zcql
        .executeZCQLQuery(
          `SELECT * FROM ${tableName}${criteriaValue} LIMIT ${maxRec} OFFSET ${
            offset > 0 ? offset : 1
          }`
        )
        .then((response) => {
          response.forEach((element) => {
            dataSet.push(values(element)[0]);
          });
        })
        .catch((err) => {
          console.log("Error on fetching list data");
          throw new Error(err);
        });
      resolve({
        records: dataSet,
        currentPage: page,
        totalPage: totalPage || 0,
        totalRecords: dataSet.length,
        recordsPerPage: maxRec,
        moreRecords: hasMorecords,
      });
    } catch (error) {
      console.log(`error occured`);
      reject(error);
    }
  });
}

/**
 * @description : Updates a row in the specified table using the provided update data.
 * @param {zcatalyst-sdk-node} app : The catalyst application object
 * @param {string} tableName : the name of the table to update
 * @param {object} updateData : the data to update the row with
 * @return {Promise<Object>} : Returns the response promise object
 */
function updateRow(app, tableName, updateData) {
  const datastore = app.datastore();
  const table = datastore.table(tableName);
  const rowPromise = table.updateRow(updateData);
  return new Promise((resolve, reject) => {
    rowPromise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @description : Downloads a file from the specified folder using the provided app.
 * @param {zcatalyst-sdk-node} app : The catalyst application object
 * @param {string} folderId : The ID of the folder containing the file.
 * @param {string} file_id : The ID of the file to download.
 * @return {Promise<Object>} : Returns the response promise object
 */
function downloadFile(app, folderId, file_id) {
  const filestore = app.filestore();
  const folder = filestore.folder(folderId);
  const downloadPromise = folder.downloadFile(file_id);
  return new Promise((resolve, reject) => {
    downloadPromise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @description : Uploads a file to the specified folder using the provided app and configuration.
 * @param {zcatalyst-sdk-node} app : The catalyst application object
 * @param {string} folderId - the ID of the folder to upload the file to
 * @param {Object} config - the configuration for uploading the file
 * @return {Promise<Object>} a Promise that resolves with the response after the file is uploaded, or rejects with an error
 */
function uploadFile(app, folderId, config) {
  const filestore = app.filestore();
  const folder = filestore.folder(folderId);
  const uploadPromise = folder.uploadFile(config);
  return new Promise((resolve, reject) => {
    uploadPromise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @description : Retrieves file details from the specified folder in the app's filestore.
 * @param {Object} app : The catalyst application object
 * @param {string} folderId : The ID of the folder
 * @param {string} fileId : The ID of the file
 * @return {Promise<Object>} : Returns the response promise object
 */
function getFileDetails(app, folderId, fileId) {
  const filestore = app.filestore();
  const folder = filestore.folder(folderId);
  const getDetailsPromise = folder.getFileDetails(fileId);
  return new Promise((resolve, reject) => {
    getDetailsPromise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @description : Deletes a file from a specified folder in Google Cloud Storage.
 * @param {zcatalyst-sdk-node} app : The catalyst application object.
 * @param {string} folderId : The ID of the folder where the file is located.
 * @param {string} fileId : The ID of the file to be deleted.
 * @return {Promise<Object>} : Returns the response promise object.
 */
function deleteFile(app, folderId, fileId) {
  const filestore = app.filestore();
  const folder = filestore.folder(folderId);
  const deletePromise = folder.deleteFile(fileId);
  return new Promise((resolve, reject) => {
    deletePromise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @description : Register a new end user using the provided information.
 * @param {zcatalyst-sdk-node} app : The catalyst application object.
 * @param {string} fName : The first name of the user.
 * @param {string} lName : The last name of the user.
 * @param {string} emailId : The email ID of the user.
 * @return {Promise<Object>} : Returns the response promise object.
 */
function registerNewEndUser(app, fName, lName, emailId, roleId) {
  const userManagement = app.userManagement();
  const signupConfig = {
    platform_type: "web",
  };
  var userConfig = {
    first_name: fName,
    last_name: lName,
    email_id: emailId,
    role_id: roleId || process.env.DEFAULT_PORTAL_ROLE_ID,
  };
  let registerPromise = userManagement.registerUser(signupConfig, userConfig);
  return new Promise((resolve, reject) => {
    registerPromise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @description : Enables an end user by updating their status to enabled.
 * @param {zcatalyst-sdk-node} app : The catalyst application object.
 * @param {string} userId : The ID of the user to enable.
 * @return {Promise<Object>} : Returns the response promise object
 */
function enableEndUser(app, userId) {
  const userManagement = app.userManagement();
  let enablePromise = userManagement.updateUserStatus(userId, "enable");
  return new Promise((resolve, reject) => {
    enablePromise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @description : Disables an end user in the application.
 * @param {zcatalyst-sdk-node} app : The catalyst application object.
 * @param {string} userId : The ID of the user to disable.
 * @return {Promise<Object>} : Returns the response promise object
 */
function disableEndUser(app, userId) {
  const userManagement = app.userManagement();
  let disablePromise = userManagement.updateUserStatus(userId, "disable");
  return new Promise((resolve, reject) => {
    disablePromise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @description : Deletes an end user using the provided app and userId.
 * @param {zcatalyst-sdk-node} app : The catalyst application object.
 * @param {string} userId : The ID of the user to be deleted.
 * @return {Promise<Object>} : Returns the response promise object
 */
function deleteEndUser(app, userId) {
  const userManagement = app.userManagement();
  let deletePromise = userManagement.deleteUser(userId);
  return new Promise((resolve, reject) => {
    deletePromise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @description : Retrived the details of a user on whose scope the function is getting executed
 * @param {Object} app - The application object.
 * @return {Promise<Object>} A promise that resolves to the current end user details.
 */
function getCurrentEndUserDetails(app) {
  const userManagement = app.userManagement();
  let getDetailsPromise = userManagement.getCurrentUser();
  return new Promise((resolve, reject) => {
    getDetailsPromise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  ZCQL,
  getCount,
  deleteRow,
  getZcqlPagedRows,
  deleteFile,
  deleteRows,
  updateRow,
  insertRow,
  insertRows,
  getRow,
  downloadFile,
  uploadFile,
  getFileDetails,
  registerNewEndUser,
  enableEndUser,
  disableEndUser,
  deleteEndUser,
  getCurrentEndUserDetails,
};
