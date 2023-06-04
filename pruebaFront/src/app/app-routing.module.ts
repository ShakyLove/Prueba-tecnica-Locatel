import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { InfoAccountComponent } from './components/info-account/info-account.component';
import { AuthGuard } from './guards/account.guard';

const routes: Routes = [
  {path: 'home', component: HomeComponent,},
  {path: 'info', component: InfoAccountComponent, canActivate: [AuthGuard]},
  {path: '**', pathMatch: 'full', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
