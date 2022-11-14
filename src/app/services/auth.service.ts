import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
  @Injectable({
    providedIn: 'root'
  })

  export class AuthService {
    private url : string  =  'https://identitytoolkit.googleapis.com/v1'
    private apiKey = 'AIzaSyBzP-UMy0pW-Bb1qNKFy5i_W0tqkJoKni0';

    userToken : string;
  //Crear un usuario
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
  //Logear un usuario
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor( private http : HttpClient ) {

      this.leerToken();
   }

    //Destroy tokenID
   logOut(  ) {
      localStorage.setItem('token', '');
   }

   //Login
   singIng( usuario ) {
    const authData = {
      ...usuario,
      returnSecureToken : true,
    }

    return this.http.post(
        `${this.url}/accounts:signInWithPassword?key=${this.apiKey}`,
        authData
      ).pipe(
        map( resp => {
          this.saveToken( resp['idToken'] );
        })
      )
   }

   // Registro de Usuario
   register( usuario : UsuarioModel ) {
    const authData = {
      ...usuario,
      returnSecureToken: true
    }

    return this.http.post(
      `${this.url}/accounts:signUp?key=${this.apiKey}`,
       authData).pipe(
        map( resp  => {
          this.saveToken( resp['idToken'] );
        } )
       );
   }

   //Obtener el token para validar la sesión
  leerToken()  {

    if ( localStorage.getItem('token')  ) {
      this.userToken = localStorage.getItem('token');
    }else  {
      this.userToken = '';
    }

    return this.userToken;
  }

  //Guardar Token para LS
  private saveToken( idToken ) {
      this.userToken = idToken;
      localStorage.setItem( 'token', this.userToken );
      const expired = new Date().setSeconds(3600);
      localStorage.setItem('expired', JSON.stringify( expired ));
  }

  //Validate Token
  isAuth():boolean{

      if ( localStorage.getItem('token').length < 2 ) {
          return false;
      }
      const hoy = new Date().getTime();
      const expired = Number( localStorage.getItem('expired') );

      if( expired < hoy ){

          return false;
      }




      if  ( localStorage.getItem('token') ) {
        if ( localStorage.getItem('token').length  > 2 ){
          return true;
        }else {
          return false;
        }
      }
  }
}
