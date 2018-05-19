import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PeopleDirectoryComponent } from "./people-directory/people-directory.component";

const routes: Routes = [
  {
    path: "winners",
    component: PeopleDirectoryComponent,
    data: { title: "Liste des gagnants" }
  },
  {
    path: "",
    redirectTo: "/winners",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
