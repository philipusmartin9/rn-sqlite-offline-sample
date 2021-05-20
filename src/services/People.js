import People from "../models/People";

export default class PeopleService{

  constructor(){
    this.people = new People();
  }

  fetchFromAPI(){
    return fetch('https://run.mocky.io/v3/77368ee4-4b5a-4809-9ccb-3d1b718a375e')
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .then(async result  => {
      console.log('result API:', result);
      // Cara sync #2: UPDATE IF EXISTS, INSERT IF NEW
      for(let i = 0; i < result.length; i++){
        this.upsertToSqlite(result[i]);
      }

      // Cara sync #1: HAPUS, LALU INSERT ULANG
      // await this.people.deleteAll().then(responseDelete => {
      //   for(let i = 0; i < result.length; i++){
      //     this.insertToSqlite(result[i]);
      //   }
      // });
    })
    .catch( error => {
      console.error('error from fetchFromAPI: ', error);
      return error;
    });
  };

  upsertToSqlite(data){
    return this.people.upsert(data).then(result => {
      console.log('result upsertToSqlite: ', result);
    }).catch(error => {
      console.error('error from upsertToSqlite:', error);
    });
  }

  updateToSqlite(data){
    return this.people.updateByIsSubmitting(data).then(result => {
      console.log('result updateToSqlite: ', result);
    }).catch(error => {
      console.error('error from updateToSqlite:', error);
    });
  }

  insertToSqlite(data){
    return this.people.insert(data).then(result => {
      console.log('result insertToSqlite: ', result);
    }).catch(error => {
      console.error('error from insertToSqlite:', error);
    });
  }

  fetchFromSqlite(){
    return this.people.fetch().then(result => {
      //result.error = false;
      console.log('result fetch from fetchFromSqlite: ', result);
      return {
        error: false,
        datas: result
      };
    }).catch(error => {
      console.error('error from fetchFromSqlite:', error);

      return {
        error: true,
        message: error
      };
    });
  }

  fetch(connected){
    if(connected){
      this.fetchFromAPI();
    }

    return this.fetchFromSqlite();
  }

}
