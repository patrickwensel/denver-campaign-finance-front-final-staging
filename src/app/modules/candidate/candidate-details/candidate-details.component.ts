import { Component, OnInit, ViewChild } from '@angular/core';
import { AUDIT_DATA, COMPLAINT_DATA, OTHER_REPORTS_DATA, PENALTY_DATA, CAMPAIGN_FILLINGS_DATA } from './data';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexTooltip,
  ApexFill,
  ApexLegend,
  ApexGrid
} from "ng-apexcharts";
import { CommonMethods } from 'src/app/core';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
  grid: ApexGrid;
};
@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.scss']
})


export class CandidateDetailsComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  @ViewChild("opposingChart") opposingChart: ChartComponent;
  public supportingChartOptions: Partial<ChartOptions>;
  public opposingChartOptions: Partial<ChartOptions>;
  static_data: any;
  hideRequiredMarker: boolean = true;
  auditColumns = ['date', 'description', 'view'];
  complaintColumns = ['description', 'status', 'view'];
  penaltyColumns = ['penalty', 'paymentStatus', 'waiverRequest', 'decision', 'amount'];
  reportsColumns = ['fillingPeriod', 'reportingPeriod', 'amendmentVersion', 'dateSubmitted', 'view'];
  auditData = AUDIT_DATA;
  complaintData = COMPLAINT_DATA;
  penaltyData = PENALTY_DATA;
  otherReportsData = OTHER_REPORTS_DATA;
  campaignFillingsData = CAMPAIGN_FILLINGS_DATA;

  electionYearList: string[] = ['2019-2020', '2020-2021'];
  selectedYear = this.electionYearList[0];
  yearList: string[] = ['2020', '2019'];
  selectedReportYear = this.yearList[0];
  constructor(private commonMethods: CommonMethods) {
  }  

  createChart(data, title) {
    let chartOptions:Partial<ChartOptions> = {
      series: data,
      chart: {
        type: "bar",
        height: 150,
        stacked: true,
        toolbar: {
          show: false
        }
      },
      grid: {
        show: false,
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      title: {
        text: title,
        offsetX: 15,
        offsetY: 30,
        style: {
          fontWeight: "normal",
          color: "#aaa"
        }
      },
      xaxis: {
        labels: {
          formatter: (val) => ""
        },
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        show: false,
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      tooltip: {
        enabled: false
      },
      fill: {
        opacity: 1,
        colors: ["#0a3b6a", "#0f5597", "#116bc0", "#7eb7ed"]
      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      }
    };
    return chartOptions;
  }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    let supportChartData = [
      {
        name: "Marine Sprite",
        data: [10]
      },
      {
        name: "Striking Calf",
        data: [90]
      },
      {
        name: "Tank Picture",
        data: [12]
      },
      {
        name: "Bucket Slope",
        data: [9]
      }
    ];
    this.supportingChartOptions = this.createChart(supportChartData, 'Support for Newsom Gavin');
    let oppositionChartData = [
      {
        name: "Marine Sprite",
        data: [10]
      },
      {
        name: "Striking Calf",
        data: [50]
      },
      {
        name: "Tank Picture",
        data: [12]
      },
    ];
    this.opposingChartOptions = this.createChart(oppositionChartData, 'Opposition to Newsom Gavin');
  }
}
