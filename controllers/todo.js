import { Markup } from 'telegraf'
import cron from 'node-cron'
import 'fs'

const db = {}
const tasks = []

const todo = async (ctx) => {
    const data = parseData(ctx)

    if (data.valid) {
        if (!db[data.uid]) {
            db[data.uid] = []
        }

        db[data.uid].push(data)

        console.log(data.cronTime, 'msg: ', data.message)

        try {
            const task = await cron.schedule(data.cronTime, () => {
                ctx.replyWithHTML(`<b>Напоминание:</b>\n${data.message}`)
                console.log(data.message)
            })

            data.task = task
        } catch (e) {
            ctx.reply(e)
            console.log(e)
        }

        ctx.replyWithHTML(`<b>Добавлено напоминание.</b>\n<code>${data.message}</code>`)
    } else {
        ctx.replyWithHTML('<b>Неверный формат данных.</b>')
    }
}

const parseData = (ctx) => {
    const message = ctx.update.message
    const cronCmd = getCronCmd(message.text)
    const curDate = new Date()

    return { uid: message.from.id,
        date: curDate,
        cronTime: cronCmd.timeStamp,
        message: cronCmd.message,
        valid: cronCmd.valid,
    }
}

const getCronCmd = (msg) => {
    const re = /([\+|\*]?\d{0,2}\-?\d{0,2}\s){5}/
    let time = ''
    let valid = false

    if (re.test(msg)) {
        time = msg.match(re)[0]
        valid = cron.validate(time)
        console.log(time, valid)
        msg = msg.replace(re, '')
    }

    return { message: msg, timeStamp: time, valid: valid, }
}

const list = (ctx) => {
    const id = ctx.update.message.from.id
    
    if (db[id]) {
        db[id].forEach( (rec, i) => {
            let msg = `<b>${i} Date:</b> ${rec.date}\n`
            msg = `${msg}<b>Message:</b> ${rec.message}\n<b>CronTime:</b> ${rec.cronTime}`
            ctx.replyWithHTML(msg)
        } )
    } else {
        ctx.replyWithHTML('<b>Напоминания отсутствуют.</b>')
    }
}

const deleteRecords = (ctx) => {
    const id = ctx.update.message.from.id
    let delNums = []

    if (db[id]) {
        let msg = ctx.update.message.text
        const cmdRe = /\/(del(ete)?)|(уд(ал(ить)?)?)/i

        msg = msg.replace(cmdRe, '')

        const nums = msg.trim().split(' ').sort()

        nums.reverse().forEach( (num) => {
            if (num < db[id].length) {
                db[id].splice(num, 1)
                delNums.push(num)
            }
        } )

        ctx.replyWithHTML(`<b>Удалены напоминания:</b>\n${delNums.join()}`)
    } else {
        ctx.replyWithHTML('<b>Список напоминаний пуст.</b>')
    }
}

export { todo, list, deleteRecords }
