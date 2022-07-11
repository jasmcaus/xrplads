import { Component, Input, OnInit } from "@angular/core";
import { EChartsOption } from "echarts";

type Category = "year" | "day";

const yearChartOption: EChartsOption = {
    tooltip: {},
    xAxis: {
        type: "category",
        data: [
            // "January", 
            "February", 
            "March", 
            "April",
            "May",
            "June"
        ],
    },
    yAxis: {
        type: "value",
    },
    series: [
        {
            data: [
                1450, 
                900, 
                2000, 
                2567, 
                4598
            ],
            type: "line",
            animationDelay: (idx) => idx * 10,
            smooth: true
        },
    ],
    animationEasing: "elasticOut",
    animationDelayUpdate: (idx) => idx * 5
};

const day_chart_option: EChartsOption = {
    tooltip: {},
    xAxis: {
        type: "category",
        data: ["6 am", "8 am", "10 am", "12 am", "2 pm", "4 pm", "6 pm", "8 pm", "10 pm", "12 pm"],
    },
    yAxis: {
        type: "value",
    },
    series: [
        {
            data: [30, 70, 120, 250, 159, 450, 300, 600, 800, 569],
            type: "line",
            animationDelay: (idx) => idx * 10,
            smooth: true
        },
    ],
    animationEasing: "elasticOut",
    animationDelayUpdate: (idx) => idx * 5
};

@Component({
    selector: "app-history",
    template: `
        <div class="history">
            <div class="history__titles">
                <h5 class="">{{ header }}</h5>
                <div class="history__type">
                    <span style="cursor: pointer"
                                [class.selected]="category === 'year'"
                                (click)="set_category('year')">Months</span>
                    <span style="cursor: pointer"
                                [class.selected]="category === 'day'"
                                (click)="set_category('day')">Day</span>
                </div>
            </div>
            <div echarts [options]="chartOption" class="price-chart"></div>
        </div>
    `,
    styles: [`
        .history {
            padding: 0;
            height: 290px;

            &__titles {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding-bottom: 25px;

                h5 {
                    font-style: normal;
                    font-weight: bold;
                    font-size: 28px;
                    line-height: 110%;
                    letter-spacing: -1px;
                    color: #FFFFFF;
                    margin: 0;
                    padding: 0;
                }
            }

            &__type {
                display: flex;
                flex-wrap: wrap;
             
                span {
                    font-style: normal;
                    font-weight: normal;
                    font-size: 15px;
                    line-height: 110%;
                    letter-spacing: -0.7px;
                    color: #FFFFFF;
                
                    &:nth-child(even) {
                        padding-right: 16px;
                    }
                    &:nth-child(odd) {
                        padding-right: 16px;
                    }
                    &:last-child {
                        padding-right: 0;
                    }
                }
            }
        }
        .price-chart {
            height: 350px;
            top: -20px;
            width: 100%;
        }
        .selected {
            color: #FFBE04 !important;
        }
    `]
})
export class HistoryComponent implements OnInit {
    category: Category = "year";
    chartOption: EChartsOption;

    @Input() header: string;

    ngOnInit() {
        this.set_chart_options();
    }

    set_chart_options() {
        if(this.category === "year") {
            this.chartOption = yearChartOption;
        } else if(this.category === "day") {
            this.chartOption = day_chart_option;
        }
    }

    set_category(category: Category) {
        this.category = category;
        this.set_chart_options();
    }
}
