const path = require('path')
const googleTrends = require('google-trends-api');
const fetch = require('node-fetch')
const { response } = require('express');
const axios = require('axios')



var Uspto = require('uspto');
const { request } = require('http');

var options = {
  query: 'IN/KANG-HO-FAN'
};






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
      let MM = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
      let DD = (new Date().getDate()) < 10 ? '0' + (new Date().getDate()) : (new Date().getDate());
      let ymd = YYYY + '-' + MM + '-' + DD;
      // console.log(ymd);


      let trendsDaily = await Uspto.dailyTrends({
          trendDate: new Date(), // trend date
          inventionTitle: "HAND UTILITY INTERFACE", // REQUIRED US' will target United States or geo: 'FR' will target France.
          hl: 'it' // optional - type string - preferred language code for results (defaults to english).
          //,resolution: 'CITY'
          // ,geo: 'US-CA'
      });
      // Await promise response
      let promResDaily = await trendsDaily;
      // Create a new array
      let dataArr = [];
      // Parse and loop through
      JSON.parse(promResDaily).default.trendingSearchesDays.forEach(trend => {
          //console.log(t)
          // Push Date
          dataArr.push({
              formattedDate: trend.formattedDate,
          });
          // Push all data inside the array
          trend.trendingSearches.forEach(t => {
              // console.log(t);
              dataArr.push(t)
          });
      });
      //console.log(dataArr);
      // Response Render
      if (dataArr.length > 0) {
          return res.render('daily', {
              success: true,
              data: dataArr
          });
      }
      // else
      return res.render('daily', {
          success: false,
          data: []
      });

  } catch (error) {
      if (error) throw error;
  }
}
exports.postDaily = async (req, res) => {
  // Destructuring req.body
  // console.log(req.body)
  let {
      day,
      geo
  } = req.body;
  // Clear string from specials charts
  geo = req.body.geo.replace(/[^\w\s]/gi, '').toUpperCase();
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
          hl: 'EN' // optional - type string - preferred language code for results (defaults to english).
          //,resolution: 'CITY'
          // ,geo: 'US-CA'
      });
      // Await response promise
      let promResDaily = await trendsDaily;
      // console.log(promResDaily)
      // Search for errors
      let searchError = promResDaily.indexOf('<!DOCTYPE html>');
      // console.log(searchError)
      // IF NOT MATCH RETURN VALUE -1 IF MATCH 0
      // IF 0 RETURN ERROR
      if (searchError === 0) {
          // console.log(searchError);
          // Return success false
          return res.render('daily', {
              success: false,
              data: [{
                  title: {
                      query: 'The requested URL was not found on this server.'
                  }
              }]
          });
      }

      // Create a new array
      let dataArr = [];
      // Parse and loop through
      JSON.parse(promResDaily).default.trendingSearchesDays.forEach(trend => {
          //console.log(t)
          // Push Date
          dataArr.push({
              formattedDate: trend.formattedDate,
          });
          // Push all data inside the array
          trend.trendingSearches.forEach(t => {
              // console.log(t);
              dataArr.push(t)
          });
      });
      // console.log(dataArr);
      // Response Render
      if (dataArr.length > 0) {
          return res.render('daily', {
              success: true,
              data: dataArr
          });
      }
      // Return success false
      return res.render('daily', {
          success: false,
          data: []
      });

  } catch (error) {
      if (error) console.log(error);
  }
}
exports.getPatent = async(req, res) => {
  const url = ('https://developer.uspto.gov/ibd-api/v1/application/publications?start=0&rows=100&largeTextSearchFlag')
  const options = {
    'method':"GET",
    "access-control-allow-credentials": "true"
  };

  const response = await fetch(url,options)
  .then(res => res.json())
  .catch(e => {
    console.error({
      "message" : "oh noes",
      error:e
    })
  })

  console.log(response);
  res.json(response)

}
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
// exports.getPatent = async(req, res) => {
//   const url = ('https://developer.uspto.gov/ibd-api/v1/application/publications?start=0&rows=100&largeTextSearchFlag')
 
  
//   // params.append('a', 1);
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

//   console.log(response);
//   res.json(response)

// }
  
//       // const patentApi = await axios.get("https://dummyjson.com/products")
//       // .then(function(response){
//       //   console.log(response)
//       // })

//       // console.log(patentApi.products)
//       // res.render('patent',{artiles:data})
//       Uspto.listPatents(options).then(function (data) {

//         data.patentList.forEach(function (element) {
      
//           const patentId='patent number: ' + element.id;
//           const patentLink='patent link: ' + element.url;
//           const patetTitle='patent title: ' + element.title;
//           const patentPdf='patent pdf link: ' + element.pdf;
//           console.log(patentId);
//         });
      
//         console.log('Displaying patents ' + data.startIndex + ' - ' + data.endIndex + ' out of ' + data.totalCount + ' patents found.');
//       res.render('patent',{element.id})
//       }).catch(function (err) {
      
//         console.log(err);
//       });

 
//}
//exports.getPatent = async(req, res) => {

 
  
  //const url = fetch('https://jsonplaceholder.typicode.com/posts')
  // .then(res => res.json()) // the .json() method parses the JSON response into a JS object literal
  // .then(data => console.log(data));
  // console.log(data);

//   fetch('https://jsonplaceholder.typicode.com/posts', { // fake API endpoint
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(newJoke), // turn the JS object literal into a JSON string
// })
//   .then(res => res.json())
//   .then(data => console.log(data))
//   console.log(data)
//   .catch(err => {
//     console.error(err);
//   });

 
//}

// const url = fetch('https://jsonplaceholder.typicode.com/posts')

// request({url:url},(error,response) =>{
//   const data = JSON.parse(response.body)
//   console.log(data)
// })


// const api = fetch('https://developer.uspto.gov/ibd-api/v1/application/publications?start=0&rows=100&largeTextSearchFlag', { // fake API endpoint
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(api), // turn the JS object literal into a JSON string
// })
//   .then(res => res.json())
//   .then(data => console.log(data))
//   .catch(err => {
//     console.error(err);
//   });