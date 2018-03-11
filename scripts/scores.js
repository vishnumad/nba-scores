
// Example URL: http://stats.nba.com/stats/scoreboard/?GameDate=02/22/2018&LeagueID=00&DayOffset=0
function getScoreboardUrl(date) {
    return 'https://stats.nba.com/stats/scoreboard/?GameDate=' + date.format("MM/DD/YYYY") + '&LeagueID=00&DayOffset=0';
}

function outputScoreboard(scoreboard) {

    var gameHeader = scoreboard['resultSets'][0]['rowSet'];
    var lineScore = scoreboard['resultSets'][1]['rowSet'];

    var gamesList= getListOfGames(gameHeader, getListOfTeams(lineScore));

    gamesList.forEach(function(game) {
        var card = $("#score-card-template").clone();

        card.attr("id", "game-" + game.gameId);

        // Game Status
        var status;
        if (game.gameStatusId == 1) {
            // Game not started
            status = convertEasternToLocal(game.gameStatus);
        } else if (game.gameStatusId == 2) {
            // Game is ongoing
            status = game.livePeriodTime;
            card.find("#away-team-score").html(game.awayTeam.pts);
            card.find("#home-team-score").html(game.homeTeam.pts);
        } else if (game.gameStatusId == 3) {
            // Game is complete
            status = game.gameStatus;
            card.find("#away-team-score").html(game.awayTeam.pts);
            card.find("#home-team-score").html(game.homeTeam.pts);
            if (game.awayTeam.pts < game.homeTeam.pts) {
                card.find("#away-team-row").attr("class", "lose");
            } else {
                card.find("#home-team-row").attr("class", "lose");
            }
        }
        card.find("#game-status").html(status.toUpperCase());

        // Team Names
        card.find("#away-team-name").html(game.awayTeam.teamName);
        card.find("#home-team-name").html(game.homeTeam.teamName);

        // Team Record
        card.find("#away-team-record").html(game.awayTeam.teamRecord);
        card.find("#home-team-record").html(game.homeTeam.teamRecord);

        // Team Logo
        card.find("#away-team-logo").attr("src", "logos/" + game.awayTeam.teamAbbr + ".png");
        card.find("#home-team-logo").attr("src", "logos/" + game.homeTeam.teamAbbr + ".png");

        card.show();

        // Add card to document
        container.append(card);
    });
}

function getListOfGames(gameHeader, teamsList) {
    var games = new Array();
    var teamCounter = 0;
    for(i = 0; i < gameHeader.length; i++) {
        var game = gameHeader[i];
        var livePeriodTime = game[12];
        livePeriodTime = livePeriodTime.substring(0, livePeriodTime.indexOf("-"));

        // Find teams in teamsList
        var awayTeam = teamsList[teamCounter];
        var homeTeam = teamsList[teamCounter + 1];

        games.push(new Game(game[2], game[3], game[4], game[5], game[6], game[7], game[9], livePeriodTime, homeTeam, awayTeam));
        teamCounter += 2;
    }
    return games;
}

function getListOfTeams(lineScore) {
    var teams = new Array();
    for(i = 0; i < lineScore.length; i++) {
        var game = lineScore[i];
        var teamAbbr = game[4];
        var teamName = TeamNameEnum[teamAbbr];

        teams.push(new Team(game[2], game[3], teamAbbr, game[5], teamName, game[6], game[21]));
    }
    return teams;
}

// Ex. input: "7:00 pm ET"
function convertEasternToLocal(time) {
    return moment.tz(moment.tz(time, "h:mm a", "America/New_York"), localTz).format("h:mm a z");
}

// Game Object
function Game(gameId, gameStatusId, gameStatus, gameCode, homeTeamId, awayTeamId, livePeriod, livePeriodTime, homeTeam, awayTeam) {
    this.gameId = gameId;
    this.gameStatusId = gameStatusId;
    this.gameStatus = gameStatus;
    this.gameCode = gameCode;
    this.homeTeamId = homeTeamId;
    this.awayTeamId = awayTeamId;
    this.livePeriod = livePeriod;
    this.livePeriodTime = livePeriodTime;
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
}

// Team Object
function Team(gameId, teamId, teamAbbr, teamCity, teamName, teamRecord, pts) {
    this.gameId = gameId;
    this.teamId = teamId;
    this.teamAbbr = teamAbbr;
    this.teamCity = teamCity;
    this.teamName = teamName;
    this.teamRecord = teamRecord;
    this.pts = pts;
}

var TeamNameEnum = Object.freeze({
    "ATL": "Hawks",
    "BOS": "Celtics",
    "BKN": "Nets",
    "CHA": "Hornets",
    "CHI": "Bulls",
    "CLE": "Cavaliers",
    "DAL": "Mavericks",
    "DEN": "Nuggets",
    "DET": "Pistons",
    "GSW": "Warriors",
    "HOU": "Rockets",
    "IND": "Pacers",
    "LAC": "Clippers",
    "LAL": "Lakers",
    "MEM": "Grizzlies",
    "MIA": "Heat",
    "MIL": "Bucks",
    "MIN": "Timberwolves",
    "NOP": "Pelicans",
    "NYK": "Knicks",
    "OKC": "Thunder",
    "ORL": "Magic",
    "PHI": "Sixers",
    "PHX": "Suns",
    "POR": "Trail Blazers",
    "SAC": "Kings",
    "SAS": "Spurs",
    "TOR": "Raptors",
    "UTA": "Jazz",
    "WAS": "Wizards"
});

var container = $("#games-container");
var localTz = moment.tz.guess();

// Fetch data from NBA Stats website with jsonp
$.ajax({
    url: getScoreboardUrl(moment()),
    dataType: 'jsonp',
    jsonpCallback: 'outputScoreboard'
});
