import { Component } from '@angular/core'
import { finalize } from 'rxjs/operators'
import { AppService } from '../../services'
import { Creative } from '../../model'

@Component({
    selector: 'app-login-xrp',
    templateUrl: './login-xrp.component.html',
    styleUrls: ['./login-xrp.component.scss']
})
export class LoginXRPComponent {
    testnet_address: string
    testnet_secret: string

    constructor(
        private appService: AppService,
    ) { }

    showCreatingPanel(state: boolean | undefined = undefined) { }
 
    login() {
        this.appService.set_xrp_account(
            this.testnet_address,
            this.testnet_secret
        )
        location.reload()
    }
}
