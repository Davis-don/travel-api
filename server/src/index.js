import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import accommodationTypeRouter from './routes/Accomodationroutes.js';
import serviceLevelRouter from './routes/servicelevel.js';
import roomTypeRoutes from './routes/Roomtype.js';
import amenityRoutes from './routes/Amenity.js';
import accommodationRoutes from './routes/Accomodationroute.js';

dotenv.config();


const app = express();
const port = process.env.PORT;

// ✅ Correct and complete CORS setup
app.use(cors({
   origin: '*', 
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  credentials: true,
  optionsSuccessStatus: 200,
}));


// app.options('*', cors());

app.use(express.json());

app.use("/accomodation-type", accommodationTypeRouter);
app.use("/service-level", serviceLevelRouter);
app.use("/room-type", roomTypeRoutes);
app.use("/amenity", amenityRoutes);
app.use("/accommodation", accommodationRoutes);


app.get("/", (_req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
