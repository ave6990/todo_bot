import { Markup } from 'telegraf'
import { Cron } from 'croner'
import 'fs'

const db = {}
const tasks = []

const reply = (ctx, msg) => {
    console.log(msg)
    ctx.replyWithHTML(msg)
}

const todo = (ctx) => {
    const data = parseData(ctx)

    if (data.valid) {
        if (!db[data.uid]) {
            db[data.uid] = []
        }

        db[data.uid].push(data)

        try {
            const task = Cron(data.cronTime, () => {
                reply(ctx, `<b>Напоминание:</b>\n${data.message}`)
            })


            data.task = task
        } catch (e) {
            reply(ctx, e)
        }

        reply(ctx, `<b>Добавлено напоминание.</b>\n<code>${data.message}</code>`)
    } else {
        reply(ctx, '<b>Неверный формат данных.</b>')
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
        /* @debug validate thimestamp */
        //valid = cron.validate(time)
        valid = true
        msg = msg.replace(re, '')
    }

    return { message: msg, timeStamp: time, valid: valid, }
}

const list = (ctx) => {
    const id = ctx.update.message.from.id
    
    if (db[id] && db[id].length > 0) {
        db[id].forEach( (rec, i) => {
            let msg = `<b>${i} Date:</b> ${rec.date}\n`
            msg = `${msg}<b>Message:</b> ${rec.message}\n<b>CronTime:</b> ${rec.cronTime}`
            reply(ctx, msg)
        } )
    } else {
        reply(ctx, '<b>Напоминания отсутствуют.</b>')
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

        reply(ctx, `<b>Удалены напоминания:</b>\n${delNums.join()}`)
    } else {
        reply(ctx, '<b>Список напоминаний пуст.</b>')
    }
}

export { todo, list, deleteRecords }
