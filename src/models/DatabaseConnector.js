'use strict';
import SQLite from 'react-native-sqlite-storage';
// import { add } from "react-native-reanimated";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'OFLN.db';
const database_version = '1.0';
const database_displayname = 'OFLN 2.0';
const database_size = 200000;

let connection;

class DatabaseConnector {

  constructor() {}

  getConnection = async () => {
    if (connection === undefined) {
      await SQLite.echoTest()
        .then(async () => {
          connection = await SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
          );
        })
        .catch(error => {
          console.log('echoTest failed - plugin not functional');
        });
    }
    return connection;
  };

  closeDatabase = async () => {
    if (connection) {
      console.log("Closing DB");
      connection.close()
        .then(status => {
          console.log("Database CLOSED");
        })
        .catch(error => {
          this.errorCB(error);
        });
    } else {
      console.log("Database was not OPENED");
    }
  };

  deleteDatabase = async params => {
    try {
      const result = await SQLite.deleteDatabase({
        name: database_name,
        location: 'default',
      });
      // here comes onSuccess callback
      console.log("success");
    } catch (e) {
      // here comes onError callback
      console.log("error");
      console.log(e);
    }
  };

}

module.exports = new DatabaseConnector();
