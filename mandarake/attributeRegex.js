/**
 * 提取商品数据(数组对象封装)
 * @param {String} goodsDivStr 商品html字符串
 * @param {String} goodsPreUrl 商品链接前缀
 * @param {Array} filterWords 商品名称过滤组
 * @returns {Array} 商品数组对象
 */
export function getGoodsArr({ goodsDivStr = "", goodsPreUrl, filterWords, CNYTOJPY }) {
    const goodsRegex = /<div\s+class\s*=\s*"block"(?:\s+[\w-]+\s*=\s*"[^"]*")*\s*>([\s\S]*?)<\/div><!-- \/block -->/g
    const goodsDivArr = goodsDivStr.match(goodsRegex) || [];
    // console.log('goodsDivArr', goodsDivArr.length)
    var goodsList = []
    goodsDivArr?.forEach((goods, index) => {
        goodsList[index] = {
            stock: getStock(goods),
            shop: getShop(goods),
            itemno: getItemno(goods),
            newStatus: getNewStatus(goods),
            name: getName(goods, filterWords),
            url: getUrl(goods, goodsPreUrl),
            img: getImg(goods),
            price: getPrice(goods),
            CNY: (getPrice(goods) / CNYTOJPY).toFixed(2),

        }
    })
    return goodsList
}
/**
 * 格式化商品区域字符串
 * @param {String} htmlStr html原文整份字符串
 * @returns formatContext,goodsArr
 */
export function formatGoodsContext(htmlStr) {
    var goodsContext
    var pattern = /<div class="thumlarge">([\s\S]*?)<\/div><!-- \/infolist -->/gm;
    const match = pattern.exec(htmlStr);
    if (match) {
        goodsContext = match[1];
    } else {
        goodsContext = "未找到符合条件的内容";
    }
    return goodsContext
}

/** 获取商店名称 */
export function getShop(goods) {
    var shop = ''
    const regex = /<p class="shop">(.*?)<\/p>/;
    const match = goods.match(regex);
    if (match) {
        shop = match[1].trim();
    } else {
        shop = "未找到符合条件的内容";
    }
    return shop
}

/** 获取商品编号 */
export function getItemno(goods) {
    var itemno = ''
    const regex = /<p class="itemno">(.*?)<\/p>/;
    const match = goods.match(regex);
    if (match) {
        itemno = match[1].trim();
    } else {
        itemno = "未找到符合条件的内容";
    }
    return itemno
}

/** 获取商品名称 */
export function getName(goods, words) {
    var name = ''
    const regex = /<div class="title">\s*<p>\s*<a[^>]*>(.*?)<\/a>\s*<\/p>\s*<\/div>/s;
    const match = goods.match(regex);
    if (match) {
        name = match[1].trim();
        const filterRegex = new RegExp(words.join("|"), "gi");
        name = name.replace(filterRegex, "");
    } else {
        name = "未找到符合条件的内容";
    }
    return name
}

/** 获取商品链接 */
export function getUrl(goods, preUrl = goodsPreUrl) {
    var url = ''
    const regex = /<div class="title">\s*<p>\s*<a\b[^>]*\bhref="(.*?)"/s;
    const match = goods.match(regex);
    if (match) {
        url = preUrl + match[1].trim();
    } else {
        url = "未找到符合条件的内容";
    }
    return url
}

/** 获取商品图片 */
export function getImg(goods) {
    var img = ''
    const regex = /<div\s+class\s*=\s*"thum"\s*>[\s\S]*?<a[^>]*href\s*=\s*"([^"]*)"[^>]*>\s*<img[^>]*src\s*=\s*"([^"]*)"[^>]*>\s*<\/a>[\s\S]*?<\/div>/;
    const match = goods.match(regex);
    if (match) {
        img = match[2].trim();
    } else {
        img = "未找到符合条件的内容";
    }
    return img
}

/** 获取价格 */
export function getPrice(goods) {
    var price = ''
    const regex = /<div class="price">\s+<p>(.*?)<\/p>\s+<\/div>/;
    const match = goods.match(regex);
    if (match) {
        price = match[1].trim().replace(/[^0-9]/g, "");
    } else {
        price = "未找到符合条件的内容";
    }
    return price
}

/** 获取库存状态 */
export function getStock(goods) {
    var stock = ''
    const regex = /<p class="stock">(.*?)<\/p>/;
    const match = goods.match(regex);
    if (match) {
        stock = match[1].trim();
    } else {
        stock = "售罄";
    }
    return stock
}

/** 获取新品状态 */
export function getNewStatus(goods) {
    var newStatus = ''
    const regex = /<span\s+class\s*=\s*"new_arrival"\s*>([\s\S]*?)<\/span>/
    const match = goods.match(regex);
    if (match) {
        newStatus = match[1].trim();
    } else {
        newStatus = "";
    }
    return newStatus
}

