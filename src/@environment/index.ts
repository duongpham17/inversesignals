export const environment = process.env.NODE_ENV as "development" | "production";

export const website = {
  name: "inverse signals",
  Name: "Inverse Signals"
};

export const production_url: string[] = [
  "https://inversesignals.onrender.com"
];

export const development_url: string[] = [
  'http://localhost:3000'
];

export const whitelist: string[] = environment === 'production' 
  ? production_url 
  : development_url;

export const mongodb = {
  database: process.env.DATABASE as string,
  password: process.env.DATABASE_PASSWORD as string
}

export const stripe_key = {
  key : environment === "production" ? process.env.STRIPE_PROD_SECRET_KEY as string : process.env.STRIPE_TEST_SECRET_KEY as string,
  webhook_paymentIntent: environment === "production" ? process.env.STRIPE_PROD_WEBHOOK_SECRET as string : process.env.STRIPE_TEST_WEBHOOK_SECRET as string,
};

