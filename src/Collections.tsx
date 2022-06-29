import React, { useState, useRef, forwardRef, MutableRefObject } from "react";
import reactStringReplace from "react-string-replace";

import "./Collections.css";

import { ControlledTreeEnvironment, Tree, TreeRef, TreeItemIndex, TreeItem, TreeEnvironmentRef, TreeItemRenderContext, InteractionMode, DraggingPosition } from "react-complex-tree";
import "react-complex-tree/lib/style.css";

import icons from "./icons";
import ContextMenu from "./ContextMenu";
import { createCustomRenderers } from "./createCustomRenderers";
import { customInteraction } from "./customInteraction";

export type TreeItemData = {
    title: string,
    queryId: number | null,
    path: TreeItemIndex[],
};

export type FlatTreeData = Record<TreeItemIndex, TreeItem<TreeItemData>>;

declare global {
    interface Window {
        tree: unknown,
        environment: unknown,
    }
}

const defaultRenderers = createCustomRenderers(1);

type Props = {
    treeData: FlatTreeData,
    onSelectQuery: (queryKey: TreeItemIndex) => void,
    onLoadAsMask: (queryKey: TreeItemIndex) => void,
    onAppendToMask: (queryKey: TreeItemIndex) => void,
    onAddRootCollection: () => TreeItemIndex,
    onAddCollection: (underIndex: TreeItemIndex) => TreeItemIndex,
    onDuplicate: (afterIndex: TreeItemIndex) => TreeItemIndex,
    onRenameItem: (item: TreeItem<TreeItemData>, name: string, treeId: string) => void,
    onDeleteItem: (item: TreeItem<TreeItemData>) => void,
    onDrop: (item: TreeItem<TreeItemData>, target: DraggingPosition) => void,
    filter: string,
    setFilter: (filter: string) => void,
    setModal: (modal?: JSX.Element) => void,
    focusedItem: TreeItemIndex,
};

