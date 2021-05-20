import Database from './Database';

export default class People extends Database {
  constructor() {
    super({
      tableName: 'People',
      createStatement: 'CREATE TABLE IF NOT EXISTS People ('+
        '"id" INTEGER PRIMARY KEY AUTOINCREMENT,'+
        '"_id" TEXT,'+
        '"name" TEXT,'+
        '"gender" TEXT,'+
        '"company" TEXT,'+
        '"email" TEXT,'+
        '"phone" TEXT,'+
        '"age" INTEGER,'+
        '"isSubmitting" INTEGER'+
      ')'
    });
  }

  insert(data){
    return new Promise(resolve => {
      this.initTable().then(db => {
        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO People (_id, name, gender, company, email, phone, age, isSubmitting) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [data._id, data.name, data.gender, data.company, data.email, data.phone, data.age, data.isSubmitting]
          ).then(([tx, results]) => {
            console.log('result insert People in model:', results);
          })
          .catch(error => {
            console.log("error insert People in model: ", error);
          });
        });
      })
    });
  }

  update(data){
    return new Promise(resolve => {
      this.initTable().then(db => {
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE People SET name = ?, gender = ?, company = ?, email = ?, phone = ?, age = ?, isSubmitting =? WHERE _id = ?',
            [data.name, data.gender, data.company, data.email, data.phone, data.age, data.isSubmitting, data._id]
          ).then(([tx, results]) => {
            console.log('result update People in model:', results);
          })
          .catch(error => {
            console.log("error update People in model: ", error);
          });
        });
      })
    });
  }

  updateByIsSubmitting(data){
    return new Promise(resolve => {
      this.initTable().then(db => {
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE People SET name = ? WHERE isSubmitting = ?',
            [data.name, data.isSubmitting]
          ).then(([tx, results]) => {
            console.log('result update by isSubmitting in model:', results);
          })
          .catch(error => {
            console.log("error update by isSubmitting in model: ", error);
          });
        });
      })
    });
  }

  upsert(data){
    return new Promise(resolve => {
      this.initTable().then(db => {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM People WHERE _id = ?',
            [data._id]
          ).then(([tx, results]) => {
            if(results.rows.length > 0){
              resolve(this.update(data));
            }else{
              resolve(this.insert(data));
            }
          })
          .catch(error => {
            console.log("error upsert People in model: ", error);
          });
        });
      })
    });
  }

  fetch(){
    return new Promise(resolve => {
      this.initTable().then(db => {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM People',
            []
          ).then(([tx, results]) => {
            let tempArray = [];
            for(let i = 0; i < results.rows.length; i++){
              let row = results.rows.item(i);
              tempArray.push(row);
            }
            console.log('result fetch People in model:', tempArray);
            resolve(tempArray);
          })
          .catch(error => {
            console.log("error fetch People in model: ", error);
          });
        });
      })
    });
  }

  deleteAll(){
    return new Promise(resolve => {
      this.initTable().then(db => {
        db.transaction(tx => {
          tx.executeSql(
            'DELETE FROM People WHERE isSubmitting = ?',
            [false]
          ).then(([tx, results]) => {
            console.log('delete all records from People in model:', results);
            resolve(results);
          })
          .catch(error => {
            console.log('delete all records from People  in model: ', error);
          });
        });
      })
    });
  }

}
