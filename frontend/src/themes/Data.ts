export interface ThemeTypes {
    name: string
    background: string,
};

export const Styling= {
    purple: {name: "purple", background: "#141414",   },
    blue:   {name: "blue",   background: "#171717",   },
    grey:   {name: "grey",   background: "#1e1e1e",   },
    green:  {name: "green",  background: "#121111",   },
    pink:   {name: "pink",   background: "#141414ff", },
    orange: {name: "orange", background: "#181818ff", },
    red:    {name: "red",    background: "#000000",   },
};

export const ThemeCycle = Object.values(Styling).map(theme => theme);