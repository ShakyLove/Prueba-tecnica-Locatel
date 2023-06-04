import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccoutService } from '../services/accout.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccoutService, private router: Router) { }

  canActivate(): boolean {
    if (this.accountService.readToken() != null) {
      return true;
    } else {
      this.router.navigateByUrl('/home');
    }

  }

}
