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