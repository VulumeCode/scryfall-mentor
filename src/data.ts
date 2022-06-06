export const defaultTemplate = {
    root: {
        Fruit: {
            Hans: 1,
            Gingerbrute: 3,
            Lemon: {},
            Berries: {
                Strawberry: 1,
                Blueberry: 1,
            },
            Toxrill: 2,
        },
        Meals: {
            America: {
                SmashBurger: 1,
                Chowder: 1,
                Ravioli: 1,
                MacAndCheese: 1,
                Brownies: 1,
            },
            Europe: {
                Risotto: 1,
                Spaghetti: 1,
                Pizza: 1,
                Weisswurst: 1,
                Spargel: 1,
            },
            Asia: {
                Curry: 1,
                PadThai: 1,
                Jiaozi: 1,
                Sushi: 1,
            },
            Australia: {
                PotatoWedges: 1,
                PokeBowl: 1,
                LemonCurd: 1,
                KumaraFries: 1,
            },
        },
        Desserts: {
            Cookies: 1,
            IceCream: 1,
        },
        Drinks: {
            PinaColada: 1,
            Cola: 1,
            Juice: 1,
        },
    },
};

export const defautlQueries = {
    1: [
        { enabled: true, query: "Hans" },
        { enabled: false, query: "Ach" },
        { enabled: false, query: "" },
    ],
    2: [
        { enabled: true, query: "t:slug" },
        { enabled: true, query: "t:legendary" },
        { enabled: true, query: "c:b" },
        { enabled: false, query: "" },
    ],
    3: [
        { enabled: true, query: "t:food" },
        { enabled: true, query: "t:creature" },
        { enabled: false, query: "" },
    ],
};

export const defaultNames = {
    Fruit: "Fruit",
    Hans: "Hans",
    Gingerbrute: "Gingerbrute",
    Lemon: "Lemon",
    Berries: "Berries",
    Strawberry: "Strawberry",
    Blueberry: "Blueberry",
    Toxrill: "Toxrill",
    Meals: "Meals",
    America: "America",
    SmashBurger: "SmashBurger",
    Chowder: "Chowder",
    Ravioli: "Ravioli",
    MacAndCheese: "MacAndCheese",
    Brownies: "Brownies",
    Europe: "Europe",
    Risotto: "Risotto",
    Spaghetti: "Spaghetti",
    Pizza: "Pizza",
    Weisswurst: "Weisswurst",
    Spargel: "Spargel",
    Asia: "Asia",
    Curry: "Curry",
    PadThai: "PadThai",
    Jiaozi: "Jiaozi",
    Sushi: "Sushi",
    Australia: "Australia",
    PotatoWedges: "PotatoWedges",
    PokeBowl: "PokeBowl",
    LemonCurd: "LemonCurd",
    KumaraFries: "KumaraFries",
    Desserts: "Desserts",
    Cookies: "Cookies",
    IceCream: "IceCream",
    Drinks: "Drinks",
    PinaColada: "PinaColada",
    Cola: "Cola",
    Juice: "Juice",
};
