/**
 *   Wechaty - https://github.com/wechaty/wechaty
 *
 *   @copyright 2016-now Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import qrTerm from 'qrcode-terminal'

import {
    log,
    WechatyBuilder,
} from 'wechaty'
export function getBot() {
    return new Promise((resolve) => {
        var isLogin = false
        const welcome = `
        =============== Powered by Wechaty ===============
        -------- https://github.com/Chatie/wechaty --------
        
        I can list all your contacts with weixn id & name
        __________________________________________________
        
        Please wait... I'm trying to login in...
        `

        console.log(welcome)
        const bot = WechatyBuilder.build()

        bot.on('scan', onScan)
        bot.on('login', onLogin)
        bot.on('logout', onLogout)
        bot.on('error', onError)
        bot.on('message', onMessage);
        bot.on('ready', () => {
            console.log(' ready')
            resolve(bot)
            // Then do whatever you want to do
        })
        bot.start()
            .catch(console.error)

        function onScan(qrcode, status) {
            qrTerm.generate(qrcode, { small: true })  // show qrcode on console
            console.log('↑扫码登录微信机器人', new Date(Date.now()).toLocaleString('zh-cn', { hour12: false }))
        }

        async function onLogin(user) {
            isLogin = true
            console.log(`${user} login`)

        }
        function onMessage(message) {
            const { payload } = message
            const { talkerId, text } = payload
            text && console.log(talkerId, "==>", text)
        }

        function onLogout(user) {
            console.log(`${user} logout`)
        }

        function onError(e) {
            console.error(e)
        }
    })


}


/**
 * Main Contact Bot
 */
export async function getRoom(bot, topic = /推送/) {
    // 获取所有群列表
    const room = await bot.Room.find({ topic: topic }); // find all of the rooms with name regex

    return room
}