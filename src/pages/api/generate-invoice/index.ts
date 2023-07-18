import fs from 'fs';
import puppeteer from 'puppeteer';
import { join } from "path";
import handlers from 'handlebars';
import { formatDate } from '../../../utils/formatDate';
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

    const formattedDueDate = formatDate(dueDate);

    const formattedCreatedAt = formatDate(createdAt);

    try {
        const isProduction = process.env.NODE_ENV === 'production';
        // console.log('isProduction', isProduction);

        const filePath = isProduction
        ? join(process.cwd(), 'public', 'invoice.html')
        : join(__dirname, '..', 'public', 'invoice.html');

        // console.log('filePath', filePath);
        
        const file = fs.readFileSync(filePath, 'utf8');
        // console.log("file", fs.readFileSync(filePath, 'utf8'));

        // compile the file with handlebars and inject the customerName variable
        const template = handlers.compile(`${file}`);
        console.log("template", template);

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
            formattedCreatedAt,
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

        console.log("pdf", pdf);

        await browser.close();

        // send the result to the client
        res.statusCode = 200;
        res.send(pdf);
    } catch (err: any) {
        console.log(err);
        res.status(500).json({ message: err.message});
    }
};