// IMPORT DARI MODEL YANG SUDAH DI-DEFINE UNTUK DIGUNAKAN DI DALAM SERVICE
import People from "../models/People";

export default class PeopleService{

  constructor(){
    // IMPORT DARI MODEL YANG SUDAH DI-DEFINE UNTUK DIGUNAKAN DI DALAM SERVICE
    this.people = new People();
  }

  fetchFromAPI(){
    // GET DATA DARI API, LALU SIMPAN KE DALAM DATABASE LOCAL
    return fetch('https://run.mocky.io/v3/77368ee4-4b5a-4809-9ccb-3d1b718a375e')
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .then(async result  => {
      console.log('result API:', result);

      // Cara sync #1: HAPUS, LALU INSERT ULANG -- GUNAKAN JIKA ANDA MENGUTAMAKAN SUMBER DATA PALING VALID ADALAH DARI API, SERTA
      // PRO: LEBIH CEPAT

      // await this.people.deleteAll().then(responseDelete => {
      //   for(let i = 0; i < result.length; i++){
      //     this.insertToSqlite(result[i]);
      //   }
      // });

      // Cara sync #2: UPDATE IF EXISTS, INSERT IF NEW -- GUNAKAN JIKA ANDA MENGUTAMAKAN SUMBER DATA PALING VALID ADALAH DARI API
      // PRO: LEBIH AMAN SECARA SINKRONISASI DATA

      for(let i = 0; i < result.length; i++){
        this.upsertToSqlite(result[i]);
      }
    })
    .catch( error => {
      console.error('error from fetchFromAPI: ', error);
      return error;
    });
  };

  upsertToSqlite(data){
    // digunakan untuk handling data baru dari API. jika record sudah exists, maka aplikasi akan mengupdate, jika belum, maka akan insert baru
    return this.people.upsert(data).then(result => {
      console.log('result upsertToSqlite: ', result);
    }).catch(error => {
      console.error('error from upsertToSqlite:', error);
    });
  }

  updateToSqlite(data){
    // digunakan untuk mengupdate semua nama orang dengan isSubmitting = false menjadi "Need Update from API", untuk keperluan test upsert
    return this.people.updateByIsSubmitting(data).then(result => {
      console.log('result updateToSqlite: ', result);
    }).catch(error => {
      console.error('error from updateToSqlite:', error);
    });
  }

  insertToSqlite(data){
    // menambah data ke sqlite
    return this.people.insert(data).then(result => {
      console.log('result insertToSqlite: ', result);
    }).catch(error => {
      console.error('error from insertToSqlite:', error);
    });
  }

  fetchFromSqlite(){
    // mengambil data orang dari sqlite
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
    // jika koneksi lancar, boleh ambil data ke API
    if(connected){
      this.fetchFromAPI();
    }

    // namun apapun kondisi koneksi, kita akan tetap menampilkan data yang berasal dari database sqlite
    return this.fetchFromSqlite();
  }

}
