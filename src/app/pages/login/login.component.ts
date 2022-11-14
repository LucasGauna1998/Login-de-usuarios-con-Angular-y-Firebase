import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModel } from '../../models/usuario.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario : UsuarioModel;
  recordarEmail : boolean = false;

  constructor( private auth : AuthService,
               private router :  Router ) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();

    if( localStorage.getItem('email') ) {
      this.usuario.email = localStorage.getItem('email');
      this.recordarEmail = true;
    }
  }

  loginForm( form : NgForm ) {
    if( form.invalid ){
      return;
    }
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'

    })

    Swal.showLoading();

    if ( this.recordarEmail ){
        localStorage.setItem( 'email',  this.usuario.email );
    }


    this.auth.singIng( this.usuario )
        .subscribe( resp => {
          Swal.close();
          this.router.navigateByUrl('home');
        }, ( err ) => {
          Swal.fire({
            title : 'Ops',
            allowOutsideClick: true,
            icon: 'error',
            text:  err.error.error.message

          })

        })
  }
}
