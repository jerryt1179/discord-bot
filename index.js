const Discord = require('discord.js');
const TeemoJS = require('teemojs');
const bot = new Discord.Client();
const ytdl = require('ytdl-core');
const puppeteer = require("puppeteer");
const jsonfile = require("jsonfile");
const fs = require("fs-extra");

const apiKEY = 'RGAPI-7e8d0fb4-644c-479e-ab63-9c61d9b51a81';
const PREFIX = '!';

let api = TeemoJS(apiKEY);

let servers = {};

let tier, rank, summonerName, leaguePoints, wins, losses, winRatio, test, summonerID;
let myTier, myRank, mySummonerName, myLP, myWins, myLosses, myWinRatio, myTest;
let isRanked;

//TODO: MAKE CATCH IF PLAYER NAME NOT FOUND

const mySumID = 'G7cay7vHnHmOBa7IpmZZemXD36yvgE-FrDSTZ3KB4XiZjzA';
//accountID = 6sJwfULlhVRg6mh2O668QMAwLTTL7v2d3U14hSuU5_EJIiE
//puuid = frc0S23IyP-CoJ2FBIYfmx3PjaOBlxh_JDQLigoxgUIqkuUOgcXeTbQfdoBa-p0SCTkAehovUdUCZg

const token = 'NzA4NDk2MzE3OTYxMjA3OTA5.Xw-r1Q.Nh5dYPMNby6mqGfLZ3iMJCu9bx0';

async function getData(sumID) {
    api.get('na1', 'league.getLeagueEntriesForSummoner', sumID)
    .then(data => {
        //console.log("Logging data: " + JSON.stringify(data));
        //console.log(JSON.stringify(data[0].queueType));
        //console.log(JSON.stringify(data[1].queueType));
        //TODO: IF STATEMENT TO CHECK IF RANKED OR NOT
        if(data == undefined || data.length == 0) {
            isRanked = false;
            //console.log("isRanked: " + isRanked);
            console.log("Player is unranked");
        }
        else {
            console.log("Before queuetype");
            if(data[0].queueType == 'RANKED_SOLO_5x5') {
                //console.log("isRanked: " + isRanked);
                isRanked = true;
                tier = data[0].tier;
                rank = data[0].rank;
                summonerName = data[0].summonerName;
                leaguePoints = data[0].leaguePoints;
                wins = data[0].wins;
                losses = data[0].losses;
                test = wins/ (wins + losses);
                winRatio = Math.round(test * 100) / 100;
                // console.log("What is summonerName (inside get): " + summonerName);
                // console.log("What is rank (inside get): " + tier);
            }
            else {
                isRanked = true;
                tier = data[1].tier;
                rank = data[1].rank;
                summonerName = data[1].summonerName;
                leaguePoints = data[1].leaguePoints;
                wins = data[1].wins;
                losses = data[1].losses;
                test = wins/ (wins + losses);
                winRatio = Math.round(test * 100) / 100;
                // console.log("Inside data[1] if was flex ranked");
                // console.log("What is summonerName (inside get): " + summonerName);
                // console.log("What is rank (inside get): " + tier);
            }
        }
    }
    );
}

