import Database from './Database';

export default class People extends Database {
  constructor() {
    super({
      tableName: 'People',
      createStatement: 'CREATE TABLE IF NOT EXISTS People ('+
        '"_id" TEXT PRIMARY KEY AUTOINCREMENT,'+
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

}
