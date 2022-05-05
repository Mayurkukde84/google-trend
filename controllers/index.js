const path = require("path");
const googleTrends = require("google-trends-api");
// const fetch = require('node-fetch');
const { response } = require("express");
const axios = require("axios");
const https = require("https");

var options = {
  query: "IN/KANG-HO-FAN",
};
var Uspto = require("uspto");

exports.getOverTime = async (req, res) => {
  let keyword = "iphone13";

  try {
    let trendsOverTime = await googleTrends.interestOverTime({
      keyword: keyword,
      startTime: new Date("2022-01-01"),
      endTime: new Date(),
      granularTimeResolution: true,
    });

    let promRes = await trendsOverTime;

    if (!promRes) {
      return res.render("index.ejs", {
        success: false,
        data: [],
        keyword,
      });
    }

    let arrData = [];
    JSON.parse(promRes).default.timelineData.forEach((t) => {
      arrData.push({
        time: t.formattedTime,
        value: t.value,
        keyword,
      });
    });

    if (arrData.length > 0) {
      return res.render("index.ejs", {
        success: true,
        data: arrData,
      });
    }

    return res.render("index.ejs", {
      success: false,
      data: [],
    });
  } catch (error) {
    if (error) throw error;
  }
};

exports.postOverTime = async (req, res) => {
  let { start } = req.body;

  let keyword = req.body.keyword.replace(/[^\w\s]/gi, "");

  try {
    let trendsOverTime = await googleTrends.interestOverTime({
      keyword: keyword,
      startTime: new Date(start),
      endTime: new Date(),
      granularTimeResolution: true,
    });

    let promRes = await trendsOverTime;
    if (!promRes) {
      return res.render("index.ejs", {
        success: false,
        data: [],
        keyword,
      });
    }

    let arrData = [];
    JSON.parse(promRes).default.timelineData.forEach((t) => {
      arrData.push({
        time: t.formattedTime,
        value: t.value,
        keyword,
      });
    });

    if (arrData.length > 0) {
      return res.render("index.ejs", {
        success: true,
        data: arrData,
      });
    }
    // else
    return res.render("index.ejs", {
      success: false,
      data: [],
    });
  } catch (error) {
    if (error) throw error;
  }
};

exports.getDaily = async (req, res) => {
  try {
    /**
     * TRENDS RELATED DAILY
     */

    // DATE YYYY-MM-DD format
    let YYYY = new Date().getFullYear();
    let MM =
      new Date().getMonth() + 1 < 10
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1;
    let DD =
      new Date().getDate() < 10
        ? "0" + new Date().getDate()
        : new Date().getDate();
    let ymd = YYYY + "-" + MM + "-" + DD;
    // console.log(ymd);

    let trendsDaily = await Uspto.dailyTrends({
      trendDate: new Date(), // trend date
      inventionTitle: "HAND UTILITY INTERFACE", // REQUIRED US' will target United States or geo: 'FR' will target France.
      hl: "it", // optional - type string - preferred language code for results (defaults to english).
      //,resolution: 'CITY'
      // ,geo: 'US-CA'
    });
    // Await promise response
    let promResDaily = await trendsDaily;
    // Create a new array
    let dataArr = [];
    // Parse and loop through
    JSON.parse(promResDaily).default.trendingSearchesDays.forEach((trend) => {
      //console.log(t)
      // Push Date
      dataArr.push({
        formattedDate: trend.formattedDate,
      });
      // Push all data inside the array
      trend.trendingSearches.forEach((t) => {
        // console.log(t);
        dataArr.push(t);
      });
    });
    //console.log(dataArr);
    // Response Render
    if (dataArr.length > 0) {
      return res.render("daily", {
        success: true,
        data: dataArr,
      });
    }
    // else
    return res.render("daily", {
      success: false,
      data: [],
    });
  } catch (error) {
    if (error) throw error;
  }
};
exports.postDaily = async (req, res) => {
  // Destructuring req.body
  // console.log(req.body)
  let { day, geo } = req.body;
  // Clear string from specials charts
  geo = req.body.geo.replace(/[^\w\s]/gi, "").toUpperCase();
  day = new Date(day);
  //console.log(geo)
  // console.log(day)
  // console.log(new Date())
  try {
    /**
     * TRENDS RELATED DAILY
     */
    let trendsDaily = await Uspto.dailyTrends({
      trendDate: day, // trend date
      geo: geo, // REQUIRED US' will target United States or geo: 'FR' will target France.
      hl: "EN", // optional - type string - preferred language code for results (defaults to english).
      //,resolution: 'CITY'
      // ,geo: 'US-CA'
    });
    // Await response promise
    let promResDaily = await trendsDaily;
    // console.log(promResDaily)
    // Search for errors
    let searchError = promResDaily.indexOf("<!DOCTYPE html>");
    // console.log(searchError)
    // IF NOT MATCH RETURN VALUE -1 IF MATCH 0
    // IF 0 RETURN ERROR
    if (searchError === 0) {
      // console.log(searchError);
      // Return success false
      return res.render("daily", {
        success: false,
        data: [
          {
            title: {
              query: "The requested URL was not found on this server.",
            },
          },
        ],
      });
    }

    // Create a new array
    let dataArr = [];
    // Parse and loop through
    JSON.parse(promResDaily).default.trendingSearchesDays.forEach((trend) => {
      //console.log(t)
      // Push Date
      dataArr.push({
        formattedDate: trend.formattedDate,
      });
      // Push all data inside the array
      trend.trendingSearches.forEach((t) => {
        // console.log(t);
        dataArr.push(t);
      });
    });
    // console.log(dataArr);
    // Response Render
    if (dataArr.length > 0) {
      return res.render("daily", {
        success: true,
        data: dataArr,
      });
    }
    // Return success false
    return res.render("daily", {
      success: false,
      data: [],
    });
  } catch (error) {
    if (error) console.log(error);
  }
};
// exports.getPatent = async(req, res) => {
//   const url = ('https://jsonplaceholder.typicode.com/posts')
//   const options = {
//     'method':"GET",
//   };

//   const response = await fetch(url,options)
//   .then(res => res.json())
//   .catch(e => {
//     console.error({
//       "message" : "oh noes",
//       error:e
//     })
//   })

//   console.log("RESPONSE: ",response);
//   res.json(response)

// }
exports.getPatent = async (req, res) => {
 
  try {
    const result = await axios.get(
      "https://bulkdata.uspto.gov:443/BDSS-API/products/PTGRSP?hierarchy=false",
      {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false, // set to false
        }),
      }
    );
    

    res.render("patent", { articles: result.data });
    console.log(result.data.productDesc);
  } catch (err) {
    console.log(err?.message || err);
  }
};
exports.postPatent = async (req, res) => {
 let search = req.body.search
  try {
    const result = await axios.get(
      `https://bulkdata.uspto.gov:443/BDSS-API/products/${search}?hierarchy=false`,
      {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false, // set to false
        }),
      }
    );
    

    res.render("patentsearch", { articles: result.data});
    console.log(result.data.productDesc);
  } catch (err) {
    console.log(err?.message || err);
  }
};
