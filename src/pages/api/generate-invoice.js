import fs from 'fs';
import puppeteer from 'puppeteer';
import handlers from 'handlebars';

export default async (req, res) => {
    const {
        bookingData
    } = JSON.parse(req.body);

    const {
        bookingId,
        petName,
        serviceName,
        servicePrice,
        serviceDuration,
        customerName,
        customerEmail,
        customerAddress,
        customerCity,
        subtotal,
        total,
        createdAt,
        dueDate
    } = bookingData;

    const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    try {
        // read our invoice-template.html file using node fs module
        const file = fs.readFileSync("invoice.html", 'utf8');

        // compile the file with handlebars and inject the customerName variable
        const template = handlers.compile(`${file}`);

        const html = template({
            bookingId,
            petName,
            serviceName,
            servicePrice,
            serviceDuration,
            customerName,
            customerEmail,
            customerAddress,
            customerCity,
            subtotal,
            total,
            createdAt,
            formattedDueDate
        });

        // simulate a chrome browser with puppeteer and navigate to a new page
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // set our compiled html template as the pages content
        // then waitUntil the network is idle to make sure the content has been loaded
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // convert the page to pdf with the .pdf() method
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();

        // send the result to the client
        res.statusCode = 200;
        res.send(pdf);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};