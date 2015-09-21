'use strict';

/* exported ModelModule */
/* The above comment disables the JSHint warning of ModelModule being defined but not used. */

var ModelModule = (function() {
	var MATCHHISTORY_ADDED_TO_MATCHLIST_EVENT = 'MATCHHISTORY_ADDED_TO_MATCHLIST_EVENT';
	var MATCH_ADDED_TO_MATCHLIST_EVENT = 'MATCH_ADDED_TO_MATCHLIST_EVENT';
	var MATCH_REMOVED_FROM_MATCHLIST_EVENT = 'MATCH_REMOVED_FROM_MATCHLIST_EVENT';

	var AbstractModel = function() {
		this.listeners = [];
	};

    _.extend(AbstractModel.prototype, {
        addListener: function(listener) {
        	this.listeners.push(listener);
        },

        removeListener: function(listener) {
        	var index = this.listeners.indexOf(listener);
        	if (index !== -1) {
              this.listeners.splice(index, 1);
            }
        },

        notify: function(event) {
          _.each(this.listeners,
                function(listener) {
                listener.update(event);
                });
        },

        update: function(event) {
        	console.log('updating MatchModel');
        }
    });

    var MatchModel = function(id, championId, ipEarned, subType, winner,
                              assists,numDeaths,kills,damage,gold,timePlayed,
                              wardKilled,wardPlaced,createDate) {
    	AbstractModel.apply(this, arguments);
        this.summonerId = id;
        this.championId = championId;
        this.ipEarned = ipEarned;
        this.subType = subType;
        this.winner = winner;
        this.assists = assists;
        this.numDeaths = numDeaths;
        this.kills = kills; 
        this.damage = damage; 
        this.gold = gold; 
        this.timePlayed = timePlayed;
        this.wardKilled = wardKilled; 
        this.wardPlaced = wardPlaced;
        this.createDate = createDate;
        this.championName = '';
    };
    
    _.extend(MatchModel.prototype, AbstractModel.prototype, {
        setChampionName: function(championName) {
            var self = this;
            self.championName = championName;
        }

    });
    
    var MatchListModel = function() {
    	AbstractModel.apply(this, arguments);
        this.searchName = '';
        this.matchModels = [];
    };

    _.extend(MatchListModel.prototype, AbstractModel.prototype, {
        addMatchModel: function(matchModel) {
            console.log('adding match model');
        	var self = this;
        	self.matchModels.push(matchModel);
        	self.notify(MATCH_ADDED_TO_MATCHLIST_EVENT);
        },
        
        removeMatchModel: function(matchModel) {
        	var self = this;

        	var index = self.matchModels.indexOf(matchModel);
            if (index !== -1) {
              self.matchModels.splice(index, 1);
            }

            self.notify(MATCH_REMOVED_FROM_MATCHLIST_EVENT);
        },

        update: function(event) {
            var self = this;
            if(event === 'MATCH_SEARCH_EVENT') {
                console.log(self.getSearchName());
                self.notify('MATCH_SEARCH_EVENT');
            }
        },

        getMatchModels: function() {
        	return this.matchModels;
        },

        setSearchName: function(name) {
            var self = this;
            self.searchName = name;
        },

        getSearchName: function() {
            var self = this;
            return self.searchName;
        }
    });

    return {
    	MatchModel: MatchModel,
    	MatchListModel: MatchListModel,

        MATCHHISTORY_ADDED_TO_MATCHLIST_EVENT: 'MATCHHISTORY_ADDED_TO_MATCHLIST_EVENT',
        MATCH_ADDED_TO_MATCHLIST_EVENT: 'MATCH_ADDED_TO_MATCHLIST_EVENT',
        MATCH_REMOVED_FROM_MATCHLIST_EVENT: 'MATCH_REMOVED_FROM_MATCHLIST_EVENT'
    }    
})();