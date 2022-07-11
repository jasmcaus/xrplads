import { Component, Input, OnDestroy, OnInit } from "@angular/core"
import { DateTime } from "luxon"
import { CustomHeader } from "../custom-header/calendar-custom-header"
import { ComponentType } from "../listings.component"
import {
    Listing,
    Creative,
    Timeslot,
 } from "../../model"
import { finalize, map } from "rxjs/operators"
import { AppService } from "../../services"
import { Subscription, Observable, of } from "rxjs"
import { Router } from "@angular/router"
import { environment } from "../../../environments/environment"


interface TimeslotsByType {
    am: Timeslot[],
    pm: Timeslot[]
}

@Component({
    selector: "app-book-listing",
    templateUrl: "./book-listing.component.html",
    styleUrls: ["./book-listing.component.scss"]
})
export class BookListingComponent implements OnInit, OnDestroy {
    @Input() listing: Listing

    private subscriptions = new Subscription()

    // Dates
    today: DateTime = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    selected_date: DateTime = this.today.setLocale("en")

    // Timeslot
    timeslots: TimeslotsByType = { am: [], pm: [] };
    selected_timeslot: Timeslot;

    // Creative
    creatives: Creative[] = []
    selected_creative_id: number | undefined;
    is_zero_creatives: boolean = false;

    // When uploading creatives
    file: any;
    filename: string;
    fileError: string;

    metamask_address: string;
    explorer_url = `${environment.hpb.explorer_url}`;

    constructor(
        private appService: AppService,
        private router: Router
    ) { }

    ngOnInit() {
        this.metamask_address = this.appService.get_metamask_address();
        this.explorer_url = `${this.explorer_url}/${this.metamask_address}`;

        this.subscriptions.add(
            this.loadCreatives()
                .pipe(finalize(() => { }))
                .subscribe(creatives => {
                    // Filter creatives owned by the user
                    console.debug("All creatives:", creatives)
                    if(creatives) {
                        for(var i=0; i<creatives.length; i++) {
                            const creative = creatives[i];
                            if(creative.owner.address === this.metamask_address) {
                                this.creatives.push(creative)
                            }
                        }
                    }

                    if(this.creatives && this.creatives.length === 0) {
                        this.is_zero_creatives = true;
                    }

                    this.subscriptions.add(
                        this.load_timeslots().subscribe(
                            value => {
                                this.timeslots = value
                            }
                        )
                    );
                })
        );
    }

    navigate_to_creatives_section() {
        this.router.navigate([`/creatives/`])
    }

    getCustomHeader(): ComponentType<any> {
        return CustomHeader
    }

    select_date(event: any) {
        this.load_timeslots().subscribe(
            value => this.timeslots = value
        );
    }

    load_timeslots(): Observable<TimeslotsByType> {
        if(this.listing) {
            let min_available_time: DateTime;
            let max_available_time: DateTime;
            if(+this.today === +this.selected_date) {
                min_available_time = DateTime.now().plus({ minutes: 3 });
                max_available_time = DateTime.now().plus({ hours: 2 });
            } else {
                min_available_time = this.selected_date.plus({ minutes: 3 });
                max_available_time = this.selected_date.plus({ hours: 2 });
            }

            // console.log("selected_date:", this.selected_date.toISO())
            // console.log("min_available_time:", min_available_time.toISO())
            // console.log("max_available_time:", max_available_time.toISO())

            return this.appService.get_timeslots(this.selected_date.toISO())
                    .pipe(
                        map((value: Timeslot[]) => {
                            const timeslots: TimeslotsByType = { am: [], pm: [] }

                            timeslots.am = value.filter(v => {
                                return v.from_time.hour < 12 && +v.from_time > +min_available_time && +v.from_time < +max_available_time
                            });
                            timeslots.pm = value.filter(v => {
                                return v.from_time.hour >= 12 && +v.from_time > +min_available_time && +v.from_time < +max_available_time
                            });
                            return timeslots;
                        })
                    )
        }
        return of({ am: [], pm: [] });
    }

    _parseTimeObj(time: any) {
        // {"year":2022,"month":5,"day":6,"hour":4,"minute":50,"second":0,"millisecond":0}
        return `${time.day}/May/${time.year} 0${time.hour}::${time.minute}`
    }


    selectTimeslot(timeslot: Timeslot) {
        if(!timeslot.is_booked) {
            this.selected_timeslot = timeslot;
        }
    }


    loadCreatives(): Observable<Creative[]> {
        return this.appService.get_creatives();
    }


    showCreatingPanel(state: boolean | undefined = undefined) {
        if(state) {
            this.selected_creative_id = undefined;
        }
    }


    clear_file() {
        this.filename = ""
        this.file = null
    }


    book_listing() {
        this.appService.book_listing({
            owner_address: this.appService.get_metamask_address(),
            contract_address: this.appService.get_contract_address(),
            listing_id: this.listing.id,
            creative_id: this.selected_creative_id!,
            from_time: this.selected_timeslot.from_time.toUTC().toISO({ includeOffset: false }),
            to_time: this.selected_timeslot.to_time.toUTC().toISO({ includeOffset: false }),
            play_price: this.listing.price
        })
            .subscribe(value => {})
    }


    ngOnDestroy() {
        if(this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }
}
