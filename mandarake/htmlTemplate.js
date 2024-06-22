/**
 * 商品模板
 * @param {Object} goods 商品数据对象
 * @returns 字符串模板
 */
export function goodsTemplate(goods) {
    let { stock, shop, newStatus, name, url, img, price, CNY } = goods
    return `
    <div class="goods">
        <img src="${img}"/>
        <div>
            ${newStatus ? `<span class="newStatus">[新]</span>` : ''}
            <a class="name" href="${url}">${name}</a>
        </div>
        <div class="stock">${stock}</div>
        <div class="price">
            <span class="JPY">${price}日元</span>
            <span class="CNY">(${CNY}元)</span>
        </div> 
        <div class="shop">${shop}</div>
        
    </div>
    <hr/>
    `
}
/**
 * 创建网页
 * @param {*} goodsContext 商品
 * @returns 
 */
export function newHtml(goodsContext) {
    return `
    <!DOCTYPE html>
    <html lang="zh-cmn-Hans">
        <head>
            <meta charset="utf-8">
        </head>
        <body>
            <style>
            img{
                width:100px;
                height:100px;
            }
            </style>
            <main>
                ${goodsContext}
            </main>
            <script>
            </script>
        </body>
    </html>
`
}
