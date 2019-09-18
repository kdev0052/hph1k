

const getPusherApiKeys = async function(page, user) {
    console.log("Creating app and apikey ")
    await page.goto("https://dashboard.pusher.com")

    await page.waitFor(2000)

    const needSignIn = await page.evaluate(() => location.pathname.indexOf("accounts") >= 0)
    console.log("Need sign in ?", needSignIn)
    if(needSignIn ) {
        await page.type("#signup-email", user.email)
        await page.type("#signup-password", user.password)
        await page.click("#signup_form > input.new-btn.new-btn--primary")
        await page.waitFor(1500)
         console.log("Completed sign in ")
    }
   await page.waitFor(4000)

    await page.type("#new_app_name", user.userName.substring(0,5))
    //await page.select("#cluster-select", "option[value='6']")
    await page.click("#frontend_tech_react")
    await page.click("#backend_tech_nodejs")

    await page.click("#wizard-submit-btn")
    await page.waitFor(3000)
      console.log("Retrieving app keys")

    const baseUrl = await page.evaluate(() => location.href.substring(0, location.href.lastIndexOf("/")+1))
    await page.goto(baseUrl + "keys")
    await page.waitFor(1500)
    const appData = await page.evaluate(() => {
        const appKeyData = {}
        document.querySelector("pre.highlight").textContent.split("\n").map(s => {
            let split = s.trim().split("=")
            appKeyData[split[0].trim()] =  JSON.parse(split[1].trim())
        } )
        return appKeyData;
    })
    await page.goto(baseUrl + "settings")
    await page.waitFor(1500)
    await page.click("#app_client_events")
    await page.click('.form__field > .btn--primary[type="submit"]')
    await page.waitFor(500)
      console.log("Retrieving api key")
    await page.goto("https://dashboard.pusher.com/accounts/edit")
    await page.waitFor(1000)
    await page.click("#regen_api_key")
    await page.click('.form__field > .btn--primary[type="submit"]')
    await page.waitFor(3000)
     await page.goto("https://dashboard.pusher.com/accounts/edit")
    await page.waitFor(1000)
   
    const apiKey = await page.evaluate(() => {
        return document.querySelector('[for="account_api_key"]').nextElementSibling.textContent
    })

    return {
        user : user,
        app : appData,
        apiKey : apiKey
    }
}
exports.getPusherApiKeys = getPusherApiKeys
