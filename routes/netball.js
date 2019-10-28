const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

const FIXTURES_URL = process.env.FIXTURES_URL;
const TEAM_NAME = process.env.TEAM_NAME;

const TIMESTRINGS = {
    "12:00 PM": "T12:00+11:00",
    "12:30 PM": "T12:30+11:00",
    "1:00 PM": "T13:00+11:00",
    "1:30 PM": "T13:30+11:00",
    "6:00 PM": "T18:00+11:00",
    "6:30 PM": "T18:30+11:00",
    "7:00 PM": "T19:00+11:00",
    "7:30 PM": "T19:30+11:00",
    "8:00 PM": "T20:00+11:00",
    "8:30 PM": "T20:30+11:00"
};

/*
    Get full list of rounds, including name (Round 1, Round 2, Semi-Final etc.), date and determine if there is a game
 */
function getRounds($) {
    const els = $('h3.active');
    const rounds = [];

    els.each((i, el) => {
        const re = /(.*) — (.*)/g.exec($(el).text());
        const date = re[1], name = re[2];
        const hasGame = /(no game|Rained out)/.exec($(el).text()) === null;

        rounds.push({
            name: name,
            date: date,
            hasGame: hasGame
        });

    });

    return rounds;
}

/*
    Get relevant game details for each round
 */
function getGameDetails($, rounds) {
    const els = $(`ul:has(span:contains(${TEAM_NAME}))`);
    let i = 0;

    els.each((index, el) => {
        const re = /([0-9]+)-([0-9]+)-([0-9]+)/g.exec(rounds[i].date);
        const day = re[1], month = re[2], year = re[3];
        const time = $(el).find('li.fxtT').text();

        rounds[i].opponent = $(el).find('span').filter((j, elChild) => $(elChild).text() !== TEAM_NAME).first().text();
        rounds[i++].date = new Date(year + "-" + month + "-" + day + TIMESTRINGS[time]);
        if (!rounds[i].hasGame) i++;
    });

    return rounds;
}

/*
    Determine the current (i.e. the next occurring) round
 */
function getCurrentRound(rounds) {
    let now = new Date();
    let currRound = -1;
    for (let i = 0; i < rounds.length; i++) {
        if (new Date(rounds[i].date) >= now) {
            currRound = i;
            break;
        }
    }
    return currRound;
}

/*
    Get the team's current rank, and the rank of their next opponent
 */
function getRankings($, opponentName) {
    const home = $(`ul:has(li.ldrLg:contains(${TEAM_NAME}))`).find('li.ldrSm').first().text();
    const opponent = $(`ul:has(li.ldrLg:contains(${opponentName}))`).find('li.ldrSm').first().text();

    return ({home, opponent});
}

router.get('/', async (req, res) => {
    let $;

    axios.get(FIXTURES_URL)
        .then(response => {
            $ = cheerio.load(response.data);
            return getRounds($);
        }).then(rounds => {
            return getGameDetails($, rounds);
        }).then(rounds => {
            const currRound = getCurrentRound(rounds);
            return ({currRound, rounds});
        }).then(data => {
            data.ranks = getRankings($, data.rounds[data.currRound].opponent);
            res.send(data);
        });
});

module.exports = router;