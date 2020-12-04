"use strict"

window.addEventListener("DOMContentLoaded", (event) => {
// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';







//
const groupBy = () => {
  let route = '/groupby';

  $.ajax({
    type: 'GET',
    url: route,
    data: false,
    cache: false,
    contentType: false,
    processData: false,
  
    success: (data) => {
      if (data) {
        loadPie(data.data) 
      }
    },
    error: function (data) {
    }
  });


}

groupBy();







const loadPie =(data)=>{

 let tabLabel =[]
 let tabData =[]
 data.map(item=>{
  tabLabel.push(item.categorieName)
  tabData.push(item.nombre)
 })


// Pie Chart Exampl
var ctx = document.getElementById("myPieChart");
var myPieChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: tabLabel,
    datasets: [{
      data: tabData,
      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc','#f6c23e'],
      hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf','#f6c23e'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
    },
    legend: {
      display: true
    },
    cutoutPercentage: 80,
  },
});
}






})