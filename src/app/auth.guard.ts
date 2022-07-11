import { Injectable } from "@angular/core"
import { 
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from "@angular/router"
import { AppService } from "./services"

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private appService: AppService, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): UrlTree | boolean {
        if(!this.appService.get_xrp_account().address) {
            return this.router.createUrlTree(["/listings"]);
        }
        return true;
    }
}
