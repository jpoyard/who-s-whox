import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeopleDirectoryComponent } from './people-directory/people-directory.component';
import { WinnerDetailComponent } from './winner-detail/winner-detail.component';
import { WinnerDetailResolverService } from './winner-detail-resolver.service';

const routes: Routes = [
  {
    path: 'booking',
    component: PeopleDirectoryComponent,
    data: { title: 'Liste des élus' },
    children: [
      {
        path: ':id',
        component: WinnerDetailComponent,
        data: { title: 'Vue détaillée' },
        resolve: {
          winner: WinnerDetailResolverService
        }
      }
    ]
  },
  {
    path: '',
    redirectTo: '/booking',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