const Collections = forwardRef<TreeRef, Props>(function Collections({ onDrop, onLoadAsMask, onAppendToMask, focusedItem, treeData, onSelectQuery, onAddRootCollection, onAddCollection, onRenameItem, filter, setFilter, onDeleteItem, onDuplicate, setModal }, fwdTree) {
    const environment = useRef<TreeEnvironmentRef>(null);
    // const [focusedItem, setFocusedItem] = useState<TreeItemIndex>();
    const [expandedItems, setExpandedItems] = useState<Array<TreeItemIndex>>([]);
    const [selectedItem, setSelectedItem] = useState<TreeItemIndex | null>(null);

    const [menuItem, setMenuItem] = useState<TreeItemIndex | undefined>();

    const tree = fwdTree as MutableRefObject<TreeRef>;

    const setContextMenuItem = (item: TreeItem<TreeItemData>, e: HTMLElement | null): void => {
        console.dir(item);
        const close = (): void => {
            setModal();
            setMenuItem(undefined);
        };
        const doIt = (action: () => void): (() => void) => {
            return () => {
                action();
                close();
            };
        };
        if (!!e) {
            setMenuItem(item.index);
            setModal(
                <ContextMenu yPos={e.getBoundingClientRect().bottom} onClose={close}>
                    {!!item.hasChildren ? (
                        <>
                            <li
                                onClick={doIt(() => {
                                    const newIndex = onAddCollection(item.index);
                                    tree.current?.startRenamingItem(newIndex);
                                    setExpandedItems([...expandedItems, newIndex]);
                                })}
                            >
                                <i className="blueprint-icons-big">{icons["folder-new"].utf}</i>
                                Add collection
                            </li>
                        </>
                    ) : (
                        <>
                            <li
                                onClick={doIt(() => {
                                    onLoadAsMask(item.index);
                                })}
                            >
                                <i className="ms ms-ability-menace"></i>
                                Load as mask
                            </li>
                            <li
                                onClick={doIt(() => {
                                    onAppendToMask(item.index);
                                })}
                            >
                                <i className="ms ms-ability-menace"></i>
                                Append to mask
                            </li>
                            <li
                                onClick={doIt(() => {
                                    const newIndex = onDuplicate(item.index);
                                    setSelectedItem(newIndex);
                                    tree.current?.startRenamingItem(newIndex);
                                })}
                            >
                                <i className="ms ms-ability-transform"></i>
                                Duplicate
                            </li>
                        </>
                    )}
                    <li onClick={doIt(() => tree.current?.startRenamingItem(item.index))}>
                        <i className="ms ms-artist-nib "></i>
                        Rename
                    </li>
                    <li style={{ color: "var(--ms-r-color)" }} onClick={doIt(() => confirm("Delete forever?") && onDeleteItem(item))}>
                        <i className="ms ms-ability-devotion"></i>
                        Delete
                    </li>
                </ContextMenu>,
            );
        } else {
            throw new Error("Nothing to hang on to!");
        }
    };

    window.tree = tree;
    window.environment = environment;
    return (
        <>
            <span style={{ display: "flex", width: "100%" }}>
                <button
                    className="blueprint-icons-big button-n inverted"
                    onClick={() => {
                        const newIndex = onAddRootCollection();
                        tree.current?.startRenamingItem(newIndex);
                    }}
                >
                    {icons["folder-new"].utf}
                </button>
                <input
                    className="button-n inverted collections-filter"
                    style={{ width: "100%" }}
                    type={"text"}
                    value={filter}
                    placeholder={icons["filter"].utf}
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                />
                <button id="clear-filter" className="button-n inverted" onClick={() => setFilter("")}>
                    🞪
                </button>
            </span>

            <div id="treeContainer">
                <ControlledTreeEnvironment<TreeItemData>
                    ref={environment}
                    items={treeData}
                    getItemTitle={(item: TreeItem<TreeItemData>): string => item.data.title}
                    defaultInteractionMode={{
                        mode: "custom",
                        extends: InteractionMode.ClickItemToExpand,
                        createInteractiveElementProps: customInteraction,
                    }}
                    viewState={{
                        ["Collections"]: {
                            focusedItem,
                            expandedItems: [...expandedItems, ...(!!focusedItem ? treeData[focusedItem].data.path : [])],
                            selectedItems: !!selectedItem
                                ? [selectedItem]
                                : !!focusedItem
                                    ? [focusedItem] : [],
                        },
                    }}
                    canReorderItems
                    canDragAndDrop
                    canDropOnItemWithChildren
                    onDrop={([item], target) => onDrop(item, target)}
                    canDropAt={([item], target) => {
                        // console.log(item, target);
                        const ancestors = [target.parentItem, ...treeData[target.parentItem].data.path];
                        // console.log(ancestors);
                        return ancestors.indexOf(item.index) === -1;
                    }}
                    onFocusItem={(item: TreeItem<TreeItemData>): void => {
                        console.log("onFocusItem");
                        if (!item.hasChildren) {
                            onSelectQuery(item.index);
                        }
                        setSelectedItem(item.index);
                    }}
                    onExpandItem={(item) => setExpandedItems([...expandedItems, item.index])}
                    onCollapseItem={(item) => setExpandedItems(expandedItems.filter((expandedItemIndex) => expandedItemIndex !== item.index))}
                    onSelectItems={(items) => {
                        console.log("onSelectItems");
                        setSelectedItem(items.at(-1) ?? null);
                    }}
                    {...{ onRenameItem }}
                >
                    <Tree<TreeItemData>
                        treeId="Collections"
                        rootItem="root"
                        ref={tree}
                        renderItemArrow={({ item, context }: { item: TreeItem<TreeItemData>, context: TreeItemRenderContext<never> }) =>
                            item.hasChildren ? (
                                <span className="blueprint-icons" onClick={() => tree.current?.toggleItemExpandedState(item.index)}>
                                    {" "}
                                    {context.isExpanded ? icons["folder-open"].utf : icons["folder-close"].utf}
                                </span>
                            ) : null
                        }
                        renderItemTitle={({ item }) => {
                            return (
                                <div
                                    className="itemTitle"
                                    onContextMenuCapture={(e) => {
                                        e.preventDefault();
                                        setContextMenuItem(item, e.currentTarget.parentElement);
                                    }}
                                >
                                    <div className="itemTitleText" onDoubleClick={() => tree.current?.startRenamingItem(item.index)}>
                                        {renderManaTitle(item.data.title)}
                                    </div>
                                    <div
                                        className="blueprint-icons itemMenuButton"
                                        onClickCapture={(e) => {
                                            console.log("onClickCapture");
                                            e.stopPropagation();
                                            setContextMenuItem(item, e.currentTarget.parentElement?.parentElement ?? null);
                                        }}
                                    >
                                        {icons["more"].utf}
                                    </div>
                                </div>
                            );
                        }}
                        renderRenameInput={({ inputProps, inputRef, submitButtonProps, submitButtonRef, formProps }) => (
                            <form {...formProps} className="rct-tree-item-renaming-form">
                                <input {...inputProps} ref={inputRef} className="rct-tree-item-renaming-input" />
                                <button {...submitButtonProps} ref={submitButtonRef} type="submit" className="ms ms-artist-nib rct-tree-item-renaming-submit-button-sfm"></button>
                            </form>
                        )}
                        renderItem={(props) => defaultRenderers.renderItem(props, menuItem)}
                    />
                </ControlledTreeEnvironment>
                <div style={{ height: "10ex" }} />
            </div>
        </>
    );
});

