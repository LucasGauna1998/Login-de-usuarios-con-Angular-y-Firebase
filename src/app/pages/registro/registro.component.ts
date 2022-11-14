import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  error : any =  {};
  usuario : UsuarioModel;
  recordarEmail : boolean = false;

  constructor( private auth : AuthService,
               private router : Router ) {


   }

  ngOnInit() {

    this.usuario = new UsuarioModel;
  }


  onSubmit( form : NgForm ) {

      if( form.invalid) {
          return
      }
      Swal.fire( {
        allowOutsideClick : false,
        icon  : 'info',
        text :  'Espere..'
      })
      if ( this.recordarEmail ) {
        localStorage.setItem('email', this.usuario.email );
      }
      Swal.showLoading();


      this.auth.register( this.usuario )
          .subscribe( resp => {

            Swal.close();
            this.router.navigateByUrl('login');
          }, err =>  {
            Swal.fire({
              allowOutsideClick : true,
              title : 'Ops',
              icon : 'error',
              text : err.error.error.message
            })

          })

  }




}
