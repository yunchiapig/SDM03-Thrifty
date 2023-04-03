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
  const longitude = req.body.longitude;
  const latitude = req.body.latitude;
  
  // 檢查 req.body 是否有缺漏
  const bodyKeys = Object.keys(req.body);
  if (bodyKeys.length !== 6){
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

  console.log(updateInfo);

  // 將 updateInfo 放入 req.locals
  req.updateInfo = updateInfo;
  next();
}


// 檢查食物價格格式
function checkFoodPrice(req, res, next){
  const original_price = req.body.original_price;
  const discount_price = req.body.discount_price;
  const price = [original_price, discount_price];

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

module.exports = {
  checkStoreInfo,
  checkID,
  checkStoreUpdateInfo,
  checkFoodPrice
}