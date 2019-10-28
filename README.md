# sports-stats

This Node.js app scrapes the [Intrinsic Sports netball stats web page](https://www.intrinsicsports.com.au/is/sports/view/15) to retrieve information about season fixtures, current rankings and the next upcoming game.

## Usage

```
$ export FIXTURES_URL="LINK TO WEB PAGE" && export TEAM_NAME="HOME TEAM NAME" && npm run start
```

## Example

```
$ export FIXTURES_URL=https://www.intrinsicsports.com.au/is/competitions/full/854 && export TEAM_NAME=Dazzlers && npm run start
```

Given a link to the web page, and a team name, the app scrapes the page to generate the following example JSON object, accessible at the `/stats/netball` endpoint:

```metadata json
{
    "currRound": 5,
    "rounds": [
        {
            "name": "Round 1",
            "date": "2019-09-24T08:00:00.000Z",
            "hasGame": true,
            "opponent": "Fast Not Furious"
        },
        {
            "name": "Rained out ... Games rescheduled to December 3",
            "date": "08-10-2019",
            "hasGame": false
        },
        ...
        {
            "name": "Semi Finals",
            "date": "10-12-2019",
            "hasGame": true
        },
        {
            "name": "FINALS",
            "date":"17-12-2019",
            "hasGame":true
        }],
    "ranks": {
        "home": "6",
        "opponent":"7"
    }
}
```