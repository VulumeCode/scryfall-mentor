import React from "react";

import reactStringReplace from "react-string-replace";


import "react-complex-tree/lib/style.css";


export const renderManaTitle = (title: string, colorful?: true, filterRegExp?: RegExp): React.ReactElement => {
    let renderedTitle: React.ReactNodeArray | string = title;

    if (!!filterRegExp) {
        renderedTitle = reactStringReplace(title, filterRegExp, (match, i) => {
            const key = match + i;
            return <span  {...{ key, style: { color: "var(--ms-m-color)" } }}>{match}</span>;
        });
    }

    renderedTitle = reactStringReplace(renderedTitle, /{(.+?)}/g, (match, i) => {
        const key = match + i;
        return costs.includes(match) ? (
            <i key={key} className={`ms ms-${match} ${!!colorful && "ms-cost ms-shadow"}`}></i>
        ) : match === "m" ? (
            <i key={key} className={"ms ms-ability-menace"}></i>
        ) : abilities.includes(match) ? (
            <i key={key} className={`ms ms-ability-${match}`}></i>
        ) : guilds.includes(match) ? (
            <i key={key} className={`ms ms-guild-${match}`}></i>
        ) : clans.includes(match) ? (
            <i key={key} className={`ms ms-clans-${match}`}></i>
        ) : schools.includes(match) ? (
            <i key={key} className={`ms ms-school-${match}`}></i>
        ) : dfcs.includes(match) ? (
            <i key={key} className={`ms ms-dfc-${match}`}></i>
        ) : types.includes(match) ? (
            <i key={key} className={`ms ms-${match}`}></i>
        ) : match.indexOf("ss") === 0 ? (
            <i key={key} className={`ss ${match}`}></i>
        ) : (
            <i key={key} className={`ms ms-${match}`}></i>
        );
    });
    return <>{renderedTitle}</>;
};

const costs = [
    "c",
    "2b",
    "2g",
    "2r",
    "2u",
    "2w",
    "b",
    "bg",
    "bp",
    "br",
    "e",
    "g",
    "gp",
    "gu",
    "gw",
    "p",
    "r",
    "rg",
    "rp",
    "rw",
    "s",
    "s-mtga",
    "tap",
    "tap-alt",
    "u",
    "ub",
    "untap",
    "up",
    "ur",
    "w",
    "wb",
    "wp",
    "wu",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "1-2",
    "infinity",
    "100",
    "1000000",
];

const dfcs = ["day", "night", "spark", "ignite", "moon", "emrakul", "enchantment", "lesson", "modal-face", "modal-back"];

const types = [
    "artifact",
    "creature",
    "enchantment",
    "instant",
    "land",
    "planeswalker",
    "sorcery",
    "tribal",
    "plane",
    "phenomenon",
    "scheme",
    "conspiracy",
    "vanguard",
    "token",
    "chaos",
    "flashback",
    "power",
    "toughness",
    "artist-brush",
    "artist-nib",
    "saga",
    "acorn",
    "rarity",
    "multicolor",
];

const abilities = [
    "activated",
    "adamant",
    "adapt",
    "addendum",
    "adventure",
    "afflict",
    "afterlife",
    "aftermath",
    "amass",
    "ascend",
    "boast",
    "companion",
    "constellation",
    "convoke",
    "d20",
    "deathtouch",
    "defender",
    "devotion",
    "double",
    "dungeon",
    "embalm",
    "enrage",
    "escape",
    "eternalize",
    "explore",
    "first",
    "flash",
    "flying",
    "foretell",
    "haste",
    "hexproof",
    "hexproof-red",
    "hexproof-white",
    "hexproof-green",
    "hexproof-blue",
    "hexproof-black",
    "indestructible",
    "jumpstart",
    "kicker",
    "landfall",
    "learn",
    "lifelink",
    "magecraft",
    "menace",
    "mutate",
    "party",
    "proliferate",
    "prowess",
    "raid",
    "reach",
    "revolt",
    "riot",
    "spectacle",
    "static",
    "summoning",
    "surveil",
    "trample",
    "transform",
    "triggered",
    "undergrowth",
    "vigilance",
    "ward",
];

const guilds = ["azorius", "boros", "dimir", "golgari", "gruul", "izzet", "orzhov", "rakdos", "selesnya", "simic"];
const clans = ["abzan", "jeskai", "mardu", "sultai", "temur", "atarka", "dromoka", "kolaghan", "ojutai", "silumgar"];
const schools = ["lorehold", "prismari", "quandrix", "silverquill", "witherbloom"];

