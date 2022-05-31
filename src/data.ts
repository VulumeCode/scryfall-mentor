
export const shortTreeTemplate = {
    root: {
        container: {
            item0: 0,
            item1: 1,
            item2: 2,
            item3: {
                inner0: 0,
                inner1: 1,
                inner2: 2,
                inner3: 3
            },
            item4: 4,
            item5: 5
        }
    }
};

export const longTreeTemplate = {
    root: {
        Fruit: {
            Hans: 1,
            Gingerbrute: 3,
            Lemon: {},
            Berries: {
                Strawberry: 1,
                Blueberry: 1
            },
            Toxrill: 2
        },
        Meals: {
            America: {
                SmashBurger: 1,
                Chowder: 1,
                Ravioli: 1,
                MacAndCheese: 1,
                Brownies: 1
            },
            Europe: {
                Risotto: 1,
                Spaghetti: 1,
                Pizza: 1,
                Weisswurst: 1,
                Spargel: 1
            },
            Asia: {
                Curry: 1,
                PadThai: 1,
                Jiaozi: 1,
                Sushi: 1
            },
            Australia: {
                PotatoWedges: 1,
                PokeBowl: 1,
                LemonCurd: 1,
                KumaraFries: 1
            }
        },
        Desserts: {
            Cookies: 1,
            IceCream: 1
        },
        Drinks: {
            PinaColada: 1,
            Cola: 1,
            Juice: 1
        }
    }
};

