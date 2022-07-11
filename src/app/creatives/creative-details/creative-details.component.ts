import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from '../../services/index';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Creative } from '../../model/index';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-creative-details',
    templateUrl: './creative-details.component.html',
    styleUrls: ['./creative-details.component.scss']
})
export class CreativeDetailsComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();
    loading = false; /* no used */
    creative: Creative;
    private id: number;
    hpb_explorer_url = environment.hpb.explorer_url;

    constructor(
        private appService: AppService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() {
        this.hpb_explorer_url = `${this.hpb_explorer_url}/${this.appService.get_metamask_address()}`;
        this.subscriptions.add(
            this.activatedRoute.params.subscribe(params => {
                this.id = params['id'];
            })
        );
        this.loadCreative();
    }

    loadCreative() {
        this.loading = true;
        this.subscriptions.add(
            this.appService.get_creative_by_id(this.id)
                .pipe(
                    finalize(() => this.loading = false)
                )
                .subscribe(value => this.creative = {...value, type: value.url.substring(value.url.lastIndexOf('.') + 1)})
        );
    }

    returnBack() {
        this.router.navigate(['/creatives']);
    }

    ngOnDestroy() {
        if(this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }
}
