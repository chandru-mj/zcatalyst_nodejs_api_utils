

# Catalyst DB Functions [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

This repository contains a collection of functions for interacting with Zoho Catalyst, a serverless platform. These functions cover common CRUD (Create, Read, Update, Delete) operations and user management tasks using [Zoho Catalyst NodeJs SDK](https://docs.catalyst.zoho.com/en/sdk/nodejs/v2/overview/).

## Features

- **ZCQL Query Execution**: Run ZCQL queries and fetch data from Catalyst datastore.
- **Record Counting**: Get the count of records in a table with optional filtering.
- **Row Insertion**: Insert single or multiple rows into a specified table.
- **Row Deletion**: Delete single or multiple rows from a specified table.
- **Row Retrieval**: Fetch specific rows or paginated data from a table.
- **File Management**: Upload, download, and delete files from Catalyst's file store.
- **User Management**: Register, enable, disable, and delete end users in the Catalyst platform.

## Installation

Download the file **catalystDBFunctions.js and store it in your function to access the methods

Then install the dependencies in your ${function-name} directory:

```bash
npm install lodash
npm install zcatalyst-sdk-node
```

## Usage

You can import and use these functions in your Node.js application:
```javascript
// Initialize Zoho Catalyst Project
cosnt app = catalyst.initialize(req);
```
```javascript
// Import functions util file
const catalystFunctions =  require('./catalystDBFunctions');
```

```javascript
// Example usage: Execute a ZCQL query
catalystFunctions.ZCQL(app, 'SELECT * FROM table_name')
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.error('Error executing query:', err);
  });
```

### Function Descriptions

- **ZCQL(app, query)**: Executes a ZCQL query and returns the result.
- **getCount(app, tableName, criteria)**: Retrieves the count of records in a table with optional criteria.
- **insertRow(app, tableName, insertData)**: Inserts a single row into a specified table.
- **insertRows(app, tableName, insertData)**: Inserts multiple rows into a specified table.
- **getRow(app, tableName, ROWID)**: Retrieves a specific row by its ROWID.
- **getZcqlPagedRows(app, tableName, pageNumber, recordPerPage, criteria)**: Retrieves paginated rows from a table based on the criteria.
- **deleteRow(app, tableName, ROWID)**: Deletes a specific row by its ROWID.
- **deleteRows(app, tableName, ROWIDs)**: Deletes multiple rows by their ROWIDs.
- **downloadFile(app, folderId, file_id)**: Downloads a file from the specified folder.
- **uploadFile(app, folderId, config)**: Uploads a file to the specified folder.
- **getFileDetails(app, folderId, fileId)**: Retrieves details of a file by its ID.
- **deleteFile(app, folderId, fileId)**: Deletes a file by its ID.
- **registerNewEndUser(app, fName, lName, emailId, roleId)**: Registers a new end user.
- **enableEndUser(app, userId)**: Enables an end user by updating their status.
- **disableEndUser(app, userId)**: Disables an end user by updating their status.
- **deleteEndUser(app, userId)**: Deletes an end user by their ID.
- **getCurrentEndUserDetails(app)**: Retrieves details of the current user on whose scope the function is being executed.

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any feature requests, bug fixes, or improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries, please open a discussion thread.
