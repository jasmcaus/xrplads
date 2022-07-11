import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { ListingComponent } from "./listings/listings.component"
import { MainPageComponent } from "./main-page/main-page.component"
import { CreativesComponent } from "./creatives/creatives/creatives.component"
import { CreativeDetailsComponent } from "./creatives/creative-details/creative-details.component"
import { AuthGuard } from "./auth.guard"
import { MyCreativesComponent } from "./creatives/my-creatives.component"
import { HomeComponent } from "./main-page/home.component"
import { PresentationComponent } from "./presentation/presentation.component"
import { PublisherComponent } from "./publisher/publisher.component"

const routes: Routes = [
    {
        path: "",
        redirectTo: "/listings",
        pathMatch: "full"
    },
    {
        path: "listings",
        component: HomeComponent,
        children: [
            {
                path: "",
                component: MainPageComponent
            },
            {
                path: "listing/:id",
                component: ListingComponent
            },
            {
                path: "presentation/:id",
                component: PresentationComponent
            }
        ]
    },
    {
        path: "creatives",
        component: MyCreativesComponent,
        children: [
            {
                path: "",
                component: CreativesComponent,
            },
            {
                path: ":id",
                component: CreativeDetailsComponent,
            },
        ]
    },
    {
        path: "publisher",
        component: PublisherComponent,
    },
    {
        path: "**",
        redirectTo: "listings"
    },
]


@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }