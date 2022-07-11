import { Component, OnDestroy, OnInit } from "@angular/core";
import { appVersion } from "../environments/app-version";
import { Subscription } from "rxjs";
import { AppService, PopupService } from "./services";
import { environment } from "../environments/environment";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
    title = "cascade";
    version = appVersion;
    user: string = "";
    currentState: string = "minimized";
    explorer_url = `${environment.hpb.explorer_url}/address`;

    private subscriptions = new Subscription();

    constructor(
        private appService: AppService,
        private popupService: PopupService
    ) {
        if(!this.appService.is_metamask_available()) {
            alert("The MetaMask Browser Extension is not installed. Please install it.")
        }
    }

    ngOnInit() {
        const xrp_address = this.appService.get_xrp_account().address
        if(!!xrp_address) {
            this.user = `${xrp_address.slice(0, 6)}...${xrp_address.slice(
                xrp_address.length - 4,
                xrp_address.length
            )}`
        }

        this.appService.instantiate_provider()
    }

    login_metamask() {
        this.popupService.login_to_xrpl()
    }

    get logined(): boolean {
        return !!this.user
    }

    logout() {
        this.appService.log_out();
    }

    ngOnDestroy() {
        if(this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }
}
