
// Example URL: http://stats.nba.com/stats/scoreboard/?GameDate=02/22/2018&LeagueID=00&DayOffset=0
function getScoreboardUrl(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if(day < 10) {
    	day = "0" + day;
    }
    if (month < 10) {
    	month = "0" + month;
    }
    return 'http://stats.nba.com/stats/scoreboard/?GameDate=' + month + "/" + day + "/" + year + '&LeagueID=00&DayOffset=0';
}

function sendScoreboard(scoreboard) {
    console.log(scoreboard);
}

// Fetch data from NBA Stats website with jsonp
$.ajax({
    url: getScoreboardUrl(new Date()),
    dataType: 'jsonp',
    jsonpCallback: 'sendScoreboard'
});
