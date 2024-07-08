const puppeteer = require("puppeteer");
const fs = require("fs");

async function test() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const metaInfoList = [];

  for (let i = 1; i <= 32; i++) {
    const url = `https://www.gardenparadiseseeds.com/collections/all-plant-seeds?page=${i}`;
    await page.goto(url, { waitUntil: "networkidle2" });

    // Truy cập và thu thập thông tin biến meta

    const scriptContent = await page.evaluate(() => {
      const scriptElement = document.getElementById("web-pixels-manager-setup");
      return scriptElement ? scriptElement.innerHTML : "";
    });

    let startIndex = scriptContent.indexOf('"collection"');
    let result = scriptContent.substring(startIndex);
    let startIndex_1 = result.indexOf(`});},`);
    let result_1 = result
      .substring(0, startIndex_1)
      .replace(`\\`, "")
      .replace(`\\u0026`, "")
      .replace(`""`, `"`)
      .replace(`}"}`, `}}`);
    let cleanedString = result_1.replace(/\\/g, "");
    console.log(cleanedString);
    // Thêm dấu nháy kép (") vào đầu và cuối chuỗi để tạo thành một chuỗi JSON hợp lệ
    try {
      let jsonObject = JSON.parse(`{${cleanedString}}`);
      metaInfoList.push({ page: i, jsonObject }); // Thêm thông tin vào danh sách
    } catch (error) {
      console.log(error);
    }
    // console.log(`Meta info from page ${i}:`, metaInfo); // Log thông tin biến meta từ mỗi trang
  }
  // Ghi dữ liệu vào file plant.json
  fs.writeFile("plant.json", JSON.stringify(metaInfoList, null, 2), (err) => {
    if (err) throw err;
    console.log("Dữ liệu đã được ghi vào file plant.json");
  });

  await browser.close(); // Đóng trình duyệt
}

test();

// const puppeteer = require('puppeteer');
// const fs = require('fs');
// async function test() {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     const metaInfoList = [];
//     const plantJSON = require("./plant.json")
//     for (let i = 0; i < plantJSON.length; i++) {
//         const plantObj = plantJSON[i];
//         for (let j = 0; j < plantObj.jsonObject.collection.productVariants.length; j++) {
//             const element = plantObj.jsonObject.collection.productVariants[j];
//             const url = `https://www.gardenparadiseseeds.com/collections/all-plant-seeds${element.product.url}`;
//             await page.goto(url, { waitUntil: 'networkidle2' });

//             // Truy cập và thu thập thông tin biến meta

//             const scriptContent = await page.evaluate(() => {
//                 const scriptElement = document.getElementsByClassName('mainProductJson')[0];
//                 return scriptElement ? scriptElement.innerHTML : '';
//             });
//             try {
//                 const fixedJSON = fixJSON(scriptContent)
//                 // let jsonObject = JSON.parse(`{${fixedJSON}}`);
//                 metaInfoList.push(fixedJSON); // Thêm thông tin vào danh sách
//             } catch (error) {
//                 console.log(error)
//             }
//         }

//     }
//     fs.writeFile('plant_detail.json', JSON.stringify(metaInfoList, null, 2), (err) => {
//         if (err) throw err;
//         console.log('Dữ liệu đã được ghi vào file plant_detail.json');
//     });

//     await browser.close(); // Đóng trình duyệt
// }
// const jsonlint = require('jsonlint');

// function fixJSON(jsonStr) {
//     try {
//         // Sử dụng jsonlint để kiểm tra và phân tích JSON
//         const jsonObj = jsonlint.parse(jsonStr);
//         return jsonObj;
//     } catch (e) {
//         console.error("JSON lỗi:", e.message);

//         // Hiển thị lỗi chi tiết
//         console.error("Chi tiết lỗi:", e);

//         // Thử sửa các lỗi cơ bản trong JSON
//         jsonStr = jsonStr.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
//         jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');
//         jsonStr = jsonStr.replace(/:\s*([^",\[\]\{\}\s]+)(\s*[,}\]])/g, ': "$1"$2');

//         try {
//             const jsonObj = JSON.parse(jsonStr);
//             return jsonObj;
//         } catch (e) {
//             console.error("Không thể sửa lỗi JSON:", e.message);
//             return null;
//         }
//     }
// }
// test();
