import People from "../models/People";

export default class PeopleService{

  constructor(){
    this.people = new People();
  }

  fetchFromAPI(){
    return fetch('https://run.mocky.io/v3/9789f8e7-142d-41c4-8e50-78618053c510')
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .then( result  => {
      console.log('result API:', result);
      return result;
    })
    .catch( error => {
      console.error(error);
      return error;
    });
  };

  insertToSqlite(data){
    return this.people.insert(data)
    .then(result => {
      console.log('result:', result);
    })
    .catch(error => {
      console.error('error:', error);
    });
  }

  fetchFromSqlite(){

  }

}
