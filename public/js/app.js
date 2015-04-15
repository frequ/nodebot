(function(){
    'use strict';

    var app = angular.module('hutistats', ['angularMoment', 'chartjs-directive'])

    .controller('MainController', function($scope, $http, $log, $location, $anchorScroll, $timeout){
        $scope.error = "";
        $scope.statsChart = {};
        $scope.statsChart.data = {
            labels: [],
            datasets: []
        };

        $scope.users = [];
        $scope.urls = [];

        $scope.view = 'main';
        $scope.showMain = true;
        $scope.showLive = false;

        $scope.limitNicks = 5;
        $scope.limitUrls = 5;

        $scope.showMoreNicksButton = function(){
            if( $scope.users.length > $scope.limitNicks ){
                return true;
            }else{
                return false;
            }
        };

        $scope.showMoreUrlsButton = function(){
            if( $scope.urls.length > $scope.limitUrls ){
                return true;
            }else{
                return false;
            }
        };

        $scope.showMoreNicks = function(){
            $scope.limitNicks = $scope.limitNicks + 5;
        };

        $scope.showMoreUrls = function(){
            $scope.limitUrls = $scope.limitUrls + 5;
        };

        $scope.showView = function(view){
            $scope.view = view;
            if(view === 'main'){
                $scope.showMain = true;
                $scope.showLive = false;
            }else{
                $scope.showMain = false;
                $scope.showLive = true;
            }

        };

        $scope.getAPI = function(){
            var promise = $http.get('/api/stats');
            promise
            .success(function(data, status, headers, config){
                $log.info('got data from api', data);
                var channels = data;


                var times = [];
                if (Object.keys(data).length !== 0){
                    $scope.gotData = true;
                    for (var channel in channels) {

                        //TODO: handle multiple channels
                        $scope.channel = channel;

                        var channelObj = channels[channel];
                        for(var item in channelObj){

                            if( Object.prototype.toString.call( channelObj[item] ) === '[object Array]' ){
                                //times and urls


                                if( channelObj[item] && typeof channelObj[item][0] !== "number" ){
                                    //urls
                                    $scope.urls.push(channelObj[item]);
                                }else{
                                    //times
                                    times.push(channelObj[item]);
                                }

                            }else{


                                $log.log(channelObj[item], typeof channelObj[item] === "string");
                                if( typeof channelObj[item] === "string" ){
                                    //moment
                                    $scope.loggingStarted = moment(channelObj[item]);
                                }else{
                                    //users
                                    $scope.users.push(channelObj[item]);
                                }
                            }
                        }

                        $scope.urls = $scope.urls[0];
                    }
                }else{
                    $scope.gotData = false;
                    $scope.error = "There is no data yet.";
                }

                // $log.log('urls', $scope.urls);
                // $log.log('users', $scope.users);
                // $log.log('times', times[0]);

                if(times[0]){
                    $scope.initChart(times[0]);
                }


            })
            .error(function(data, status, headers, config){
                $log.warn('error fetching data from api', data);
                $scope.error = "Error fetching data from api";
            });


        };

        $scope.initChart = function(times){

            var chartData = [];
            var chartLabels = [];

            for(var i = 0; i < times.length; i++){
                chartLabels.push(i);
                chartData.push(times[i]);
            }

            var data = {
                labels: chartLabels,
                datasets: [{
                    fillColor : "rgba(151,187,205,0.5)",
                    strokeColor : "rgba(151,187,205,1)",
                    pointColor : "rgba(151,187,205,1)",
                    pointStrokeColor : "#fff",
                    data: chartData
                }]
            };

            Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%>-<%=label+1%> <%}%>Lines: <%= value %>";
            $scope.statsChart.data = data;

        };


    });

})();
