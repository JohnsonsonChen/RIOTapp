'use strict';

/* exported ViewModule */
/* The above comment disables the JSHint warning of ViewModule being defined but not used. */

var ViewModule = (function(MatchModel) {
  
  var AbstractView = function(model) {
    this.model = model;
    this.model.addListener(this);
  };

  _.extend(AbstractView.prototype, {
    init: function() {
      console.log('init AbstractView');
    }, 

    update: function(event) {
      console.log('update AbstractView ' + event);
    },
  });

  var MatchListView = function(model,RiotService) {
  	AbstractView.apply(this, arguments);
  	this.riotService = RiotService;
    this.tempParent;
    this.init();
  }

  _.extend(MatchListView.prototype, AbstractView.prototype, {
  	init: function() {
  		var self = this;
  		this.element = document.getElementById('matchHistory');
      /*self.appendSummoner('unsignedinteger');
  		self.riotService.queryMatch(function(result) {
          _.each(result, function(match){
          	var iD = 'unsignedinteger';
          	var championId = match.championId;
            var ipEarned = match.ipEarned;
            var subType = match.subType;
            var dateNow = new Date(match.createDate);
            var createDate = dateNow.toDateString() + ' ' + dateNow.toLocaleTimeString();

          	var winner = match.stats.win;
            var assists = match.stats.assists;
            var numDeaths = match.stats.numDeaths;
            var kills = match.stats.championsKilled;
            var damage = match.stats.totalDamageDealtToChampions;
            console.log(match.stats);
            var gold = match.stats.goldEarned;
            var timePlayed = match.stats.timePlayed;
            var wardKilled = match.stats.wardKilled;
            var wardPlaced = match.stats.wardPlaced;

            var championName;
            var matchModel = new MatchModel(iD,championId,ipEarned,subType,winner,
                                             assists,numDeaths,kills,damage,gold,
                                             timePlayed,wardKilled,wardPlaced,createDate);

            self.riotService.queryChampion(function(result) {
              championName = result;
              matchModel.setChampionName(championName);
            }, championId);
            console.log(matchModel);
          	self.model.addMatchModel(matchModel);
          })  
  		});*/
  	},

  	update: function(event) {
  		var self = this;
  		if(event === 'MATCH_ADDED_TO_MATCHLIST_EVENT') {
        var len = self.model.matchModels.length;
        var championId = self.model.matchModels[len - 1].championId;

        self.riotService.queryChampion(function(result) {
          var championName = result;
          console.log(championName);
          self.model.matchModels[len - 1].setChampionName(championName);
          self.appendMatch(self.model.matchModels[len - 1]);
        }, championId);

  		}

      else if(event === 'MATCH_SEARCH_EVENT') {
        var searchName = self.model.getSearchName();
        self.appendSummoner(searchName);

        self.riotService.queryId(function(result) {
          console.log(result);
          self.riotService.setId(result);

          self.riotService.queryMatch(function(result) {
            _.each(result, function(match){
              var iD = searchName;
              var championId = match.championId;
              var ipEarned = match.ipEarned;
              var subType = match.subType;
              var dateNow = new Date(match.createDate);
              var createDate = dateNow.toDateString() + ' ' + dateNow.toLocaleTimeString();

              var winner = match.stats.win;
              var assists = match.stats.assists;
              var numDeaths = match.stats.numDeaths;
              var kills = match.stats.championsKilled;
              var damage = match.stats.totalDamageDealtToChampions;
              var gold = match.stats.goldEarned;
              var timePlayed = match.stats.timePlayed;
              var wardKilled = match.stats.wardKilled;
              var wardPlaced = match.stats.wardPlaced;
              var championName;
              var matchModel = new MatchModel(iD,championId,ipEarned,subType,winner,
                                              assists,numDeaths,kills,damage,gold,
                                              timePlayed,wardKilled,wardPlaced,createDate);

              self.riotService.queryChampion(function(result) {
                championName = result;
                matchModel.setChampionName(championName);
              }, championId);
              console.log(matchModel);
              self.model.addMatchModel(matchModel);
            })
          });
        },searchName);
      }
  	},

  	appendMatch: function(matchModel) {
  	   var self = this;
       var iD = matchModel.summonerId;
       var championName = matchModel.championName;
       if(championName === 'MonkeyKing') championName = 'Sun Wukong'
       var ipEarned = matchModel.ipEarned;
       var subType = matchModel.subType;
       var winner = matchModel.winner;
       var createDate = matchModel.createDate;

       var assists = matchModel.assists;
       if(!assists) assists = 0;

       var kills = matchModel.kills;
       if(!kills) kills = 0;

       var numDeaths = matchModel.numDeaths; 
       if(!numDeaths) numDeaths = 0;

       var damage = matchModel.damage;
       if(!damage) damage = 0; 

       var gold = matchModel.gold;
       if(!gold) gold = 0; 

       var timePlayed = matchModel.timePlayed;
       var min = Math.floor(timePlayed / 60);
       var sec = timePlayed % 60;

       var wardKilled = matchModel.wardKilled;
       if(!wardKilled) wardKilled = 0; 

       var wardPlaced = matchModel.wardPlaced;
       if(!wardPlaced) wardPlaced = 0;

       var singleClass = ' single_match' + '_' + iD;
       var singleMatch = document.createElement('div');
       singleMatch.setAttribute('class','single_match');
       singleMatch.className += singleClass;
       singleMatch.setAttribute('id', iD);
       var gameType = '';
       var result = '';
       console.log('l' + subType + 'l');
       switch(subType) {
        case 'CAP_5x5' :
          gameType = 'Team Builder';
          break;
        case 'BILGEWATER' :
          gameType = 'BILGEWATER'
          break;
        case 'BOT':
          gameType = 'Bot Game';
          break;
        case 'NORMAL':
          gameType = 'Normal';
          break;
        case 'ARAM_UNRANKED_5x5':
          gameType = 'ARAM';
          break;
        case 'NONE':
          gameType = 'Custom';
          break;
        case 'RANKED_SOLO_5x5':
          gameType = 'Ranked Game';
          break;
       }
       if (winner) {
        result = 'WIN';
       }
       else if(!winner) {
        result = 'LOSE';
       }
       singleMatch.innerHTML = 'Date Created: ' + createDate + '<br />' +
                               'GameType: ' + gameType  + '<br />' +
                               'TimePlayed: ' + min + 'm' + sec + 's' + '<br />' +
                               'Champion: ' + championName + '<br />' +
                               'KDA: ' + kills + '/' + numDeaths + '/' + assists + '<br />' + 
                               'Damage Dealt to Champion: ' + damage + '<br />' +
                               'Gold: ' + gold + '<br />' +
                               'WardPlaced: ' + wardPlaced + ' WardKilled: ' + wardKilled + '<br />' +
                               'IP: ' + ipEarned + '<br />' +
                               'Result: ' + result;
       var tParent = self.tempParent;
       tParent.appendChild(singleMatch);
  	},

    appendSummoner: function(name) {
       var self = this;
       var summonerNameDiv = document.createElement('div');
       var deleteButton = document.createElement('BUTTON');
       var t = document.createTextNode('delete');
       var toggleButton = document.createElement('BUTTON');
       var t1 = document.createTextNode('toggle');
       var buttonDiv = document.createElement('div');

       deleteButton.setAttribute('class','delete_button');
       deleteButton.setAttribute('id',name);
       deleteButton.appendChild(t);

       toggleButton.setAttribute('class', 'toggle_button');
       toggleButton.setAttribute('id',name); 
       toggleButton.appendChild(t1);

       buttonDiv.setAttribute('class','button');      

       summonerNameDiv.setAttribute('class','summoner_name');
       summonerNameDiv.setAttribute('id',name);
       summonerNameDiv.innerHTML = 'Summoner: ' + name;
       self.tempParent = summonerNameDiv;
       self.element.appendChild(summonerNameDiv);
       self.tempParent.appendChild(buttonDiv);
       buttonDiv.appendChild(toggleButton);
       buttonDiv.appendChild(deleteButton);


       var singleClass = '.' + 'single_match_' + name;
       toggleButton.addEventListener('click', function() {
         console.log('hi');
         $(singleClass).slideToggle("slow");
       });

       deleteButton.addEventListener('click', function() {
         document.getElementById(name).remove();
       });
    },

    gettempParent: function() {
      return this.tempParent;
    }
  });

  return {
    MatchListView: MatchListView
  };
})(ModelModule.MatchModel);
