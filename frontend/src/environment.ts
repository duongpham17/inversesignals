export const environment = process.env.NODE_ENV as "development" | "production";

export const website = {
    Name: "Inverse Signals",
    name: "inversesignals"
};

export const base_url_api =  {
    production: "https://inversesignals.onrender.com",
    development: "http://localhost:8000/api"
};

export const base_url_frontend = {
    production: "https://inversesignals.onrender.com",
    development: "http://localhost:3000"
};