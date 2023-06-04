import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccoutService } from 'src/app/services/accout.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consignments',
  templateUrl: './consignments.component.html',
  styleUrls: ['./consignments.component.css']
})
export class ConsignmentsComponent implements OnInit {

  consignmentForm: FormGroup;
  response: any = null;
  value = new FormControl(null, { updateOn: 'blur' });
  valueMove;
  title: string;
  originCount;

  constructor(
    private accountService: AccoutService,
    public modalRef: MatDialogRef<ConsignmentsComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any,
  ) { }

  ngOnInit(): void {
    this.datos.type == 1 ? this.title = 'Consignar' : this.title = 'Retirar';
    this.activateForm();
  }

  activateForm() {
    this.consignmentForm = new FormGroup({
      accountNumber: new FormControl(''),
    });
  }

  movements(form) {
    if (this.value.value != null) {
      let data = {
        account: this.datos.data.account_number,
        type: this.datos.type,
        identification: this.datos.data.identification,
        accountNumber: form.accountNumber,
        value: this.value.value,
      }
      Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro de realizar este proceso?',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonColor: '#17A2B8',
        confirmButtonText: 'Continuar',
        timer: 8000
      }).then((result) => {
        if (result.isConfirmed) {
          this.accountService.movements(data).subscribe(res => {
            if (res.icon) {
              Swal.fire({
                icon: 'error',
                title: '¡Advertencia!',
                text: res.message,
                showConfirmButton: false,
                timer: 3000
              })
            } else {
              this.response = res;
              this.originCount = form.accountNumber.toString().replace(/(\d{3})(\d{5})(\d{2})/, '$1-$2-$3');
              this.valueMove = parseFloat(this.value.value).toLocaleString(undefined, { minimumFractionDigits: 0 });
            }
          })
        }
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: '¡Advertencia!',
        text: 'Se require un valor para continuar el proceso',
        showConfirmButton: false,
        timer: 3000
      })
    }

  }

}
