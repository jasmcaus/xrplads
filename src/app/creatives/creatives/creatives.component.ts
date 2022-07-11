import {Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import {
    AppService,
    PopupService,
} from "../../services/index";
import { Subscription } from "rxjs";
import { Creative } from "../../model/index";
import { finalize } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
    selector: "app-creatives",
    templateUrl: "./creatives.component.html",
    styleUrls: ["./creatives.component.scss"]
})
export class CreativesComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();
    search = new FormControl("");
    sort_type: "status" | "id";
    creatives: Creative[];
    filtered_creatives: Creative[];
    new_creative_id: number | null;

    constructor(
        private appService: AppService,
        private router: Router,
        private popupService: PopupService,
    ) { }

    ngOnInit() {
        this.loadCreatives();
    }
 
    loadCreatives() {
        this.appService.get_creatives()
            .pipe(finalize(() => { }))
            .subscribe(value => {
                this.creatives = value.map(cr => {
                    return {...cr, type: cr.url.substring(cr.url.lastIndexOf(".") + 1)}
                });
                console.log("All creatives: ", this.creatives)
                this.filtered_creatives = this.creatives;
            })
    }

    parseSearch(searchValue: string) {
        this.filtered_creatives = this.creatives.filter(cr => cr.name.toLowerCase().includes(searchValue.toLowerCase().trim()))
    }

    sorting() {
        if(this.sort_type === "id") {
            this.filtered_creatives = this.filtered_creatives.sort((a, b) => {
                return (a.id < b.id) ? 1 : -1;
            });
        } else if(this.sort_type === "status") {
            this.filtered_creatives = this.filtered_creatives.sort((a, b) => {
                return a.blockchain_ref ? -1 : 1;
            });
        }
    }

    deleteCreatives(creative: Creative) {
        alert("[ERROR] Not implemented as yet.")
    }

    go_to_details(id: number) {
        this.router.navigate([`/creatives/${id}`])
    }

    new_creative() {
        this.popupService.popupNewCreative();
    }

    ngOnDestroy() {
        if(this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }
}
