import { TreeItemIndex } from "react-complex-tree";

export type DataTree = { [index: TreeItemIndex]: DataNode };
export type DataNode = number | DataTree;

export const defaultDataTree: DataTree = {
    "root": {
        "Examples": {
            "Hans": 1,
            "Gingerbrute": 3,
            "Toxrill": 2,
        },
        "Tutorial": {
            "8ebed0c4-f385-4a0e-af10-92dcf13c6052": 1658402800014,
            "c13478a7-d43e-4cca-838a-d3f2d1b75045": 1658402519536,
            "c6ead7a5-4d54-44a8-b0d4-29c9750b745f": 1658403034541,
        },
        "SearchReference": {
            "e832a640-fcb8-428a-a2a4-dbbee7edaf5a": {
                "97f325a6-8083-4e59-a318-dc25e693568f": 1656360758706,
                "0c32d986-724d-4943-9459-0090ce8931d9": 1656361930542,
                "b3a0e4ef-7061-44e7-b444-19e8d4ee5494": 1656362242277,
                "4c091040-84ca-4e5c-9657-fa09d5e6af46": 1656362378221,
            },
            "57f361df-2ea1-47c3-bc82-3d1ed00e74ed": {
                "7d577db4-ede5-4358-8848-662a587b7c34": 1658397480044,
                "de5f5848-11c0-40a7-8359-0f4932c18bae": 1658397579817,
            },
            "6c592f89-1a84-4380-b588-c5274adf9214": {
                "eaffaba2-5f78-4b75-bca0-3d314a225b27": 1658397593287,
                "fd6ac65c-ca96-463f-820d-9e868b33ea82": 1658400076232,
            },
            "a6faaa5b-c96e-424d-8b77-854a8bac26fa": {
                "d22f77fd-1ab1-4735-9271-e1f1708eba15": 1658400101637,
                "a5364f44-f7ec-4f9d-97f7-ec88b9bf8b4a": 1658400189829,
                "dd21fe9c-f8ea-4b94-a3c4-efef84f0b141": 1658400227494,
                "05c7d5b5-b420-4e50-b81c-685872d0008b": 1658400342388,
                "70027ecb-50bb-4c6e-882d-5a08302b5546": 1658400450958,
                "a05664bf-a119-429a-b30f-0a2b58419ee0": 1658400491452,
                "18a74d96-2936-4568-81f9-8c8f310a41ae": 1658400527615,
            },
            "8cbf3af4-af47-4ed2-9ca5-6540fa29fdbc": {
                "3095f7e9-90db-4919-9397-98336ba1d2ed": 1658400562480,
                "e68f0cc0-6c36-4e94-b468-659dc6475279": 1658400621236,
                "339e2ec1-d3e8-41e9-8d9d-381f63e3de34": 1658400646314,
            },
            "4c7ad8ff-4c1f-459e-8bc4-4b81299d549f": {
                "7a257e65-425e-4b4f-aead-c8db25c55f56": 1658400670405,
                "ef6e2f80-f8d4-4562-995e-d719c318d0de": 1658400696241,
            },
            "4b88f7ca-89b4-4869-a1ae-a51fdcdb1796": {
                "7781645c-885d-41a4-91f1-9e94dcc0b9f6": 1658400704195,
                "941424f9-b3a1-41e4-bced-7d6cf2355655": 1658400814948,
                "da384df0-1a2f-40bc-97ae-ee248a437f71": 1658400829353,
            },
            "4f5770e2-5dab-4b45-8129-f1b99a0d0ca5": {
                "760c1cf4-9881-4bb1-addd-51faff15079d": 1658400938650,
                "ee3f1408-a041-4ec5-ba5f-b1d50853688e": 1658400996440,
                "48edc66f-e03a-46ea-b424-499c685e5a69": 1658401028757,
            },
            "6154084a-39ab-4213-ae21-d6bd27d55422": {
                "47dc61c1-b976-46e6-b9b7-1411a60674f5": 1658401057059,
                "6daf2563-3747-4d47-830c-1ae155c4d9ea": 1658401223312,
                "150d0c1a-eb1a-4c39-a5ec-47b53160f49d": 1658401241973,
            },
            "ec3f38a0-525d-4815-8327-e83b3ee0253f": {
                "2a67d8d1-2214-492e-9d3c-3a766d418959": 1658401279602,
                "b97f656c-a666-4e59-a0d0-52274509af65": 1658401321588,
            },
            "692aa192-2e32-4c29-8d31-9212a17c50d7": {
                "fe3aaeaa-e268-4292-9a04-c1de2e43b26c": 1658401339836,
                "38d7fd26-8fc9-411d-934c-b040d76cd4cc": 1658401394580,
            },
            "fb52d481-6bf7-4561-91e4-c745f32f2020": {
                "9a6cffbd-8a4f-4836-8859-bace5019f133": 1658401423331,
                "72648d23-b371-4315-bed0-17bdcf2fd919": 1658401467845,
            },
            "e72d5350-5217-4a03-8196-17f4ba21ae7c": {
                "ee9cea46-1694-4f84-a7e0-82dde0e49568": 1658401513926,
                "9619811b-80c5-4175-b182-430e2384b915": 1658401558728,
                "d0a9cb32-cbe4-4449-886d-cc0585301cd2": 1658401675343,
                "05240537-1c2b-4058-863e-52397960f41b": 1658401984308,
                "873044be-66bd-4214-b548-5570f7744f42": 1658402147322,
            },
            "b8ec67a1-c220-407f-b56b-b7f415d0a8d8": 1658402394174,
        },
    },
};

