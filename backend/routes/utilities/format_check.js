const mongoose = require('mongoose');

// 檢查 ID 格式
function checkID(req, res, next){
  const storeID = req.query.id;
  if (storeID === undefined || storeID.length !== 24) {
    res.status(400).send(
      {message: "ID 格式錯誤"}
    );
    return;
  }
  next();
}


// 檢查店家名稱格式是否為中英數字
function checkStoreName(name, res){
  if (/[^\u4E00-\u9FA5A-Za-z0-9]/.test(name)){
    res.status(400).send(
      {message: "店家名稱格式錯誤，僅接受中英數字。"}
    );
    return true; // 代表有錯誤
  }
}


// 檢查店家類別格式是否為全家、Seven、其他
function checkStoreCategory(category, res){
  if (/[^(全家|Seven|其他)]/.test(category)){
    res.status(400).send(
      {message: "店家類別格式錯誤，僅接受「全家」、「Seven」、「其他」。"}
    );
    return true; // 代表有錯誤
  }
}


// 檢查電話格式是否為數字
function checkTel(tel, res){
  if (!(/^[0-9\-]+$/.test(tel))){
    res.status(400).send(
      {message: "電話格式錯誤"}
    );
    return true; // 代表有錯誤
  }
}


// 檢查地址格式是否為臺灣地址
function checkAddress(address, res){
  if (!(/^(臺灣省|台灣省|台灣|臺灣)?\S+[市縣]\S+[區鄉鎮市]\S+[路街]\S+[段巷弄號](\S+樓)?$/).test(address)){
    res.status(400).send(
      {message: "地址格式錯誤"}
    );
    return true; // 代表有錯誤
  }
}


// 檢查經度格式是否正確
function checkLongitude(longitude, res){
  const longitudeRex = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d+)?|180(?:\.0+)?)$/;
  if (!longitudeRex.test(longitude)){
    res.status(400).send(
      {message: "經度格式錯誤"}
    );
    return true; // 代表有錯誤
  }
}


// 檢查緯度格式是否正確
function checkLatitude(latitude, res){
  const latitudeRex = /^(-?(?:[1-8]?\d(?:\.\d+)?|90(?:\.0+)?))$/;
  if (!latitudeRex.test(latitude)){
    res.status(400).send(
      {message: "緯度格式錯誤"}
    );
    return true; // 代表有錯誤
  }
}


// 檢查店家資訊格式
function checkStoreInfo(req, res, next){
  const name = req.body.name;
  const category = req.body.category;
  const tel = req.body.tel;
  const address = req.body.address;
  const longitude = req.body.location.coordinates[0];
  const latitude = req.body.location.coordinates[1];
  
  // 檢查 req.body 是否有缺漏
  const bodyKeys = Object.keys(req.body);
  if (bodyKeys.length !== 5){
    res.status(400).send(
      {message: "店家資訊格式錯誤，請檢查是否有缺漏。"}
    );
    return;
  }

  // 檢查店家名稱格式是否為中英數字
  if(checkStoreName(name, res)){
    return;
  };

  // 檢查店家類別格式是否為全家、Seven、其他
  if(checkStoreCategory(category, res)){
    return;
  }

  // 檢查電話格式是否為數字
  if (checkTel(tel, res)){
    return;
  }

  // 檢查地址格式是否為臺灣地址
  if (checkAddress(address, res)){
    return;
  }

  // 檢查經度格式是否正確
  if (checkLongitude(longitude, res)){
    return;
  }

  // 檢查緯度格式是否正確
  if (checkLatitude(latitude, res)){
    return;
  }

  next();
}


// 檢查店家更新資訊格式
function checkStoreUpdateInfo(req, res, next){
  // 取得要更新的欄位
  const updateKeys = Object.keys(req.body.updateInfo);

  // updateInfo 放入將要更新的資訊
  let updateInfo = {};

  // 檢查 updateKeys 的每一個 key
  for (let i = 0; i < updateKeys.length; i++) {
    const key = updateKeys[i];

    // 將要更新的資訊放入 updateInfo
    updateInfo[key] = req.body.updateInfo[key];
    
    // 檢查店家名稱格式是否為中英數字
    if (key === "name"){
      if (checkStoreName(req.body.updateInfo[key], res)){
        return;
      }
    }

    // 檢查店家類別格式是否為全家、Seven、其他
    if (key === "category"){
      if (checkStoreCategory(req.body.updateInfo[key], res)){
        return;
      }
    }

    // 檢查電話格式是否為數字
    if (key === "tel"){
      if (checkTel(req.body.updateInfo[key], res)){
        return;
      }
    }

    // 檢查地址格式是否為臺灣地址
    if (key === "address"){
      if (checkAddress(req.body.updateInfo[key], res)){
        return;
      }
    }

    // 檢查經度格式是否正確
    if (key === "longitude"){
      if (checkLongitude(req.body.updateInfo[key], res)){
        return;
      }
    }

    // 檢查緯度格式是否正確
    if (key === "latitude"){
      if (checkLatitude(req.body.updateInfo[key], res)){
        return;
      }
    }
  }

  // console.log(updateInfo);

  // 將 updateInfo 放入 req.locals
  req.updateInfo = updateInfo;
  next();
}


