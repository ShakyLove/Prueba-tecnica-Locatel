import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AccoutService } from 'src/app/services/accout.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  forms: boolean = true;
  loginForm: FormGroup;

  constructor(private accountService: AccoutService, private router: Router,) { }

  ngOnInit(): void {
    this.activateForm();
  }

  activateForm() {
    this.loginForm = new FormGroup({
      identification: new FormControl(''),
      password:       new FormControl(''),
    });
  }

  login(form){
    this.accountService.login(form).subscribe(res => {
      if(res.account){
        this.router.navigate(['/', 'info']);
      }else{
        Swal.fire({
          icon: res.icon,
          title: res.message,
          showConfirmButton: false,
          timer: 3000
        })
      }
    })
  }

}
