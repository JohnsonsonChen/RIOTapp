'use strict';

(function(Models, Views, Services) {
	$(document).ready(function() {
      console.log('loading...');
      var service = new Services.RiotService();
      var matchListModule = new Models.MatchListModel();

      new Views.MatchListView(matchListModule,service);

      var inputBox = document.getElementById('searchSummoner');
      inputBox.addEventListener('keydown', function(e) {
      	var value = inputBox.value;
      	//console.log(value);
        if(e.keyCode === 13) {
        	matchListModule.setSearchName(value);
        	matchListModule.update('MATCH_SEARCH_EVENT');
        }
      });
	});
})(ModelModule, ViewModule, ServiceModule);