export type QueryPart = {
    enabled: boolean;
    query: string;
};

export const newQueryPart = { enabled: false, query: "" };

export type QueryLibrary = { [id: number]: Array<QueryPart> };

export const defautlQueries: QueryLibrary = {
    "0": [],
    "1": [
        {
            "enabled": true,
            "query": "Hans",
        },
        {
            "enabled": false,
            "query": "Ach",
        },
    ],
    "2": [
        {
            "enabled": true,
            "query": "t:slug",
        },
        {
            "enabled": true,
            "query": "t:legendary",
        },
        {
            "enabled": true,
            "query": "c:b",
        },
    ],
    "3": [
        {
            "enabled": true,
            "query": "t:food",
        },
        {
            "enabled": true,
            "query": "t:creature",
        },
    ],
    "1656360758706": [
        {
            "enabled": true,
            "query": "c:rg",
        },
    ],
    "1656361930542": [
        {
            "enabled": true,
            "query": "color>=uw",
        },
        {
            "enabled": true,
            "query": "-c:red",
        },
    ],
    "1656362242277": [
        {
            "enabled": true,
            "query": "id<=esper",
        },
        {
            "enabled": true,
            "query": "t:instant",
        },
    ],
    "1656362378221": [
        {
            "enabled": true,
            "query": "id:c",
        },
        {
            "enabled": true,
            "query": "t:land",
        },
    ],
    "1658397480044": [
        {
            "enabled": true,
            "query": "t:merfolk t:legend",
        },
    ],
    "1658397579817": [
        {
            "enabled": true,
            "query": "t:goblin -t:creature",
        },
    ],
    "1658397593287": [
        {
            "enabled": true,
            "query": "o:draw",
        },
        {
            "enabled": true,
            "query": "t:creature",
        },
    ],
    "1658400076232": [
        {
            "enabled": true,
            "query": "o:\"~ enters the battlefield tapped\"",
        },
    ],
    "1658400101637": [
        {
            "enabled": true,
            "query": "mana:{G}{U}",
        },
    ],
    "1658400189829": [
        {
            "enabled": true,
            "query": "m:2WW",
        },
    ],
    "1658400227494": [
        {
            "enabled": true,
            "query": "m>3WU",
        },
    ],
    "1658400342388": [
        {
            "enabled": true,
            "query": "m:{R/P}",
        },
    ],
    "1658400450958": [
        {
            "enabled": true,
            "query": "c:u cmc=5",
        },
    ],
    "1658400491452": [
        {
            "enabled": true,
            "query": "devotion:{u/b}{u/b}{u/b}",
        },
    ],
    "1658400527615": [
        {
            "enabled": true,
            "query": "produces=wu",
        },
    ],
    "1658400562480": [
        {
            "enabled": true,
            "query": "pow>=8",
        },
    ],
    "1658400621236": [
        {
            "enabled": true,
            "query": "c:w t:creature",
        },
        {
            "enabled": true,
            "query": "pow>tou",
        },
    ],
    "1658400646314": [
        {
            "enabled": true,
            "query": "t:planeswalker",
        },
        {
            "enabled": true,
            "query": "loy=3",
        },
    ],
    "1658400670405": [
        {
            "enabled": true,
            "query": "is:meld",
        },
    ],
    "1658400696241": [
        {
            "enabled": true,
            "query": "is:split",
        },
    ],
    "1658400704195": [
        {
            "enabled": true,
            "query": "c>=br is:spell",
        },
        {
            "enabled": true,
            "query": "f:duel",
        },
    ],
    "1658400814948": [
        {
            "enabled": true,
            "query": "is:permanent",
        },
        {
            "enabled": true,
            "query": "t:rebel",
        },
    ],
    "1658400829353": [
        {
            "enabled": true,
            "query": "is:vanilla",
        },
    ],
    "1658400938650": [
        {
            "enabled": true,
            "query": "c:r t:instant",
        },
        {
            "enabled": true,
            "query": "-fire",
        },
    ],
    "1658400996440": [
        {
            "enabled": true,
            "query": "o:changeling",
        },
        {
            "enabled": true,
            "query": "-t:creature",
        },
    ],
    "1658401028757": [
        {
            "enabled": true,
            "query": "e:c16",
        },
        {
            "enabled": true,
            "query": "not:reprint",
        },
    ],
    "1658401057059": [
        {
            "enabled": true,
            "query": "t:creature",
        },
        {
            "enabled": true,
            "query": "o:/^{T}:/",
        },
    ],
    "1658401223312": [
        {
            "enabled": true,
            "query": "t:instant",
        },
        {
            "enabled": true,
            "query": "o:/\\spp/",
        },
    ],
    "1658401241973": [
        {
            "enabled": true,
            "query": "name:/\\bizzet\\b/",
        },
    ],
    "1658401279602": [
        {
            "enabled": true,
            "query": "!fire",
        },
    ],
    "1658401321588": [
        {
            "enabled": true,
            "query": "!\"sift through sands\"",
        },
    ],
    "1658401339836": [
        {
            "enabled": true,
            "query": "t:fish or t:bird",
        },
    ],
    "1658401394580": [
        {
            "enabled": true,
            "query": "t:land",
        },
        {
            "enabled": true,
            "query": "a:titus or a:avon",
        },
    ],
    "1658401423331": [
        {
            "enabled": true,
            "query": "t:legendary (t:goblin or t:elf)",
        },
    ],
    "1658401467845": [
        {
            "enabled": true,
            "query": "through (depths or sands or mists)",
        },
    ],
    "1658401513926": [
        {
            "enabled": true,
            "query": "!\"Lightning Bolt\"",
        },
        {
            "enabled": true,
            "query": "unique:prints",
        },
    ],
    "1658401558728": [
        {
            "enabled": true,
            "query": "t:forest a:avon",
        },
        {
            "enabled": true,
            "query": "unique:art",
        },
    ],
    "1658401675343": [
        {
            "enabled": true,
            "query": "f:modern",
        },
        {
            "enabled": true,
            "query": "order:rarity direction:asc",
        },
    ],
    "1658401984308": [
        {
            "enabled": true,
            "query": "t:human",
        },
        {
            "enabled": true,
            "query": "display:text",
        },
    ],
    "1658402147322": [
        {
            "enabled": true,
            "query": "in:leb ",
        },
        {
            "enabled": true,
            "query": "game:paper prefer:newest",
        },
    ],
    "1658402394174": [
        {
            "enabled": false,
            "query": "https://scryfall.com/docs/syntax",
        },
    ],
    "1658402519536": [
        {
            "enabled": true,
            "query": "Each query part will be grouped (in parenthesis).",
        },
        {
            "enabled": false,
            "query": "Disabled parts are omitted.",
        },
        {
            "enabled": true,
            "query": "Query parts can span multiple lines.\nPress Shift+Enter to enter a new line.",
        },
    ],
    "1658402800014": [
        {
            "enabled": false,
            "query": "Use Scryfall syntax like:",
        },
        {
            "enabled": true,
            "query": "t:goblin is:commander",
        },
        {
            "enabled": false,
            "query": "Press Enter to search.",
        },
        {
            "enabled": false,
            "query": "Ctrl+Enter to search in a new tab.",
        },
    ],
    "1658402971038": [],
    "1658403034541": [
        {
            "enabled": false,
            "query": "Right click in the tree to load a query as a mask.",
        },
        {
            "enabled": false,
            "query": "Masks are retained while swapping out queries, this is useful for example when you're building a commander-legal red goblin deck.",
        },
        {
            "enabled": true,
            "query": "f:commander t:goblin id:r",
        },
    ],
};

