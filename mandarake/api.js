import axios from 'axios';


export async function getCNYTOJPY() {
    return new Promise((resolve, reject) => {

        // axios.get({
        //     host: 'api.codelife.cc',
        //     path: '/exchangerate/history?lang=cn&source=CNY&target=JPY&length=2&resolution=hourly&unit=day',
        //     href: 'https://api.codelife.cc/exchangerate/history?lang=cn&source=CNY&target=JPY&length=2&resolution=hourly&unit=day',
        //     headers: {
        //         "Origin": "chrome-extension://inedkoakiaeepjoblbiiipedngonadhn",
        //     }
        // })
        // axios.get('https://api.codelife.cc/exchangerate/history?lang=cn&source=CNY&target=JPY&length=2&resolution=hourly&unit=day',
        //     {
        //         headers: {
        //             'Origin': 'chrome-extension://inedkoakiaeepjoblbiiipedngonadhn',
        //             'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
        //             'Accept': '*/*',
        //             'Host': 'api.codelife.cc',
        //             'Connection': 'keep-alive'
        //         }
        //     })


        //调整请求源为插件
        const config = {
            method: 'get',
            // url: 'https://api.codelife.cc/exchangerate/history?lang=cn&source=CNY&target=JPY&length=2&resolution=hourly&unit=day',
            url: 'https://api.codelife.cc/exchangerate/query?lang=cn&money=1&source=CNY&target=JPY',
            headers: {
                'Origin': 'chrome-extension://inedkoakiaeepjoblbiiipedngonadhn',
                'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
                'Accept': '*/*',
                'Host': 'api.codelife.cc',
                'Connection': 'keep-alive'
            }
        }
        axios(config)
            .then(res => {
                console.log('res', res)
                const { data } = res.data;
                // const result = data?.value?.pop() || 20.5
                console.log('data', data[0])
                const result = data[0]?.v || 20.5
                resolve(result)
            })
            .catch(err => {
                reject(err)
            });

    })

}

