import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NewCreativeComponent } from "../creatives/new-creative/new-creative.component";
import { LoginXRPComponent } from "../creatives/login-xrp/login-xrp.component";
import { NewListingComponent } from "../listings/new-listing/new-listing.component"

@Injectable({ providedIn: "root" })
export class PopupService {
    constructor(
        private dialog: MatDialog
    ) { }

    popupNewCreative() {
        this.dialog.open(NewCreativeComponent, {
            width: "592px",
            height: "468px",
            maxHeight: "100%",
            backdropClass: "modal-backdrop"
        });
    }

    popupNewListing() {
        this.dialog.open(NewListingComponent, {
            width: "592px",
            height: "468px",
            maxHeight: "100%",
            backdropClass: "modal-backdrop"
        });
    }


    login_to_xrpl() {
        this.dialog.open(LoginXRPComponent, {
            width: "592px",
            height: "468px",
            maxHeight: "100%",
            backdropClass: "modal-backdrop"
        });
    }
}
