require("dotenv").config({ path: __dirname + "/.env" });
const { Client, Intents } = require("discord.js");
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const auth = require("./auth.json");
const fetch = require("node-fetch");
const { ToadScheduler, SimpleIntervalJob, Task } = require("toad-scheduler");
const scheduler = new ToadScheduler();

let latestPatchTweet = new Date(2020, 11, 24, 10, 33, 30, 0);
const inclusion = "https://www.dota2.com/patches/";

client.on("message", (msg) => {
    if (msg.content === "ping") {
        msg.reply("pong!");
    }

    if (msg.content === "!patchnotes") {
        getPatchNotes();
    }
});

client.login(auth.token);

client.on("ready", readyDiscord);

function readyDiscord() {
    console.log("❤");

    const task = new Task("Fetch tweets", getPatchNotes, (error) =>
        console.log(error)
    );
    const job = new SimpleIntervalJob({ minutes: 7 }, task);
    scheduler.addSimpleIntervalJob(job);
}

let myHeaders = new fetch.Headers();
myHeaders.append("Authorization", `Bearer ${auth.twitterBearerToken}`);

let requestOptions = {
    method: "GET",
    headers: myHeaders,
};

function getPatchNotes() {
    fetch(
        `https://api.twitter.com/2/users/${auth.userIdTest}/tweets?tweet.fields=entities,created_at`,
        requestOptions
    )
        .then((response) => response.json())
        .then((json) => {
            json.data.forEach((tweet) => {
                if (tweet.entities.urls) {
                    tweet.entities.urls.forEach((url) => {
                        console.log(latestPatchTweet);
                        console.log(Date.parse(tweet.created_at));
                        if (
                            url.expanded_url.includes(inclusion) &&
                            Date.parse(tweet.created_at) >
                                Date.parse(latestPatchTweet)
                        ) {
                            postPatchNotes(url.expanded_url);
                            latestPatchTweet = tweet.created_at;
                        }
                    });
                }
            });
        });
}
function postPatchNotes(url) {
    client.channels.cache
        .get(auth.channelIdTest)
        .send("🔥💯🔥 New patch! 🔥💯🔥" + "\n" + url + "\n" + "@everyone");
}
