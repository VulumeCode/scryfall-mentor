import { TreeItemIndex } from "react-complex-tree";

export type DataTree = { [index: TreeItemIndex]: DataNode };
export type DataNode = number | DataTree;

export const defaultDataTree: DataTree = {
    root: {
        Examples: { Hans: 1, Gingerbrute: 3, Toxrill: 2 },
        Tutorial: {},
        SearchReference: {
            "e832a640-fcb8-428a-a2a4-dbbee7edaf5a": {
                "97f325a6-8083-4e59-a318-dc25e693568f": 1656360758706,
            },
        },
    },
};

export type QueryPart = {
    enabled: boolean,
    query: string,
};

export const newQueryPart = { enabled: false, query: "" };

export type QueryLibrary = { [id: number]: Array<QueryPart> };

export const defautlQueries: QueryLibrary = {
    "0": [],
    "1": [
        { enabled: true, query: "Hans" },
        { enabled: false, query: "Ach" },
    ],
    "2": [
        { enabled: true, query: "t:slug" },
        { enabled: true, query: "t:legendary" },
        { enabled: true, query: "c:b" },
    ],
    "3": [
        { enabled: true, query: "t:food" },
        { enabled: true, query: "t:creature" },
    ],
    "1656360758706": [{ enabled: true, query: "c:rg" }],
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
    "97f325a6-8083-4e59-a318-dc25e693568f": "{R} Red and {G} Green",
    "e832a640-fcb8-428a-a2a4-dbbee7edaf5a": " Colors and Color Identity",
};
