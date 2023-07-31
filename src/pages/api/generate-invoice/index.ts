import fs from 'fs';
import chromium from 'chrome-aws-lambda';
import { join } from "path";
import handlers from 'handlebars';
import { NextApiRequest, NextApiResponse } from 'next';
import { Invoice } from '../../../utils/invoice';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // how to use the Invoice interface to make bookingData properly
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
        taxAmount,
        total,
        createdAt,
        dueDate
    } = bookingData as Invoice;


    let browser = null;

    try {
        const isProduction = process.env.NODE_ENV === 'production';

        const filePath = isProduction
            ? join(process.cwd(), 'public', 'invoice.html')
            : join(__dirname, '..', 'public', 'invoice.html');

        console.log("file path", filePath)

        const file = fs.readFileSync(filePath, 'utf8');

        // compile the file with handlebars and inject the customerName variable
        const template = handlers.compile(`${file}`);
        // console.log("template", template);

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
            taxAmount,
            total,
            createdAt,
            dueDate
        });


        // simulate a chrome browser with puppeteer and navigate to a new page
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();

        // set our compiled html template as the pages content
        // then waitUntil the network is idle to make sure the content has been loaded
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // convert the page to pdf with the .pdf() method
        const pdf = await page.pdf({
            format: 'a4',
        });

        await browser.close();

        // send the result to the client
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${bookingId}.pdf`);
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.send(pdf);
    } catch (err: any) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};