async function getSumID(sumName) {
    api.get('na1', 'summoner.getBySummonerName', sumName)
                .then(data => { 
                    summonerID = data.id;
                })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const rankImages = {
    'iron': [
        {'name': '4', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/7/70/Season_2019_-_Iron_4.png/revision/latest/scale-to-width-down/130?cb=20181229234928'},
        {'name': '3', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/9/95/Season_2019_-_Iron_3.png/revision/latest/scale-to-width-down/130?cb=20181229234927'},
        {'name': '2', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/5/5f/Season_2019_-_Iron_2.png/revision/latest/scale-to-width-down/130?cb=20181229234927'},
        {'name': '1', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/0/03/Season_2019_-_Iron_1.png/revision/latest/scale-to-width-down/130?cb=20181229234926'}
    ],
    'bronze': [
        {'name': '4', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/5/5a/Season_2019_-_Bronze_4.png/revision/latest/scale-to-width-down/130?cb=20181229234913'},
        {'name': '3', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/8/81/Season_2019_-_Bronze_3.png/revision/latest/scale-to-width-down/130?cb=20181229234912'},
        {'name': '2', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/a/ac/Season_2019_-_Bronze_2.png/revision/latest/scale-to-width-down/130?cb=20181229234911'},
        {'name': '1', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/f/f4/Season_2019_-_Bronze_1.png/revision/latest/scale-to-width-down/130?cb=20181229234910'}
    ], 
    'silver': [
        {'name': '4', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/5/52/Season_2019_-_Silver_4.png/revision/latest/scale-to-width-down/130?cb=20181229234938'},
        {'name': '3', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/1/19/Season_2019_-_Silver_3.png/revision/latest/scale-to-width-down/130?cb=20181229234937'},
        {'name': '2', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/5/56/Season_2019_-_Silver_2.png/revision/latest/scale-to-width-down/130?cb=20181229234936'},
        {'name': '1', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/7/70/Season_2019_-_Silver_1.png/revision/latest/scale-to-width-down/130?cb=20181229234936'}
    ],
    'gold': [
        {'name': '4', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/c/cc/Season_2019_-_Gold_4.png/revision/latest/scale-to-width-down/130?cb=20181229234922'},
        {'name': '3', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/a/a6/Season_2019_-_Gold_3.png/revision/latest/scale-to-width-down/130?cb=20181229234921'},
        {'name': '2', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/8/8a/Season_2019_-_Gold_2.png/revision/latest/scale-to-width-down/130?cb=20181229234921'},
        {'name': '1', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/9/96/Season_2019_-_Gold_1.png/revision/latest/scale-to-width-down/130?cb=20181229234920'}
    ],
    'plat': [
        {'name': '4', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/a/ac/Season_2019_-_Platinum_4.png/revision/latest/scale-to-width-down/130?cb=20181229234934'},
        {'name': '3', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/2/2b/Season_2019_-_Platinum_3.png/revision/latest/scale-to-width-down/130?cb=20181229234934'},
        {'name': '2', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/a/a3/Season_2019_-_Platinum_2.png/revision/latest/scale-to-width-down/130?cb=20181229234933'},
        {'name': '1', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/7/74/Season_2019_-_Platinum_1.png/revision/latest/scale-to-width-down/130?cb=20181229234932'}
    ],
    'diamond': [
        {'name': '4', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/e/ec/Season_2019_-_Diamond_4.png/revision/latest/scale-to-width-down/130?cb=20181229234919'},
        {'name': '3', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/d/dc/Season_2019_-_Diamond_3.png/revision/latest/scale-to-width-down/130?cb=20181229234918'},
        {'name': '2', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/7/70/Season_2019_-_Diamond_2.png/revision/latest/scale-to-width-down/130?cb=20181229234918'},
        {'name': '1', 'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/9/91/Season_2019_-_Diamond_1.png/revision/latest/scale-to-width-down/130?cb=20181229234917'}
    ],
    'master': [
        {'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/0/01/Season_2019_-_Master_4.png/revision/latest/scale-to-width-down/130?cb=20181229234931'}
    ],
    'gm': [
        {'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/4/42/Season_2019_-_Grandmaster_4.png/revision/latest/scale-to-width-down/130?cb=20181229234925'}
    ],
    'challenger': [
        {'url': 'https://vignette.wikia.nocookie.net/leagueoflegends/images/e/e3/Season_2019_-_Challenger_4.png/revision/latest/scale-to-width-down/130?cb=20181229234916'}
    ]
}

//TODO: MAKE THIS BETTER
function getRankIcon(tier_, rank_) {
    console.log("Getting rank icon");
    if(tier_ == 'IRON') {
        if(rank_ == 'IV') {
            return rankImages.iron[0].url;
        }
        else if(rank_ == 'III') {
            return rankImages.iron[1].url;
        }
        else if(rank_ == 'II') {
            return rankImages.iron[2].url;
        }
        else if(rank_ == 'I') {
            return rankImages.iron[3].url;
        }
    }
    else if(tier_ == 'BRONZE') {
        if(rank_ == 'IV') {
            return rankImages.bronze[0].url;
        }
        else if(rank_ == 'III') {
            return rankImages.bronze[1].url;
        }
        else if(rank_ == 'II') {
            return rankImages.bronze[2].url;
        }
        else if(rank_ == 'I') {
            return rankImages.bronze[3].url;
        }
    }
    else if(tier_ == 'SILVER') {
        if(rank_ == 'IV') {
            return rankImages.silver[0].url;
        }
        else if(rank_ == 'III') {
            return rankImages.silver[1].url;
        }
        else if(rank_ == 'II') {
            return rankImages.silver[2].url;
        }
        else if(rank_ == 'I') {
            return rankImages.silver[3].url;
        }
    }
    else if(tier_ == 'GOLD') {
        console.log("In gold");
        if(rank_ == 'IV') {
            return rankImages.gold[0].url;
        }
        else if(rank_ == 'III') {
            return rankImages.gold[1].url;
        }
        else if(rank_ == 'II') {
            return rankImages.gold[2].url;
            console.log("In gold 2");
        }
        else if(rank_ == 'I') {
            return rankImages.gold[3].url;
        }
    }
    else if(tier_ == 'PLATINUM') {
        if(rank_ == 'IV') {
            return rankImages.plat[0].url;
        }
        else if(rank_ == 'III') {
            return rankImages.plat[1].url;
        }
        else if(rank_ == 'II') {
            return rankImages.plat[2].url;
        }
        else if(rank_ == 'I') {
            return rankImages.plat[3].url;
        }
    }
    else if(tier_ == 'DIAMOND') {
        if(rank_ == 'IV') {
            return rankImages.diamond[0].url;
        }
        else if(rank_ == 'III') {
            return rankImages.diamond[1].url;
        }
        else if(rank_ == 'II') {
            return rankImages.diamond[2].url;
        }
        else if(rank_ == 'I') {
            return rankImages.diamond[3].url;
        }
    }
    else if(tier_ == 'MASTER') {
        return rankImages.master[0].url;
    }
    else if(tier_ == 'GRANDMASTER') {
        return rankImages.gm[0].url;
    }
    else {
        return rankImages.challenger[0].url;
    }
}

bot.on('ready', () => {
    console.log('The bot is online.');
})

bot.on('message', msg => {
    //console.log("Runs everytime message is sent");
    //console.log(rankImages.bronze[0].url);

    if (msg.content == "Hello") {
        msg.channel.send("jc no")
    }
    //let args = msg.content.substring(PREFIX.length).split(" ");
    if(!msg.content.startsWith(PREFIX) || msg.author.bot) return;

    const args = msg.content.slice(PREFIX.length).split(/ +/);

    console.log("This is args: " + args);

    switch(args[0]) {
        // case 'play':
        //     function play(connection, message) {
        //         var server = servers[message.guild.id];
        //         server.dispatcher = connection.play(ytdl(server.queue[0], {filter: 'audioonly'}));

        //         server.queue.shift();

        //         server.dispatcher.on('finish', function() {
        //             if(server.queue[0]) {
        //                 play(connection, message);
        //             }
        //             else {
        //                 connection.disconnect();
        //             }
        //         })
        //     }

        //     if(!args[1]) {
        //         msg.channel.send('give a YouTube link boi');
        //         return;
        //     }

        //     if(!msg.member.voice.channel) {
        //         msg.channel.send("You gotta be in a channel for me to play bro");
        //         return;
        //     }

        //     if(!servers[msg.guild.id]) servers[msg.guild.id] = {
        //         queue: []
        //     }

        //     let validate = ytdl.validateURL(args[1]);
        //     if(!validate) {
        //         msg.channel.send("I only use YouTube links buddy");
        //         return;
        //     }

        //     var server = servers[msg.guild.id];

        //     server.queue.push(args[1]);

        //     if(!msg.member.voice.connection) msg.member.voice.channel.join().then(function(connection) {
        //             play(connection, msg);
        //         })

        //     break;

        // case 'skip':
        //     var server = servers[msg.guild.id];
        //         if(server.dispatcher) server.dispatcher.end();
        // break;

        // case 'stop':
        //     var server = servers[msg.guild.id];
        //     if(msg.guild.voice.connection) {
        //         for(var i = server.queue.length - 1; i >=0; i--) {
        //             server.queue.splice(i,1);
        //         }

        //         server.dispatcher.end();
        //         console.log('stopping the queue');
        //     }

        // break;

        case 'play':
            // 768550928776560660 channel id for test music channel
            // 766542860144082975 channel id for actual server music channel
            if (msg.channel.id != 766542860144082975) {
                msg.channel.send("put that shit in the music channel bro")
            }

            break;
        // FIXME: Fix your goddamn chegg feature 
        
        // case 'chegg':
        //     // console.log("Args0: " + args[0]);
        //     // console.log("Args1: " + args[1]);
        //     if(!args[1]) {
        //         msg.channel.send('try again buddy');
        //         return;
        //     }
        //     (async () => {
        //         const browser = await puppeteer.launch({
        //             headless: false,
        //             executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        //             //args: ['--user-data-dir=C:\\Users\\Tran\\AppData\\Local\\Google\\Chrome\\User Data\\Default']
        //             //args: ['--user-data-dir=botUser']
        //             userDataDir: 'botUser'
        //         });

        //         const page = await browser.newPage();

        //         let cookiesFilePath = 'cookies.json';
        //         const cookiesPath = 'cookies.txt';

        //         // If the cookies file exists, read the cookies.
        //         const previousSession = fs.existsSync(cookiesPath);
        //         console.log("PreviousSession: " + previousSession);
        //         if (previousSession) {
        //             const content = fs.readFileSync(cookiesPath);
        //             const cookiesArr = JSON.parse(content);
        //             if (cookiesArr.length !== 0) {
        //                 for (let cookie of cookiesArr) {
        //                 await page.setCookie(cookie)
        //                 }
        //                 console.log('Session has been loaded in the browser')
        //             }
        //         }

        //         // Write Cookies
        //         const cookiesObject = await page.cookies()
        //         console.log("CookiesObject: " + JSON.stringify(cookiesObject));
        //         fs.writeFileSync(cookiesPath, JSON.stringify(cookiesObject));
        //         console.log('Session has been saved to ' + cookiesPath);

        //         // // Save Session Cookies
        //         // const cookiesObject = await page.cookies();
        //         // // Write cookies to temp file to be used in other profile pages
        //         // jsonfile.writeFile(cookiesFilePath, cookiesObject, { spaces: 2 },
        //         //     function(err) { 
        //         //         if (err) {
        //         //             console.log('The file could not be written.', err);
        //         //         }
        //         //     console.log('Session has been successfully saved');
        //         // });


        //         // const previousSession = fs.existsSync(cookiesFilePath);
        //         // if (previousSession) {
        //         //     // If file exist load the cookies
        //         //     const cookiesArr = require(`${cookiesFilePath}`)
        //         //     if (cookiesArr.length !== 0) {
        //         //         for (let cookie of cookiesArr) {
        //         //         await page.setCookie(cookie)
        //         //         }
        //         //         console.log('Session has been loaded in the browser')
        //         //         return true
        //         //     }
        //         // }
        //         console.log("Before goto");
        //         await page.goto(args[1], {
        //             waitUntil: "networkidle2"
        //         });
                
        //         console.log("Before setview");
        //         await page.setViewport({ width: 480, height: 480 });

        //         await page.screenshot({path: "chegg.png", fullPage: true});
        //         console.log("Finished");
        //         await browser.close();
        //         msg.channel.send("Here you go Dave. If any popups happen then redo command", {files: ["chegg.png"]});
        //     })();
        //     break;

        case 'ping':
            msg.channel.send('dont ping me')
            break;
        case 'commands':
            msg.channel.send('Find your own commands')
            break;

        //TODO: Delete number of messages and past 10 ask if they want to
        case 'del':
            if (!args[1]) {
                msg.channel.send("Give me an amount brother");
            }
            let delAmount = parseInt(args[1], 10);
            if (delAmount >= 15) {
                msg.channel.send("Bro you don't need to delete 15 or more messages");
            }
            else {
                msg.channel.bulkDelete(delAmount + 1).catch(console.error);
            }
            break;
        // case 'mmr':
        //     msg.channel.send("$mmr")
        //     break;
        // case 'mu':
        //     msg.channel.send("$mu")
        //     break;
        // case 'wa':
        //     msg.channel.send("$wa")
        //     break;
        // case 'fuckyoudave':
        //     msg.channel.send('yeah fuck you dave')
        //     break;
        case 'react':
            const amount = (parseInt(msg.content.split(' ')[1])) + 1;
            msg.channel.fetch({
                limit: amount,
            }).then((messages) => {
                console.log("Amount: " + amount);
                let i = 0;
                // console.log("Messages: " + messages);
                // console.log("Messages type: " + typeof messages);
                // console.log("What is inside Messages: " + JSON.stringify(messages));
                // console.log("Inside message[1]: " + messages[0]);
                for (let key in messages) {
                    i++;
                    if (i == amount) {
                        console.log("Amount: " + amount);
                        msg.react("💖").catch(console.error);
                    }
                    //console.log(key, messages[key]);
                }
            });
            // msg.channel.fetch().then(async messages => {
            //     console.log(`${messages.size} procuradas.`);
            // });

            break;

        case 'lolrank':
            if (!args[1]) {
                (async () => {
                    //console.log("After async function");
                    await getData(mySumID);
                    await sleep(500);

                    //console.log("What is tier (after await)?: " + tier);
                    const rankEmbed = new Discord.MessageEmbed()
                    .setTitle(summonerName)
                    .addField(tier + " " + rank, leaguePoints + " LP" )
                    .addField(wins + "W " + losses + "L", 'Winratio: '+ winRatio)
                    .setColor(0xF1C40F)
                    //.setThumbnail(getRankIcon(tier, rank))
                    .setThumbnail(rankImages.gold[1].url) //hard coded image
                    msg.channel.send('<:pepeLaugh:733522012001271888> ' + ':point_down:');
                    msg.channel.send(rankEmbed);
                })();
                    
            }
            else { 
                    (async () => {
                        await getSumID(args[1]);
                        await sleep(500);
                        //console.log("SummonerID after await: " + summonerID);
                        await getData(summonerID);
                        await sleep(500);
                        //console.log("What is tier after await (player): " + tier);
    
                        console.log("isRanked inside else: " + isRanked);
                        if (!isRanked) {
                            //console.log("isRanked inside !isRanked check: " + isRanked);
                            msg.channel.send('This player is not ranked and is beta');
                        }
                        else {
                            const rankEmbed = new Discord.MessageEmbed()
                            .setTitle(summonerName)
                            .addField(tier + " " + rank, leaguePoints + " LP" )
                            .addField(wins + "W " + losses + "L", 'Winratio: '+ winRatio)
                            .setColor(0xF1C40F)
                            .setThumbnail(getRankIcon(tier, rank))
                            msg.channel.send('<:pepeLaugh:733522012001271888> ' + ':point_down:');
                            msg.channel.send(rankEmbed);
                        }
                    })();
            }
            break;
    }

})

bot.login(token);
