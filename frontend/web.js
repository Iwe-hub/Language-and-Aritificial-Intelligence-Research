import puppeteer from "puppeteer";
import fs from "fs";

const fetchWebPage = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("https://www.iwe.digital/literature-onboarding", { waitUntil: 'networkidle2' });

    //extract html with css
    const styledHtml = await page.evaluate(() => {
        const applyComputedStyles = ((el) => {
            const computedStyle = window.getComputedStyle(el);
            let styledString = "";
            for(let i = 0; i < computedStyle.length; i++) {
                styledString += `${computedStyle[i]}: ${computedStyle.getPropertyValue(computedStyle[i])}`;
            }
            el.style = styledString;
        })
        document.querySelectorAll("*").forEach(el => applyComputedStyles(el))
        return document.documentElement.outerHTML;
    });

    //save content to file
    fs.writeFileSync("onboard.html", styledHtml, "utf-8")
    console.log("HTML file saved a 'onboard.html'")

    await browser.close();
};
fetchWebPage();
