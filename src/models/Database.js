import DatabaseConnector from './DatabaseConnector';

export default class Database{
  constructor(obj) {
    this.createStatement = obj.createStatement;
    this.tableName = obj.tableName;
  }

  initTable() {
    let db;
    return new Promise(resolve => {
      DatabaseConnector.getConnection()
        .then(DB => {
          db = DB;
          //console.log('Database OPEN', db);

          db.executeSql('SELECT 1 FROM ' + this.tableName + ' LIMIT 1')
            .then(() => {
              console.log('Database is ready ... executing query ...');
            })
            .then(result => {
              resolve(db);
            })
            .catch(error => {
              //console.log('Received error: ', error);
              //console.log('Database not yet ready ... populating data');
              db.transaction(tx => {
                tx.executeSql(this.createStatement);
              })
                .then(() => {
                  console.log('Table created successfully');
                  resolve(db);
                })
                .catch(error => {
                  console.log('SQLite console log initTable :', error);
                });
            });
        })
        .catch(error => {
          console.log('SQLite console log initTable :', error);
        });
    });
  }

  insertFlexible(params){
    return new Promise(resolve => {
      this.initTable()
        .then(db => {
          db.transaction(tx => {
            let questionMarks = '';
            let values = [];
            let data = params.data;
            let fields = '';

            console.log('data single insert', data);

            for (var fld in data) {
              if (data.hasOwnProperty(fld)) {
                fields += fld + ',';
                questionMarks += '?,';
                values.push(data[fld]);
              }
            }

            fields = fields.substring(0, fields.length - 1);
            questionMarks = questionMarks.substring(
              0,
              questionMarks.length - 1,
            );

            console.log(
              'INSERT INTO ' +
                this.tableName +
                ' (' +
                fields +
                ') VALUES (' +
                questionMarks +
                ');',
            );

            tx.executeSql(
              'INSERT INTO ' +
                this.tableName +
                ' (' +
                fields +
                ') VALUES (' +
                questionMarks +
                ');',
              values,
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              //this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
}
