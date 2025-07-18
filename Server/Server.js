const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoute = require('./Routes/UserRoute');
const authRoute = require('./Routes/AuthRoute');
const categoryRoute = require('./Routes/CategoryRoute');
const productRoute = require('./Routes/ProductRoute');
const fileUpload = require('express-fileupload');
const productVendorRoute = require('./Routes/ProductVendorRoute');
const adminRoute = require('./Routes/AdminRoute');
const cartRoute = require('./Routes/CartRoute');
const paymentRoute = require('./Routes/PaymentRoute');
const profileRoute = require('./Routes/ProfileRoute');
const orderRoute = require('./Routes/OrderRoute');

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4000',
    'https://e-com-site-omega.vercel.app',
    'https://ecombackend-0ku8.onrender.com'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
}));

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp'
}));

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/category', categoryRoute);
app.use('/api/product', productRoute);
app.use('/api/product-vendor', productVendorRoute);
app.use('/api/admin', adminRoute);
app.use('/api/cart', cartRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/profile', profileRoute);
app.use('/api/order', orderRoute);


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});