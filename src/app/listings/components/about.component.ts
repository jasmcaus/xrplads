import { Component, Input } from "@angular/core";

@Component({
    selector: "app-about",
    template: `
        <div class="about">
            <h4 class="about__title">{{header}}</h4>
            <div class="about__body">{{body}}</div>
        </div>
    `,
    styles: [`
        @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400;600;800&display=swap');

        .about {
            padding: 0;

            &__title {
                font-style: normal;
                font-weight: bold;
                font-size: 28px;
                line-height: 110%;
                letter-spacing: -1px;
                color: #ffffff;
                margin: 0;
                margin-bottom: 24px;
            }
            &__body {
                font-family: Inconsolata;
                font-style: normal;
                font-weight: normal;
                font-size: 18px;
                line-height: 35px;
                color: #ffffff;
                margin-bottom: 16px;
            }
        }
    `]
})
export class AboutComponent {
    @Input() header: string = "";
    @Input() body: string = "";

    more() {
        console.log("unknown action");
        alert("Unknown action!")
    }
}
