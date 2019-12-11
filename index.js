var ig = require('instagram-scraping');
var notify = require('./notify').notify;
let hashTags = [];
let changed = false;
const __init = async (timeout, tags) => {
    hashTags = tags ? tags : [];
    let info = {};
    while (true) {
        try {
            for (let j = 0; j < hashTags.length; j++) {

                info[hashTags[j]] = info[hashTags[j]] ? info[hashTags[j]] : {
                    lastTimestamp: 0,
                };
                console.log("Scraping posts", hashTags[j]);
                ig.deepScrapeTagPage(hashTags[j]).then(result => {
                    console.dir("Got results");
                    if (result.medias)
                        if (result.medias.length > 0) {
                            if (result.medias[0].taken_at_timestamp > info[hashTags[j]].lastTimestamp) {
                                latest = result.medias[0];
                                info[hashTags[j]].lastTimestamp = result.medias[0].taken_at_timestamp;
                                changed = true;
                            }
                        }
                    if (changed) {
                        console.log("Found!");
                        let data = result.medias[0];
                        notify(data, hashTags[j]);
                    } else {
                        console.log("No new posts!");
                    }
                    changed = false;
                });
                await sleep(timeout * 1000);
            }
        } catch (ex) {
            console.log(ex);
        }
    }
}

const init = (argv) => {
    if (argv.length >= 4) {
        let tags = [];
        for (let i = 3; i < argv.length; i++)
            tags.push(argv[i]);
        __init(parseInt(argv[2].toString()), tags)
    }
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

const setTags = (tags) => {
    try {
        hashTags = tags;
        return hashTags;
    } catch (ex) {
        console.log(ex);
    }
}

const addTag = (tag) => {
    try {
        hashTags.push(tag);
        return hashTags;
    } catch (ex) {
        console.log(ex);
    }
}

const getTags = () => {
    try {
        return hashTags;
    } catch (ex) {
        console.log(ex);
    }
}

const removeTag = (tag) => {
    try {
        hashTags = hashTags.filter(e => e !== tag);
        return hashTags;
    } catch (ex) {
        console.log(ex);
    }
}

//init(10, ["quantumcomputing", "pubg", "discovery", "nature"]);
module.exports = {
    init, setTags, addTag, getTags, removeTag
};