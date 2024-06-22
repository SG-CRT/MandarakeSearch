import https from 'https';
import http from 'http';
import child_process from 'child_process';
const PORT = '9099'
import { getGoodsArr, formatGoodsContext } from './attributeRegex.js';
import { goodsTemplate, newHtml } from './htmlTemplate.js';
import { getCNYTOJPY } from './api.js';
import { getBot, getRoom } from '../weixin/login.js';
import fs from 'fs';
import { log } from 'wechaty';
var exchangeRate = {
    Time: "",
    CNYTOJPY: 0,
}
var goodsPreUrl = 'https://order.mandarake.co.jp'
const kamenKey = ['sic', 'kamen figma', '匠魂', 'MegaHouse ART WORKS', 'shf ryuki']//假面骑士关键词组
// const kamenKey = ['sic']//假面骑士关键词组
const garoKey = ['Makai Kadou', 'Kiramekibito 12inch', '魔導火', 'Zaruba']//牙狼关键词组
// const garoKey = ['Makai Kadou']//牙狼关键词组
var urlkey = [...kamenKey, ...garoKey]//目标地址
var urlArr = [...urlkey]//目标地址
var filterWords = ['Bandai', 'SIC', 'Kamen-Rider', 'Max%20Factory', 'Kamen', 'Rider', 'Makai%20Kadou', 'shf']
const Cookie = `tr_mndrk_user=e2d2ce02.60d421bd193ec; _ga=GA1.4.361891445.1703427352; _ga_N9EV1EWY1J=GS1.1.1704018811.2.1.1704019085.60.0.0; _ga=GA1.3.361891445.1703427352; initialized_cart=1; _gid=GA1.3.862815905.1708660770; _gat=1; _gat_UA-2035300-1=1; _gid=GA1.4.862815905.1708660770; _gat_UA-2035300-49=1; mandarake_url=/order/; _ga_N9EV1EWY1J=GS1.4.1708660771.5.0.1708660771.60.0.0`
//机器人实例
var bot
//聊天群实例
var room
filterWords = filterWords.map(item => decodeURIComponent(item))

//地址过滤
var urlFilter = {
    // soldOut: "1",//1为售完不显示
    dispCount: "48",//单页展示数量48、120、240
    categoryCode: "02",//商品类型 02-玩具
    lang: "zh",//页面语言
}

/** 拉取目标地址 */
function keyToUrlOptions(key) {
    let filterCriteria = []
    Object.entries(urlFilter).forEach((arr) => {
        arr[1] && filterCriteria.push(`${arr[0]}=${arr[1]}`)
    })
    filterCriteria.push(`keyword=${encodeURIComponent(key)}`)

    return {
        host: 'order.mandarake.co.jp',

        path: '/order/listPage/list?' + filterCriteria.join("&"),
        href: goodsPreUrl + '/order/listPage/list?' + filterCriteria.join("&"),
        headers: {
            "Cookie": Cookie,
        }
    }
}
// //命令行处理(立即执行)
// const shellToKey = (function () {
//     process.argv.forEach((key, index) => {
//         //第二个参数往后为命令行入参
//         // if (index > 1) urlArr.push(key)
//         const regex = /'([^']*)'/g;
//         const keyArr = key.match(regex)?.map(item => item.replace(/'/g, ''))
//         switch (index) {
//             case 2:
//                 keyArr.forEach(item => urlArr.push(item));
//                 console.log(urlArr);
//                 break;
//             case 3:
//                 keyArr.forEach(item => filterWords.push(decodeURIComponent(item)));
//                 console.log(filterWords);
//                 break;
//         }
//     })
// })()


//提取完整地址
urlArr = urlArr.map((key, index) => {
    console.log(index + 1, key)
    return keyToUrlOptions(key)
})

const singleUrl = 'keyword=sic&dispCount=48&upToMinutes=4320&lang=zh'
urlArr.push({
    host: 'order.mandarake.co.jp',
    path: '/order/listPage/list?' + singleUrl,
    href: goodsPreUrl + '/order/listPage/list?' + singleUrl,
    headers: {
        "Cookie": Cookie,
    }
})


/**
 * 单个商品Div
 * @param {Array} goodsArr 商品属性数组对象
 * @returns {String} 商品模板字符串
 */
function formatGoodsItem(goodsArr) {
    var goodsItem = ''
    goodsArr.forEach((goods) => {
        goodsItem += goodsTemplate(goods)
    })
    return goodsItem
}

/**
 * 拉取网页内容
 * @param {*} url 
 * @returns 
 */
async function getHtml(options) {
    console.log('Link==>', options.path)
    return new Promise((resolve, reject) => {
        https.get(options, (response) => {
            var htmlStr;
            response.on('data', (chunk) => {
                htmlStr += chunk;
            });
            response.on('end', () => {
                resolve(formatGoodsContext(htmlStr))
            });

        }).on('error', (error) => {
            console.error('发生错误:', error);
            resolve(error)
        });
    })
}
/**
 * 生成页面打开浏览器
 * @param {*} goodsArr 
 */
function openWeb(goodsArr) {
    const goodsResultDiv = formatGoodsItem(goodsArr)
    const openUrl = `http://127.0.1:${PORT}`;
    //创建服务
    http.createServer(function (request, response) {
        // 发送 HTTP 头部
        // HTTP 状态值: 200 : OK
        // 内容类型: text/plain。并用charset=UTF-8解决输出中文乱码
        response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        // 下句是发送响应数据
        response.end(newHtml(goodsResultDiv, goodsArr));
    }).listen(PORT);
    child_process.exec(`start ${openUrl}`);
}

