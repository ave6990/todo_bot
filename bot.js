import { Telegraf } from 'telegraf'
import { help, about } from './controllers/help.js'
import * as greeting from './controllers/greeting.js'
import { calc } from './controllers/calc.js'
import { todo, list, deleteRecords } from './controllers/todo.js'
import dotenv from 'dotenv'
import { Markup } from 'telegraf'

dotenv.config()
const version = process.env.VERSION

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start(greeting.hello)

const hello_re = /\/(hi|hello|привет|здравствуй(те)?)!*/i
const delete_re = /\/(del(ete)?|уд(ал(ить)?)?).*/i
const calc_re = /^[\d-+*/\.\,\s\(\)]+=$/
const help_re = /\/(help|справ(ка)?)/i
const list_re = /\/(list|спис(ок)?)/i

const parse = () => {
    return (ctx) => {
        if (hello_re.test(ctx.message.text)) {
            greeting.hello(ctx)
        } else if (calc_re.test(ctx.message.text)) {
            calc(ctx)
        } else if (help_re.test(ctx.message.text)) {
            about(ctx)
        } else if (list_re.test(ctx.message.text)) {
            list(ctx)
        } else if (delete_re.test(ctx.message.text)) {
            deleteRecords(ctx)
        } else {
            todo(ctx)
        }
    }
}

bot.action(/\/help.*/, (ctx) => {
    help(ctx)
})

bot.on('sticker', (ctx) => ctx.reply('И что мне с этим делать? :-)'))
bot.on('text', parse(bot))

bot.launch()
