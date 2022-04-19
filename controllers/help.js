import dotenv from 'dotenv'
import { Markup } from 'telegraf'

dotenv.config()
const ver = process.env.VERSION

const msg_main = `Могу помочь в планировании дел!`

const msg_version = `<strong>@todo_bot</strong> version: <code>${ver}</code>.`

const msg_calc = `Введите математическое выражение завершив ввод символом \
<code>=</code> и получите ответ.
Пример ввода:
<code>(3 + 0.14) * 2 ** 2 =</code>`

const msg_todo = `Введите запрос в формате crontab.
Например:
<code>15 6 15 7 * С Днем Рождения!</code>
где 15 - минуты, 6 - часы, 15 - число, 7 - месяц, * - любой день недели, далее\
 текст сообщения`

const help = (ctx) => {
    const query = ctx.update.callback_query.data

    if (/calc/.test(query)) {
        calc(ctx)
    } else if (/about/.test(query)) {
        about(ctx)
    } else if (/version/.test(query)) {
        version(ctx)
    } else if (/todo/.test(query)) {
        todo(ctx)
    }
}

const about = (ctx) => {
    ctx.reply(msg_main,
        Markup.inlineKeyboard([
            Markup.button.callback('Версия', '/help_version'),
            Markup.button.callback('Калькулятор', '/help_calc'),
            Markup.button.callback('Напоминания', '/help_todo'),
       ])
    )
}

const calc = (ctx, next) => {
    ctx.replyWithHTML(msg_calc)
}

const version = (ctx) => {
    ctx.replyWithHTML(msg_version)
}

const todo = (ctx) => {
    ctx.replyWithHTML(msg_todo)
}

export { help , about}
