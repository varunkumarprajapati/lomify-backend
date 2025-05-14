const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_DOMAIN];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error("Block by CORS:-" + origin));
  },
  credentials: true,
};

module.exports = corsOptions;
