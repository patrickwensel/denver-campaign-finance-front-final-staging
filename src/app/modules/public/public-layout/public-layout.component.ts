import { Component, OnInit } from '@angular/core';
import { CommonMethods} from 'src/app/core';

interface Food {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})

 
export class PublicLayoutComponent implements OnInit {
// dropdown static values
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];


  
     // ADD CHART OPTIONS. 
     chartOptions = {
      responsive: true,
      maintainAspectRatio:true,
     
      scales: {
        xAxes: [{
         display: false,
        omitXLabels: true,
          gridLines: {
              color: "rgba(0, 0, 0, 0)",
          }
      }],
      yAxes: [{
        barThickness: 120,
       display: false,
       omitXLabels: true,
          gridLines: {
              color: "rgba(0, 0, 0, 0)",
          }   
      }]
      },

      legend: { 
        position: 'right'
       },

      tooltips: {
        enabled: false
      },
    }
  
    labels =  ['Support ', 'Oppose'];
  
    // STATIC DATA FOR THE CHART IN JSON FORMAT.
    chartData = [
      // {
      //   label: 'Campaign Contributions',
      //   data: [21, 56, 4, 31, 45, 15, 57, 61, 9, 17, 24, 59] 
      // },
      // { 
      //   label: 'Independent Expendtures ',
      //   data: [47, 9, 28, 54, 77, 51, 24]
      // },

      
      {data: [21, 56, 4, 31, 45, 15, 57, 61, 9, 17, 24, 59], label:'Campaign Contributions', stack: 'a'},
      {data: [47, 9, 28, 54, 77, 51, 24], label:'Independent Expendtures', stack: 'a'},

    

  
    ];
  
    // CHART COLOR.
    colors = [
      { // 1st Year.
        backgroundColor: '#0297d6'
      },
      { // 2nd Year.
        backgroundColor: '#0f5597'
      }
    ]
  static_data: any;
  
    // public barChartOptions: ChartOptions = {
    //   responsive: true,
    //   scales: {
    //     yAxes: [
    //       {
    //         barThickness: 10,
    //       }
    //     ]
    //   }
    // };

  constructor(
    private commonMethods: CommonMethods,
  ) { }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
 
  }

 // Pie
 public pieChartLabels:string[] = ['Chrome', 'Safari'];
 public pieChartData:number[] = [40, 20];
 public pieChartType:string = 'pie';



 // events
 public chartClicked(e:any):void {
 //  console.log(e);
 }

 public chartHovered(e:any):void {
  // console.log(e);
 }

  // CHART CLICK EVENT.
  onChartClick(event) {
    console.log(event);
  }



}
