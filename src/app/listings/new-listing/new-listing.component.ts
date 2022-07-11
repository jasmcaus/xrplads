import { Component } from "@angular/core"
import { finalize } from "rxjs/operators"
import { AppService } from "../../services"
import { Creative } from "../../model"
import { DateTime } from "luxon"

interface Category {
    id: number,
    name: string
}

@Component({
    selector: "app-new-creative",
    templateUrl: "./new-listing.component.html",
    styleUrls: ["./new-listing.component.scss"]
})
export class NewListingComponent {
    listing_name: string;
    listing_description: string;
    listing_price: string;
    listing_location: string;
    selected_category_id: number;
    filename: string;
    fileError: string;
    is_creating: boolean;
    categories: Category[]
    categories_map: any
    private file: any;
    private selected_listing_id: number;

    constructor(
        private appService: AppService,
    ) {
        this.selected_category_id = 0;
        this.categories = [
            { id: 0, name: "Select a Category" },
            { id: 1, name: "Art" },
            { id: 2, name: "Commodity" },
            { id: 3, name: "Event" },
            { id: 4, name: "Real Estate" },
        ]
        this.categories_map = {
            0: "Select a Category",
            1: "Art",
            2: "Commodity",
            3: "Event",
            4: "Real Estate",
        }
    }


    create_listing() {
        if(!this.appService.get_xrp_account().address)
            alert("Connect your wallet first.")

        this.is_creating = true;
        this.fileError = "";

        this.appService.create_listing(
            this.listing_name,
            this.listing_description,
            this.listing_location,
            this.listing_price,
            this.filename,
            this.file
        )
        .then((val: any) => {})
        .finally(() => this.is_creating = false)


        // this.appService.create_listing(
        //     this.listing_name,
        //     this.listing_description,
        //     this.categories_map[+this.selected_category_id],
        //     +this.listing_price,
        //     this.listing_expiration_date,
        //     this.filename,
        //     this.file
        // )
        //     .pipe(
        //         finalize(() => { })
        //     )
        //     .subscribe((value: any) => {
        //         // console.log("Event: ", value)
        //         this.selected_listing_id = value.data.id
        //         const data = value.data
        //         console.log("Returned data: ", data)

        //         const params = this.contractService.create_listing(
        //             data.id,
        //             data.owner.address,
        //             data.name,
        //             data.description,
        //             +this.appService.parse_string_date_to_datetime(data.expiration_date),
        //             +data.funding_goal
        //         )

        //         console.log("Returned params: ", params)
        //         this.appService.invoke_contract("create_listing", params)

        //         this.is_creating = false
        //     })
    }


    fileChangeEvent(event: any) {
        this.fileError = "";
        let file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
        const pattern = /webm-*|image/;
        const reader = new FileReader();
        if (!file.type.match(pattern)) {
            this.fileError = "Invalid format";
            return;
        }

        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
        this.filename = file.name;
    }


    _handleReaderLoaded(event: any) {
        let reader = event.target;
        this.file = reader.result
            .replace("data:", "")
            .replace(/^.+,/, "");
        console.log("File: ", this.filename)
    }


    clear_file() {
        this.filename = ""
        this.file = null
    }


    show_category_panel() {
        // console.log("selected_category_id:", this.selected_category_id)
    }
}