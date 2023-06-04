import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccoutService } from 'src/app/services/accout.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  amountCtrl = new FormControl(null, { updateOn: 'blur' });
  registerForm: FormGroup;

  constructor(private accountService: AccoutService, private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.activateForm();
  }

  activateForm() {
    this.registerForm = this.fb.group({
      firstName:      ['', [Validators.required]],
      lastName:       ['', [Validators.required]],
      identification: ['', [Validators.required]],
      password:       ['', [Validators.required]]
    });
  }

  get error(): any { return this.registerForm.controls; }

  createAccount(form) {
    //Creamos objeto
    let data = {
      valueCount      : this.amountCtrl.value,
      firstName       : form.firstName,
      lastName        : form.lastName,
      identification  : form.identification,
      password        : form.password,
    }

    //Consumimos el servicio
    this.accountService.register(data).subscribe(res => {
      Swal.fire({
        icon: res.icon,
        title: res.message,
        showConfirmButton: false,
        timer: 3000
      })
      window.location.reload();
    })

  }

}
