import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConsignmentsComponent } from '../consignments/consignments.component';
import { AccoutService } from 'src/app/services/accout.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-info-account',
  templateUrl: './info-account.component.html',
  styleUrls: ['./info-account.component.css']
})
export class InfoAccountComponent implements OnInit {

  data: any = null;
  movements: any[];
  accountNumber;
  tarjetNumber;
  valueCount;
  dataAccount

  constructor(private modal: MatDialog, private accountService: AccoutService) {
    this.dataAccount =this.accountService.decryptToken();
  }

  ngOnInit(): void {
    this.getInfo();
  }

  getInfo() {
    this.accountService.getInfo(this.dataAccount.id).subscribe((res:any) => {
      this.data           = res.account;
      this.accountNumber  = res.account.account_number.replace(/(\d{3})(\d{5})(\d{2})/, '$1-$2-$3');
      this.tarjetNumber   = res.account.tarjet_number.match(/.{1,4}/g).join(' ');
      this.valueCount     = parseFloat(res.account.value_count).toLocaleString(undefined, { minimumFractionDigits: 0 });

      res.movements.map(item => {
        item.value_mov  = parseFloat(item.value_mov).toLocaleString(undefined, { minimumFractionDigits: 0 });
        item.created_at = new Date(item.created_at);
      })
      this.movements = res.movements;
      console.log(res.movements);
    })
  }

  consignment() {
    const modalRef = this.modal.open(ConsignmentsComponent, {
      width: '40%',
      data: { type: 1, data: this.data, valueCount: this.valueCount, accountNumber: this.accountNumber },
      disableClose: false,
      panelClass: 'custom-dialog-container'
    })

    modalRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  retire() {
    const modalRef = this.modal.open(ConsignmentsComponent, {
      width: '40%',
      data: { type: 2, data: this.data, valueCount: this.valueCount, accountNumber: this.accountNumber },
      disableClose: false,
      panelClass: 'custom-dialog-container'
    })

    modalRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

}
