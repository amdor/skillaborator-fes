import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoComponent } from './component/elaborator-lobby/demo/demo.component';
import { ElaboratorLobbyComponent } from './component/elaborator-lobby/elaborator-lobby.container';
import { ElaboratorReviewLobbyComponent } from './component/elaborator-review/elaborator-review.container';
import { LobbyComponent } from './component/lobby/lobby.component';

const routes: Routes = [
  {
    path: '',
    component: LobbyComponent,
  },
  {
    path: 'elaborator/:oneTimeCode',
    component: ElaboratorLobbyComponent,
  },
  {
    path: 'review/:oneTimeCode',
    component: ElaboratorReviewLobbyComponent,
  },
  {
    path: 'demo/:oneTimeCode',
    component: DemoComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
