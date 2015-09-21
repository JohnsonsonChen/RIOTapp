'use strict';

/* exported ServiceModule */
/* The above comment disables the JSHint warning of ServiceModule being defined but not used. */

var ServiceModule = (function() {

    var RiotService = function() {
		this.key = '4f9a8fc1-4d37-440c-a91f-187e7a40282f';
		this.urlPrefix = 'https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/';
    this.championPrefix = 'https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion/';
    this.getIdPrefix = 'https://na.api.pvp.net//api/lol/na/v1.4/summoner/by-name/';
		this.summonerId = '49719602';
		this.matchHistory = {};
    this.champion = {};
	};

    _.extend(RiotService.prototype, {
      queryMatch: function(callback_ftn) {
        var self = this;
        var riotUrl = self.urlPrefix + self.summonerId + '/recent?api_key=' + self.key;
        console.log(riotUrl);

        $.ajax({
        	url: riotUrl,
        	success: function(result) {
        	  this.queryResult = result.games;
            self.matchHistory[self.summonerId] = this.queryResult;
        	  callback_ftn(this.queryResult);
            return this.queryResult;
        	},
        	error: function() {
        	  callback_ftn(new Error('error when getting match history.'));
            return undefined;
        	}
        });
      },

      queryChampion: function(callback_ftn, championId) {
        var self = this;
        var championUrl = self.championPrefix + championId + '?api_key=' + self.key;
        console.log(championUrl);

        $.ajax({
          url: championUrl,
          success: function(result) {
            var queryResult = result.key;
            callback_ftn(queryResult);
            return queryResult;
          },
          error: function() {
            callback_ftn(new Error('error when getting champion name.'));
            return undefined;
          }
        });
      },

      queryId: function(callback_ftn, summonerName) {
        var self = this;
        var getIdUrl = self.getIdPrefix + summonerName + '?api_key=' + self.key;

        $.ajax({
          url: getIdUrl,
          success: function(result) {
            var queryResult = result[summonerName].id;
            callback_ftn(queryResult);
            return queryResult;
          },
          error: function() {
            callback_ftn(new Error('error when getting summoner id.'));
            return undefined;
          }

        });
      },

      setId: function(newid) {
        var self = this;
        console.log('setting new id: ' + newid);
        self.summonerId = newid;
      }
    });

	return {
      RiotService: RiotService,
    };

})();