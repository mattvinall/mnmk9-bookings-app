export interface Invoice {
    bookingId: string;
    petName: string;
    serviceName: string;
    servicePrice: number;
    serviceDuration: number;
    customerName: string;
    customerEmail: string;
    customerAddress: string;
    customerCity: string;
    subtotal: number;
    total: number;
    createdAt: string
    dueDate: string
}
    
// container function to generate the Invoice
export const generateInvoice = (bookingData: Invoice) => {
    // send a post request with the name to our API endpoint
    const fetchData = async () => {
        const data = await fetch('http://localhost:3000/api/generate-invoice', {
            method: 'POST',
            body: JSON.stringify({ bookingData }),
        });

        // convert the response into an array Buffer
        return data.arrayBuffer();
    };

    // convert the buffer into an object URL
    const saveAsPDF = async () => {
        const buffer = await fetchData();
        const blob = new Blob([buffer]);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'invoice.pdf';
        link.click();
    };

    saveAsPDF();
};

export const addTax = (price: number) => {
    if (!price || isNaN(price)) {
        throw new Error('Price must be a number');
    } 

    const total = price * 1.13;
    return parseInt(total.toFixed(2), 10);
}

export const calculateSubtotal = (price: number, duration: number) => {
    if (!price || isNaN(price)) {
        throw new Error('Price must be a number');
    }
    if (!duration || isNaN(duration)) {
        throw new Error('Duration must be a number');
    }

    const subTotal = price * duration;

    return parseInt(subTotal.toFixed(2), 10);
}

export const calculateServiceDuration = (checkInDate: Date, checkOutDate: Date) => {
    const checkIn = new Date(checkInDate).getTime();
    const checkOut = new Date(checkOutDate).getTime();
    const difference = checkOut - checkIn;
    const days = difference / (1000 * 3600 * 24);

    return days as number;
}