// 檢查食物價格格式
function checkFoodPrice(req, res, next){
  const updateInfo = req.body.updateInfo;
  const original_price = updateInfo.original_price;
  const discount_price = updateInfo.discount_price;
  let price = [];

  if (original_price !== undefined){
    price.push(original_price);
  }

  if (discount_price !== undefined){
    price.push(discount_price);
  }

  for (let i = 0; i < price.length; i++) {
    // 檢查價格是否為數字
    if (!(/^\d+$/.test(price[i]))){
      res.status(400).send(
        {message: "價格格式錯誤"}
      );
      return;
    }
  }

  next();
}


// 檢查 stock updateInfo 格式
function checkStockUpdateInfo(req, res, next){
  const storeID = req.body.storeID;
  const foodID = req.body.foodID;
  const updateQty = req.body.updateQty;

  // 檢查 StoreID 格式
  if (storeID === undefined || storeID.length !== 24) {
    res.status(400).send(
      {message: "StoreID 格式錯誤"}
    );
    return;
  }

  // 檢查 FoodID 格式
  if (foodID === undefined || foodID.length !== 24) {
    res.status(400).send(
      {message: "FoodID 格式錯誤"}
    );
    return;
  }

  // 檢查 updateQty 格式
  if (!(/^\d+$/.test(updateQty))) {
    res.status(400).send(
      {message: "updateQty 格式錯誤"}
    );
    return;
  }

  next();
}


// 檢查使用者的經緯度格式
function checkUserLocation(req, res, next){
  const { longitude, latitude } = req.query;

  // 檢查經度格式是否正確
  if (checkLongitude(longitude, res)){
    return;
  }

  // 檢查緯度格式是否正確
  if (checkLatitude(latitude, res)){
    return;
  }

  next();
}

// 檢查使用者名稱格式是否為中英數字
function checkUserName(name, res){
  if (/[^\u4E00-\u9FA5A-Za-z0-9]/.test(name)){
    res.status(400).send(
      {message: "使用者名稱格式錯誤，僅接受中英數字。"}
    );
    return true; // 代表有錯誤
  }
}

// 檢查使用者密碼格式是否正確
function checkUserPassword(password, res){
  if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/.test(password))){
    res.status(400).send(
      {message: "使用者密碼格式錯誤，僅接受 8~20 個字元，並且至少含有一個數字、一個大寫英文字母、一個小寫英文字母。"}
    );
    return true; // 代表有錯誤
  }
}

// 檢查使用者信箱格式是否正確
function checkUserEmail(email, res){
  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
    res.status(400).send(
      {message: "使用信箱格式錯誤。"}
    );
    return true; // 代表有錯誤
  }
}

// 檢查使用者資訊格式
function checkUserInfo(req, res, next){
  const type = req.body.type;
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;

  // 如果是用 google 註冊，則不用檢查
  if (type=="google"){
    next();
  }
  
  // 檢查 req.body 是否有缺漏
  const bodyKeys = Object.keys(req.body);
  if (bodyKeys.length !== 4){
    res.status(400).send(
      {message: "使用者資訊格式錯誤，請檢查是否有缺漏。"}
    );
    return;
  }

  // 檢查使用者名稱格式是否為中英數字
  if (checkUserName(name, res)){
    return;
  };

  // 檢查使用者密碼格式是否正確
  if (checkUserPassword(password, res)){
    return;
  }

  // 檢查使用者信箱格式是否正確
  if (checkUserEmail(email, res)){
    return;
  }

  next();
}

function checkUserLogin(req, res, next){
  const type = req.query.type;
  const password = req.query.password;
  const email = req.query.email;

  // 如果是用 google 註冊，則不用檢查
  if (type=="google"){
    next();
  }
  
  // 檢查 req.query 是否有缺漏
  const queryKeys = Object.keys(req.query);
  if (queryKeys.length !== 3){
    res.status(400).send(
      {message: "使用者資訊格式錯誤，請檢查是否有缺漏。"}
    );
    return;
  }

  // 檢查使用者密碼格式是否正確
  if (checkUserPassword(password, res)){
    return;
  }

  // 檢查使用者信箱格式是否正確
  if (checkUserEmail(email, res)){
    return;
  }

  next();
}

module.exports = {
  checkStoreInfo,
  checkID,
  checkStoreUpdateInfo,
  checkFoodPrice,
  checkStockUpdateInfo,
  checkUserLocation,
  checkUserInfo,
  checkUserLogin
}