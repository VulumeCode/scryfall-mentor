import { TreeItemIndex } from "react-complex-tree";

export type DataTree = { [index: TreeItemIndex]: DataNode };
export type DataNode = number | DataTree;

export const defaultDataTree: DataTree = {
    root: {
        Examples: {
            Hans: 1,
            Gingerbrute: 3,
            Toxrill: 2,
        },
        Tutorial: {},
        SearchReference: {
            "e832a640-fcb8-428a-a2a4-dbbee7edaf5a": {
                "97f325a6-8083-4e59-a318-dc25e693568f": 1656360758706,
                "0c32d986-724d-4943-9459-0090ce8931d9": 1656361930542,
                "b3a0e4ef-7061-44e7-b444-19e8d4ee5494": 1656362242277,
                "4c091040-84ca-4e5c-9657-fa09d5e6af46": 1656362378221,
            },
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
            enabled: true,
            query: "Hans",
        },
        {
            enabled: false,
            query: "Ach",
        },
    ],
    "2": [
        {
            enabled: true,
            query: "t:slug",
        },
        {
            enabled: true,
            query: "t:legendary",
        },
        {
            enabled: true,
            query: "c:b",
        },
    ],
    "3": [
        {
            enabled: true,
            query: "t:food",
        },
        {
            enabled: true,
            query: "t:creature",
        },
    ],
    "1656360758706": [
        {
            enabled: true,
            query: "c:rg",
        },
    ],
    "1656361930542": [
        {
            enabled: true,
            query: "color>=uw",
        },
        {
            enabled: true,
            query: "-c:red",
        },
    ],
    "1656362242277": [
        {
            enabled: true,
            query: "id<=esper",
        },
        {
            enabled: true,
            query: "t:instant",
        },
    ],
    "1656362378221": [
        {
            enabled: true,
            query: "id:c",
        },
        {
            enabled: true,
            query: "t:land",
        },
    ],
};

export type Names = { [index: string]: string };

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
};
