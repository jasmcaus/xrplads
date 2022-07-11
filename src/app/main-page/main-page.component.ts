import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Listing, PresentationBE } from "../model";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { AppService, PopupService } from "../services";
import { FormControl } from "@angular/forms";


interface ListingPreview {
    id: number,
    owner_address: string,
    name: string,
    location: string,
    description?: string,
    thumb_url: string,
    is_active: boolean,
    likes: number,
    weekly_users: number,
    source: "listings" | "presentations"
}

@Component({
    selector: "app-main-page",
    templateUrl: "./main-page.component.html",
    styleUrls: ["./main-page.component.scss"]
})
export class MainPageComponent implements OnInit, OnDestroy {
    search = new FormControl("")
    
    private subscriptions = new Subscription();
    listings: ListingPreview[] = [];
    selected_listing: ListingPreview | null = null;
    signed: boolean = false;
    selected_listing_filter = "all";
    loading = false; // not used
    sort_type: "category" | "id" | "status"

    constructor(
        private appService: AppService,
        private popupService: PopupService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const filter = this.route.snapshot.paramMap.get("filter");
        this.load_listings(filter ? filter : "all");
        this.subscriptions.add(
            this.appService.signed$.subscribe(value => this.signed = value)
        );
    }

    navigate_to_page_of(listing: ListingPreview) {
        this.selected_listing = listing

        if(listing.source === "listings") {
            this.router.navigate([`/listings/listing/${listing.id}`])
        } else {
            this.router.navigate([`/listings/presentation/${listing.id}`])
        }
    }

    load_listings(filter: string = "all") {
        let count = -1
        this.loading = true;
        this.selected_listing_filter = filter;
        if(filter === "all") {
            this.subscriptions.add(
                this.appService.get_listings()
                    .pipe(
                        finalize(() => {
                            this.loading = false;
                        })
                    )
                    .subscribe((value: Listing[]) => { 
                        this.listings = value.map(a => {
                            count += 1;
                            return {
                                id: count,
                                owner_address: a.owner.address,
                                name: a.name,
                                description: a.description,
                                location: a.location,
                                price: a.price,
                                thumb_url: a.thumb_url,
                                is_active: a.is_active,
                                likes: a.likes,
                                weekly_users: a.weekly_users,
                                source: "listings"
                            }
                        });
                        this.selected_listing_filter = filter;
                    })
            );
        } else {
            this.loading = false;
        }
    }

    parse_search(search_value: string) {
        this.listings = this.listings.filter(
            cr => cr.name.toLowerCase().includes(search_value.toLowerCase().trim())
        )
    }

    sorting() {
        // if(this.sort_type === "id") {
        //     this.listings = this.listings.sort((a, b) => {
        //         return (a.id < b.id) ? 1 : -1
        //     })
        // } else if(this.sort_type === "category") {
        //     this.listings = this.listings.sort((a, b) => {
        //         return a.category ? -1 : 1
        //     })
        // } else if(this.sort_type === "status") {
        //     this.listings = this.listings.sort((a, b) => {
        //         return a.status === 1 ? -1 : 1
        //     })
        // }
    }

    new_listing() {
        this.popupService.popupNewListing();
    }

    ngOnDestroy() {
        if(this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }
}
