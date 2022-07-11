import { NgModule } from "@angular/core"
import { MatIconRegistry } from "@angular/material/icon"
import { HttpClientModule } from "@angular/common/http"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { MAT_DATE_LOCALE } from "@angular/material/core"
import { BrowserModule, DomSanitizer } from "@angular/platform-browser"
import { NgxEchartsModule } from "ngx-echarts"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { MaterialModule } from "./material.module"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { ListingComponent } from "./listings/listings.component"
import { MainPageComponent } from "./main-page/main-page.component"
import { AboutComponent, HistoryComponent } from "./listings/components"
import { CustomHeader } from "./listings/custom-header/calendar-custom-header"
import { DateFormatPipe } from "./pipes"
import { AuthGuard } from "./auth.guard"
import { CreativesComponent } from "./creatives/creatives/creatives.component"
import { CreativeDetailsComponent } from "./creatives/creative-details/creative-details.component"
import { BookListingComponent } from "./listings/book-listing/book-listing.component"
import { AppService } from "./services"
import { MyCreativesComponent } from "./creatives/my-creatives.component"
import { NewCreativeComponent } from "./creatives/new-creative/new-creative.component"
import { NewListingComponent } from "./listings/new-listing/new-listing.component"
import { LoginXRPComponent } from "./creatives/login-xrp/login-xrp.component"
import { HomeComponent } from "./main-page/home.component"
import { PresentationComponent } from "./presentation/presentation.component"
import { PublisherComponent } from "./publisher/publisher.component"

@NgModule({
    declarations: [
        AppComponent,
        MainPageComponent,
        ListingComponent,
        AboutComponent,
        HistoryComponent,
        CustomHeader,
        DateFormatPipe,
        BookListingComponent,
        CreativesComponent,
        CreativeDetailsComponent,
        MyCreativesComponent,
        NewCreativeComponent,
        LoginXRPComponent,
        NewListingComponent,
        HomeComponent,
        PresentationComponent,
        PublisherComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MaterialModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        NgxEchartsModule.forRoot({
            echarts: () => import("echarts"),
        })
    ],
    providers: [
        {
            provide: MAT_DATE_LOCALE, useValue: "en-GB"
        },
        AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        private sanitizer: DomSanitizer,
        private matIconRegistry: MatIconRegistry,
        private appService: AppService
    ) {
        this.appService.detect_metamask();

        this.matIconRegistry.addSvgIcon(
            "close",
            this.sanitizer.bypassSecurityTrustResourceUrl("./assets/images/close.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "logout",
            this.sanitizer.bypassSecurityTrustResourceUrl("./assets/images/logout.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "arrow2-left",
            this.sanitizer.bypassSecurityTrustResourceUrl("./assets/images/arrow2-left.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "arrow2-right",
            this.sanitizer.bypassSecurityTrustResourceUrl("./assets/images/arrow2-right.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "eye",
            this.sanitizer.bypassSecurityTrustResourceUrl("./assets/images/eye.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "upload",
            this.sanitizer.bypassSecurityTrustResourceUrl("./assets/images/paper-plus.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "search",
            this.sanitizer.bypassSecurityTrustResourceUrl("./assets/images/search.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "delete",
            this.sanitizer.bypassSecurityTrustResourceUrl("./assets/images/delete.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "send",
            this.sanitizer.bypassSecurityTrustResourceUrl("./assets/images/send.svg")
        );
    }
}
