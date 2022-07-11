import { Component } from '@angular/core'
import { finalize } from 'rxjs/operators'
import { AppService } from '../../services'
import { Creative } from '../../model'

@Component({
    selector: 'app-new-creative',
    templateUrl: './new-creative.component.html',
    styleUrls: ['./new-creative.component.scss']
})
export class NewCreativeComponent {
    creative_name: string;
    creativeDescription: string;
    filename: string;
    fileError: string;
    is_creating: boolean;
    private file: any;
    private selected_creative_id: number | undefined;

    constructor(
        private appService: AppService,
    ) { }

    showCreatingPanel(state: boolean | undefined = undefined) { }
 
    upload_file() {
        this.is_creating = true;
        this.fileError = '';

        this.appService.save_creative(
            this.appService.get_metamask_address(),
            this.creative_name, 
            this.creativeDescription, 
            this.filename, 
            this.file
        )
            .pipe(
                finalize(() => { })
            )
            .subscribe(value => {
                console.log("Event: ", value)
                this.selected_creative_id = value.data.id 
                
                this.is_creating = false
            })
    }


    fileChangeEvent(event: any) {
        this.fileError = '';
        let file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
        const pattern = /webm-*|image/;
        const reader = new FileReader();
        if(!file.type.match(pattern)) {
            this.fileError = 'Invalid format';
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
}