const renderManaTitle = (title: string): React.ReactElement => {
    return (
        <>
            {reactStringReplace(title, /{(.+?)}/g, (match, i) => {
                const key = match + i;
                return costs.includes(match) ? <i key={key} className={`ms ms-${match} ms-cost ms-shadow`}></i> : match === "m" ? <i key={key} className={"ms ms-ability-menace"}></i> : abilities.includes(match) ? <i key={key} className={`ms ms-ability-${match}`}></i> : guilds.includes(match) ? <i key={key} className={`ms ms-guild-${match}`}></i> : clans.includes(match) ? <i key={key} className={`ms ms-clans-${match}`}></i> : schools.includes(match) ? <i key={key} className={`ms ms-school-${match}`}></i> : dfcs.includes(match) ? <i key={key} className={`ms ms-dfc-${match}`}></i> : types.includes(match) ? <i key={key} className={`ms ms-${match}`}></i> : match.indexOf("ss") === 0 ? <i key={key} className={`ss ${match}`}></i> : <i key={key} className={`ms ms-${match}`}></i>;
            })}
        </>
    );
};

const costs = ["c", "2b", "2g", "2r", "2u", "2w", "b", "bg", "bp", "br", "e", "g", "gp", "gu", "gw", "p", "r", "rg", "rp", "rw", "s", "s-mtga", "tap", "tap-alt", "u", "ub", "untap", "up", "ur", "w", "wb", "wp", "wu", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "1-2", "infinity", "100", "1000000"];

const dfcs = ["day", "night", "spark", "ignite", "moon", "emrakul", "enchantment", "lesson", "modal-face", "modal-back"];

const types = ["artifact", "creature", "enchantment", "instant", "land", "planeswalker", "sorcery", "tribal", "plane", "phenomenon", "scheme", "conspiracy", "vanguard", "token", "chaos", "flashback", "power", "toughness", "artist-brush", "artist-nib", "saga", "acorn", "rarity", "multicolor"];

const abilities = ["activated", "adamant", "adapt", "addendum", "adventure", "afflict", "afterlife", "aftermath", "amass", "ascend", "boast", "companion", "constellation", "convoke", "d20", "deathtouch", "defender", "devotion", "double", "dungeon", "embalm", "enrage", "escape", "eternalize", "explore", "first", "flash", "flying", "foretell", "haste", "hexproof", "hexproof-red", "hexproof-white", "hexproof-green", "hexproof-blue", "hexproof-black", "indestructible", "jumpstart", "kicker", "landfall", "learn", "lifelink", "magecraft", "menace", "mutate", "party", "proliferate", "prowess", "raid", "reach", "revolt", "riot", "spectacle", "static", "summoning", "surveil", "trample", "transform", "triggered", "undergrowth", "vigilance", "ward"];

const guilds = ["azorius", "boros", "dimir", "golgari", "gruul", "izzet", "orzhov", "rakdos", "selesnya", "simic"];
const clans = ["abzan", "jeskai", "mardu", "sultai", "temur", "atarka", "dromoka", "kolaghan", "ojutai", "silumgar"];
const schools = ["lorehold", "prismari", "quandrix", "silverquill", "witherbloom"];

export default Collections;
