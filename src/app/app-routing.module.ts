import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ElaboratorLobbyComponent } from './component/elaborator-lobby/elaborator-lobby.container.component';
import { ElaboratorReviewLobbyComponent } from './component/elaborator-review-lobby/elaborator-review-lobby.container.component';

const routes: Routes = [
  {
    path: '',
    component: ElaboratorLobbyComponent,
  },
  {
    path: 'review',
    component: ElaboratorReviewLobbyComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
