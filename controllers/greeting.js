import { Markup } from 'telegraf'

const getUserName = (ctx) => {
    let username = ''
    const user = ctx.message.from

    if (user.username) {
        username = user.username
    } else if (user.last_name) {
        username = user.last_name
    } else {
        username = user.first_name
    }

    return username
}

const hello = (ctx) => {
    ctx.reply(`Здравствуйте, ${getUserName(ctx)}!`,
        Markup.keyboard([
            ['/справка', '/список']
        ]).oneTime().resize()
    )
}

export { getUserName, hello }