// 异步函数，模拟阻塞操作
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 递归函数，处理嵌套数组
async function processNestedArray(arr) {
    for (const item of arr) {
        if (Array.isArray(item)) {
            // 如果元素是数组，则递归处理
            await processNestedArray(item);
        } else {
            // 如果元素是数字1，则阻塞10秒输出；其他数字阻塞1秒输出
            await delay(200);
            //微信推送
            room.say(item)
            console.log(item)
        }
    }
}
async function sendRob(goodsArr) {
    if (!room) return;
    processNestedArray(Object.entries(goodsArr));
    // console.log('goodsArr', goodsArr)
}

async function wxFilter(htmlArr, CNYTOJPY) {
    let goodsArr = {}
    let listJSON = []
    let fileJSON = []
    // 指定文件路径
    const filePath = 'list.json';
    // 使用fs.readFile()方法读取文件内容
    await new Promise((resolve) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('读取文件时发生错误:', err);
                resolve(false)
            } else {
                // console.log('文件内容:', data);
                fileJSON = JSON.parse(data || '[]')
                resolve(true)
            }
        });
    })

    urlkey.forEach((key, index) => {
        const filterArr = getGoodsArr({ goodsDivStr: htmlArr[index] || "", goodsPreUrl, filterWords, CNYTOJPY }).splice(0, 12).filter(obj => !fileJSON.includes(obj.itemno))
        if (filterArr.length) goodsArr[`===>>>${urlArr[index].href}`] = filterArr.map((obj, index) => {
            const { shop, name, newStatus, price, CNY, stock, img } = obj
            const postage = Number(2500 / CNYTOJPY)?.toFixed(2)
            const sumCNY = (Number(CNY) + Number(postage))?.toFixed(2)
            return `${newStatus ? '🆕' : ''}${name}\n💴💴💴JPY ${price} 💴💴💴\n💰💰💰 CNY ${CNY}  💰💰💰\n💸💸💸[ ${sumCNY} ]💸💸💸\n${shop}   ---   ${stock.includes("售罄") ? "🈚" : stock + '✅'}\n${img}`
        })
        listJSON = [...listJSON, ...filterArr.map(item => item.itemno)]
    })
    const mergeJSON = JSON.stringify(Array.from(new Set([...listJSON, ...fileJSON])));

    // 使用fs.writeFile()方法将字符串写入json文件
    fs.writeFile(filePath, mergeJSON, (err) => {
        if (err) {
            console.error('写入文件时发生错误:', err);
        } else {
            // console.log('成功写入文件:', filePath);
        }
    });
    return goodsArr
}

//客户端
async function Client(type) {
    Promise.all(urlArr.map(options => getHtml(options))).then(async (htmlArr) => {
        // var goodsResultDiv = ''
        var goodsArr = []
        const nowDay = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' })).toISOString().split('T')[0]
        if (exchangeRate.Time != nowDay) {
            try {
                exchangeRate = {
                    Time: nowDay,
                    CNYTOJPY: await getCNYTOJPY()
                    // CNYTOJPY: 20.3//有波动，往低取
                }
                console.log('====>获取汇率：', exchangeRate.CNYTOJPY, nowDay)
            } catch (error) {
                console.log('error', error)
            }

        }

        //TODO:这里可 插入对数组的过滤等操作
        // filterFunction(goodsArr)
        switch (type) {
            case "web":
                htmlArr.forEach((goodsDivStr) => {
                    goodsArr = [...goodsArr, ...getGoodsArr({ goodsDivStr, goodsPreUrl, filterWords, CNYTOJPY: exchangeRate.CNYTOJPY }) || []]
                })

                openWeb(goodsArr);
                break;
            case "wx":
                goodsArr = await wxFilter(htmlArr, exchangeRate.CNYTOJPY)
                //标记时间
                const nowTime = new Date(Date.now()).toLocaleString('zh-cn', { hour12: false })
                console.log("wx", nowTime)
                sendRob(goodsArr);
                break;
        }

    })
        .catch(error => {
            console.error('Error:', error);
        });
}
//随机时间
function randomTime() {
    return Math.floor(Math.random() * 180000) + 60000
}
//任务主体
async function main(type) {
    switch (type) {
        //网页端
        case "web":
            Client("web")
            break;
        //微信推送
        case "wx":
            getBot().then(async (bot) => {
                //获取群实例
                room = await getRoom(bot, /推送/)
                room.say(`启动===${new Date(Date.now()).toLocaleString('zh-cn', { hour12: false })}`)
                Client("wx")
                var count = 0
                function timer() {
                    const time = randomTime()
                    console.log(`随机时间${time / 1000 / 60}分钟`)
                    setTimeout(() => {
                        //执行信息获取发送 当前时间位于晚上01:30到早上05:30区间
                        var RangeTime = new Date(Date.now()).toLocaleString('zh-cn', { hour12: false });
                        var isInRange = new Date(RangeTime).getHours() >= 1 && new Date(RangeTime).getHours() < 5 || new Date(RangeTime).getHours() === 5 && new Date(time).getMinutes() <= 30;
                        if (!isInRange) {
                            //标记时间
                            const nowTime = new Date(Date.now()).toLocaleString('zh-cn', { hour12: false })
                            if (count % 20 == 0) {
                                room.say(`${nowTime}--${exchangeRate.CNYTOJPY}`)
                                console.log(' count', count)

                            }
                            count++
                            Client("wx")
                        }
                        //轮询
                        timer()
                    }, time)
                }
                //立即执行
                timer()
            })
            break;
    }
}

//命令行处理(立即执行)
const shell = (function () {
    process.argv.forEach((key, index) => {
        //第二个参数往后为命令行入参
        console.log('shell', key, index)
        index == 2 && main(key)//key web or wx
    })
})()








