const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

const movies = ["https://www.imdb.com/title/tt6751668/?ref_=hm_fanfav_tt_1_pd_fp1",
                "https://www.imdb.com/title/tt7286456/?ref_=hm_fanfav_tt_2_pd_fp1",
                "https://www.imdb.com/title/tt8228288/?ref_=hm_fanfav_tt_4_pd_fp1",
                ];

(async ()=> {
    let imdbData = [];
   for(let movie of movies){
    const response = await request({
        uri: movie,
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9"},
        gzip: true,
    });

    let $ = cheerio.load(response);
    let title = $('div[class="title_wrapper"] > h1').text().trim();
    let rating = $('div[class="ratingValue"] > strong > span').text();
    let plot = $('div[class="summary_text"]').text().trim();
    let release = $('a[title="See more release dates"]').text().trim();

    imdbData.push({title, rating, plot, release}); 
   }
    const js2c = new json2csv();

    
    const csv = js2c.parse(imdbData);
    fs.writeFileSync("./imdb.csv", csv, "utf-8");
     

})();




