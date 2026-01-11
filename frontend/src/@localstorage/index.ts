import {website} from 'environment'; 

export const unique_hostname = website.name

export const user_authentication = {
  name: `${unique_hostname}-user-key`,
  get() {
    const item = localStorage.getItem(this.name);
    if (!item) return null;
    try {
      return JSON.parse(item);
    } catch {
      return null;
    }
  },
  set(data: any) {
    if (typeof data === "string") {
      localStorage.setItem(this.name, data);
    } else {
      localStorage.setItem(this.name, JSON.stringify(data));
    }
  },
  remove(){
    localStorage.removeItem(this.name);
  },
};

export const theme = {
  name: `${unique_hostname}-theme`,
  get: () => JSON.parse(localStorage.getItem(`${unique_hostname}-theme`) as any),
  set: ({name, background}: {name: string, background: string}) => localStorage.setItem(`${unique_hostname}-theme`, JSON.stringify({name, background}))
};

export const leverage = {
  name: `${unique_hostname}-leverage`,
  get: () => JSON.parse(localStorage.getItem(`${unique_hostname}-leverage`) as any),
  set: (leverage: string) => localStorage.setItem(`${unique_hostname}-leverage`, leverage)
};