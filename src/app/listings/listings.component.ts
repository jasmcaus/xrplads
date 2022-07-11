import { Component, OnDestroy, OnInit } from "@angular/core"
import { Subscription } from "rxjs"
import { AppService } from "../services"
import { Listing } from "../model"
import { ActivatedRoute } from "@angular/router"
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core"
import { LuxonDateAdapter, MAT_LUXON_DATE_FORMATS } from "@angular/material-luxon-adapter"
import { finalize } from "rxjs/operators"

export interface ComponentType<T = any> {
    new (...args: any[]): T
}

@Component({
    selector: "app-listings",
    templateUrl: "./listings.component.html",
    styleUrls: ["./listings.component.scss"],
    providers: [
        { provide: DateAdapter, useClass: LuxonDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_LUXON_DATE_FORMATS }
    ]
})
export class ListingComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription()
    listing: Listing

    private id: number
    should_display_book_listing: boolean = false
    formatted_listing_owner_address: string = ""

    constructor(
        private appService: AppService,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.subscriptions.add(
            this.activatedRoute.params.subscribe(params => {
                this.id = params["id"]

                this.appService.get_listings_by_id(this.id)
                    .pipe(finalize(() => {}))
                    .subscribe(value => { 
                        this.listing = value
                        const addr = value.owner.address
                        this.formatted_listing_owner_address = `${addr.slice(0, 6)}...${addr.slice(
                            addr.length - 4,
                            addr.length
                        )}`
                        console.log("this.listing:", this.listing)
                    })
            })
        )
    }


    book_listing() {
        this.should_display_book_listing = true
    }
    

    ngOnDestroy() {
        if(this.subscriptions) {
            this.subscriptions.unsubscribe()
        }
    }
}
