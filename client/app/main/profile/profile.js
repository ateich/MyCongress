angular.module('myCongressApp')
.directive('hcPie', function () {
  return {
    restrict: 'C',
    replace: true,
    scope: {
      items: '='
    },
    controller: function ($scope, $element, $attrs) {
      console.log(2);

    },
    template: '<div id="container" style="margin: 0 auto">not working</div>',
    link: function (scope, element, attrs, $filter) {
      console.log(3);
      var chart = new Highcharts.Chart({
        chart: {
          renderTo: 'container',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          margin: [0, 0, 0, 0],
                  spacingTop: 0,
                  spacingBottom: 0,
                  spacingLeft: 0,
                  spacingRight: 0
        },
        title: {
          text: 'Browser market shares at a specific website, 2010',
          style: {
            color: 'white'
          }
        },
        tooltip: {
          pointFormat: '{series.name}: <b>${point.y}</b>'
        },
        plotOptions: {
          pie: {
            size:'25%',
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              // color: this.point.color,
              // connectorColor: this.point.color,
              formatter: function () {
                // var value = $filter('currency',this.total);
                console.log(this);
                var value = this.y;
                return '<span style="color:'+this.point.color+'">' + this.point.name + ': ' + value + '</span>';
              }
            }
          }
        },
        series: [{
          type: 'pie',
          name: 'Browser share',
          data: scope.items
        }]
      });
      scope.$watch("items", function (newValue) {
        chart.series[0].setData(newValue, true);
      }, true);
      
    }
  }
})

  .controller('profileController', function($scope, limitToFilter, Profile, Politicians, Donors, Charts, $stateParams, sectorCodes){
    var id = $stateParams.id;
    $scope.sectorCodes = sectorCodes;

    Politicians.getRep(id).then(function (data) {
      var current = data.data.results[0];
      var parties = {'D': 'Democrat', 'R': 'Republican', 'I': 'Independent'};
      var name = current.first_name + ' ' + current.last_name;
      $scope.rep = current;
      $scope.website = current['website'];
      $scope.contactForm = current['contact_form'];
      $scope.fbId = current['facebook_id'];
      $scope.twitterId = current['twitter_id'];
      $scope.youtubeId = current['youtube_id'];
      $scope.rep.party = parties[current['party']];
      return name;
    }).then(function (name) {

      Donors.getPolitician(name).then(function(data){

        if (!data.data[0]) { 
          $scope.errormessage = 'No financing available';
          return;
        }
        $scope.totalFinancing = data.data[0].total_received;
        var transparencyId = data.data[0].id;
        $scope.corpToggle = false;
        $scope.corpData = [];
        Donors.getTopContributorsofPolitician(transparencyId).then(function(data){
          $scope.topDonors = data.data;
          for (var i = 0; i < $scope.topDonors.length - 5; i++) {
            var name = data.data[i].name;
            var amount = parseInt(data.data[i].total_amount);
            $scope.corpData.push([name, amount]);
            // console.log(amount);
          }
          $scope.corpToggle = true;
          $scope.CorpChartConfig = new Highcharts.Chart({

          });
        });

$scope.sectorToggle = false;
$scope.sectorData = [];
Donors.getTopSectorsofPolitician(transparencyId).then(function(data){
  $scope.topSectors = data.data;
  for (var i = 0; i < $scope.topSectors.length - 5; i++) {
    var sector = $scope.sectorCodes[data.data[i].sector];
    var amount = parseInt(data.data[i].amount);
    $scope.sectorData.push([sector, amount]);
  }
  $scope.sectorToggle = true;
  $scope.SectorChartConfig = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      backgroundColor:'rgba(0, 0, 0, 0)',
    },
    title: {
      text: 'Top Donors by Sector',
      style: {
        color: '#f5f5f5'
      }
    },
    series: [{
      type: 'pie',
      name: 'Total Contribution',
      data: $scope.sectorData
    }],
    tooltip: {
      valuePrefix: '$',
      valueSuffix: ''
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    }
  }
});

$scope.industryToggle = false;
$scope.industriesData = [];
Donors.getTopIndustriesofPolitician(transparencyId).then(function(data){
  $scope.topIndustries = data.data;
  for (var i = 0; i < $scope.topIndustries.length - 5; i++) {
    var industry = data.data[i].name[0] + data.data[i].name.toLowerCase().substr(1, data.data[i].name.length - 1);
    var amount = parseInt(data.data[i].amount);
    $scope.industriesData.push([industry, amount]);
  }
  $scope.industryToggle = true;
  $scope.IndustryChartConfig = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      backgroundColor:'rgba(0, 0, 0, 0)',
      style: {
        color: '#3E576F'
      }
    },
    title: {
      text: 'Top Donors by Industry',
      style: {
        color: '#f5f5f5'
      }
    },
    series: [{
      type: 'pie',
      name: 'Total Contribution',
      data: $scope.industriesData
    }],
    tooltip: {
      valuePrefix: '$',
      valueSuffix: ''
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    }
  }
});
})
    $scope.toggleLoading = function () {
      this.chartConfig.loading = !this.chartConfig.loading
    };
  });
});