export type Names = { [index: TreeItemIndex]: string };

export const defaultNames: Names = {
    "root": "*",
    "Examples": "Examples",
    "Hans": "Hans",
    "Gingerbrute": "Gingerbrute",
    "Toxrill": "Toxrill",
    "Tutorial": "Tutorial",
    "SearchReference": "Scryfall Search Reference",
    "97f325a6-8083-4e59-a318-dc25e693568f": "Cards that are {r} and {g}",
    "e832a640-fcb8-428a-a2a4-dbbee7edaf5a": " Colors and Color Identity",
    "0c32d986-724d-4943-9459-0090ce8931d9": "Cards that are at least {wu}, but not {r}",
    "b3a0e4ef-7061-44e7-b444-19e8d4ee5494": "Instants {instant} that you can play with an Esper  {ss-cmd}",
    "4c091040-84ca-4e5c-9657-fa09d5e6af46": "Lands {land} with {c} identity",
    "7d577db4-ede5-4358-8848-662a587b7c34": "Legendary merfolk cards",
    "57f361df-2ea1-47c3-bc82-3d1ed00e74ed": "Card Types",
    "de5f5848-11c0-40a7-8359-0f4932c18bae": "Goblin cards that aren’t creatures",
    "eaffaba2-5f78-4b75-bca0-3d314a225b27": "Creatures that deal with drawing cards",
    "6c592f89-1a84-4380-b588-c5274adf9214": "Card Text",
    "fd6ac65c-ca96-463f-820d-9e868b33ea82": "Cards that enter the battlefield tapped",
    "d22f77fd-1ab1-4735-9271-e1f1708eba15": "Cards with 1 {g} and {u} in their costs",
    "a6faaa5b-c96e-424d-8b77-854a8bac26fa": "Mana Costs",
    "a5364f44-f7ec-4f9d-97f7-ec88b9bf8b4a": "Cards with {2} and 2 {w} in their cost",
    "dd21fe9c-f8ea-4b94-a3c4-efef84f0b141": "Cards that cost more than {3}, 1 {w}, and 1 {u} mana",
    "05c7d5b5-b420-4e50-b81c-685872d0008b": "Cards with {rp} in their cost",
    "70027ecb-50bb-4c6e-882d-5a08302b5546": "Blue cards with converted mana cost {5}",
    "a05664bf-a119-429a-b30f-0a2b58419ee0": "Cards that contribute 3 to devotion to {ub}",
    "18a74d96-2936-4568-81f9-8c8f310a41ae": "Cards that produce {u} and {w}",
    "3095f7e9-90db-4919-9397-98336ba1d2ed": "Cards with 8 or more power {power}",
    "8cbf3af4-af47-4ed2-9ca5-6540fa29fdbc": "Power, Toughness, and Loyalty",
    "e68f0cc0-6c36-4e94-b468-659dc6475279": "White creatures that are top-heavy",
    "339e2ec1-d3e8-41e9-8d9d-381f63e3de34": "Planeswalkers that start at 3 loyalty",
    "7a257e65-425e-4b4f-aead-c8db25c55f56": "Cards that meld {emrakul}",
    "4c7ad8ff-4c1f-459e-8bc4-4b81299d549f": "Multi-faced Cards",
    "ef6e2f80-f8d4-4562-995e-d719c318d0de": "Split-faced cards",
    "7781645c-885d-41a4-91f1-9e94dcc0b9f6": "{br} multicolor spells in Duel Commander",
    "4b88f7ca-89b4-4869-a1ae-a51fdcdb1796": "Spells, Permanents, and Effects ",
    "941424f9-b3a1-41e4-bced-7d6cf2355655": "Rebel permanents",
    "da384df0-1a2f-40bc-97ae-ee248a437f71": "Vanilla creatures",
    "760c1cf4-9881-4bb1-addd-51faff15079d": "{r} instants without the word “fire” in their name",
    "4f5770e2-5dab-4b45-8129-f1b99a0d0ca5": "Negating Conditions",
    "ee3f1408-a041-4ec5-ba5f-b1d50853688e": "Changeling cards that aren’t creatures",
    "48edc66f-e03a-46ea-b424-499c685e5a69": "Cards in Commander 2016 that aren’t reprints",
    "47dc61c1-b976-46e6-b9b7-1411a60674f5": "Creatures that {tap} with no other payment",
    "6154084a-39ab-4213-ae21-d6bd27d55422": "Regular Expressions",
    "6daf2563-3747-4d47-830c-1ae155c4d9ea": "Instants that provide +X/+X effects",
    "150d0c1a-eb1a-4c39-a5ec-47b53160f49d": "Card names with “izzet” but not words like “mizzet”",
    "2a67d8d1-2214-492e-9d3c-3a766d418959": "The card Fire",
    "ec3f38a0-525d-4815-8327-e83b3ee0253f": "Exact Names",
    "b97f656c-a666-4e59-a0d0-52274509af65": "The card Sift Through Sands",
    "fe3aaeaa-e268-4292-9a04-c1de2e43b26c": "Cards that are Fish or Birds",
    "692aa192-2e32-4c29-8d31-9212a17c50d7": "Using “OR” ",
    "38d7fd26-8fc9-411d-934c-b040d76cd4cc": "Lands illustrated by Titus Lunter or John Avon",
    "9a6cffbd-8a4f-4836-8859-bace5019f133": "Legendary goblins or elves",
    "fb52d481-6bf7-4561-91e4-c745f32f2020": "Nesting Conditions",
    "72648d23-b371-4315-bed0-17bdcf2fd919": "The Unspeakable combo",
    "ee9cea46-1694-4f84-a7e0-82dde0e49568": "Every printing of Lightning Bolt",
    "e72d5350-5217-4a03-8196-17f4ba21ae7c": "Display Keywords",
    "9619811b-80c5-4175-b182-430e2384b915": "Every unique Forest illustration by John Avon",
    "d0a9cb32-cbe4-4449-886d-cc0585301cd2": "Modern legal cards sorted by rarity, commons first",
    "05240537-1c2b-4058-863e-52397960f41b": "Every Human card as text-only",
    "873044be-66bd-4214-b548-5570f7744f42": "The newest paper printing of each card in Limited Edition Beta",
    "b8ec67a1-c220-407f-b56b-b7f415d0a8d8": "{lesson} Full reference on Scryfall",
    "c13478a7-d43e-4cca-838a-d3f2d1b75045": "Queries",
    "8ebed0c4-f385-4a0e-af10-92dcf13c6052": "Searching",
    "df12dbdd-adc9-4b01-8643-c0fcd7fe8181": "New query",
    "9c2fcfb7-0bcd-4368-bb21-0d671c7c1768": "New collection",
    "c6ead7a5-4d54-44a8-b0d4-29c9750b745f": "Masks",
};
