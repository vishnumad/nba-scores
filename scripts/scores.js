
// Example URL: http://stats.nba.com/stats/scoreboard/?GameDate=02/22/2018&LeagueID=00&DayOffset=0
function getScoreboardUrl(date) {
    var year = date.getFullYear();
    return 'http://stats.nba.com/stats/scoreboard/?GameDate=' +  + '&LeagueID=00&DayOffset=0';
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
