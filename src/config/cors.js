const allowedOrigins = [process.env.DEV_CLIENT_URL, process.env.CLIENT_URL];
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error("Block by CORS:-" + origin));
  },
  credentials: true,
};

module.exports = corsOptions;
