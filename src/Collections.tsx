import React, { useState, useRef } from "react";
import reactStringReplace from "react-string-replace";

import "./Collections.css";

import { ControlledTreeEnvironment, Tree, TreeRef, TreeItemIndex, TreeItem, TreeEnvironmentRef, TreeItemRenderContext, InteractionMode } from "react-complex-tree";
import "react-complex-tree/lib/style.css";

import icons from "./icons";
import ContextMenu from "./ContextMenu";
import { createCustomRenderers } from "./createCustomRenderers";

export type TreeItemData = {
    title: string,
    queryId: number | null,
};

export type TreeData = Record<TreeItemIndex, TreeItem<TreeItemData>>;

declare global {
    interface Window {
        tree: unknown,
        environment: unknown,
    }
}

const defaultRenderers = createCustomRenderers(1);

const Collections: React.FC<{
    treeData: TreeData,
    onSelectQuery: (queryKey: number) => void,
    onAddCollection: () => string,
    onDuplicate: (afterIndex: TreeItemIndex) => TreeItemIndex,
    onRenameItem: (item: TreeItem<TreeItemData>, name: string, treeId: string) => void,
    onDeleteItem: (item: TreeItem<TreeItemData>) => void,
    filter: string,
    setFilter: (filter: string) => void,
    setModal: (modal?: JSX.Element) => void,
}> = ({ treeData, onSelectQuery, onAddCollection, onRenameItem, filter, setFilter, onDeleteItem, onDuplicate, setModal }) => {
    const tree = useRef<TreeRef>(null);
    const environment = useRef<TreeEnvironmentRef>(null);
    const [focusedItem, setFocusedItem] = useState<TreeItemIndex>();
    const [expandedItems, setExpandedItems] = useState<Array<TreeItemIndex>>(["Fruit", "Lemon", "Berries", "Meals", "America", "Europe", "Asia", "Australia", "Desserts", "Drinks"]);
    const [selectedItems, setSelectedItems] = useState<Array<TreeItemIndex>>([]);

    const [menuItem, setMenuItem] = useState<TreeItemIndex | undefined>();

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
                    {!item.hasChildren && (
                        <>
                            <li>
                                <i className="ms ms-ability-menace"></i>
                                Load as mask
                            </li>
                            <li>
                                <i className="ms ms-ability-menace"></i>
                                Append to mask
                            </li>
                            <li
                                onClick={doIt(() => {
                                    const newIndex = onDuplicate(item.index);
                                    // setSelectedItems([newIndex]);
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
                    <li style={{ color: "var(--ms-r-color)" }} onClick={doIt(() => onDeleteItem(item))}>
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
                        const newIndex = onAddCollection();
                        tree.current?.startRenamingItem(newIndex);
                    }}
                >
                    {icons["folder-new"].utf}
                </button>
                <input className="button-n inverted collections-filter" style={{ width: "100%" }} type={"text"} value={filter} placeholder={icons["filter"].utf} onChange={(e) => setFilter(e.target.value)} />
                <button id="clear-filter" className="button-n inverted" onClick={() => setFilter("")}>
                    🞪
                </button>
            </span>

            <div id="treeContainer">
                <ControlledTreeEnvironment
                    ref={environment}
                    items={treeData}
                    getItemTitle={(item: TreeItem<TreeItemData>): string => item.data.title}
                    defaultInteractionMode={{
                        mode: "custom",
                        extends: InteractionMode.ClickItemToExpand,
                        createInteractiveElementProps: (_item, _treeId, _actions, _renderFlags) => ({
                            onFocus: () => {
                                /*NOOP*/
                            },
                        }),
                    }}
                    viewState={{
                        ["Collections"]: {
                            focusedItem,
                            expandedItems,
                            selectedItems,
                        },
                    }}
                    canReorderItems
                    canDragAndDrop
                    canDropOnItemWithChildren
                    canDropOnItemWithoutChildren
                    onDrop={(items, target) => console.log(items, target)}
                    onFocusItem={(item: TreeItem<TreeItemData>): void => {
                        console.log("onFocusItem");
                        setFocusedItem(item.index);
                        if (!item.hasChildren) {
                            onSelectQuery(item.data.queryId as number);
                        }
                    }}
                    onExpandItem={(item) => setExpandedItems([...expandedItems, item.index])}
                    onCollapseItem={(item) => setExpandedItems(expandedItems.filter((expandedItemIndex) => expandedItemIndex !== item.index))}
                    onSelectItems={(items) => {
                        console.log("onSelectItems");
                        setSelectedItems(items);
                    }}
                    {...{ onRenameItem }}
                >
                    <Tree
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
                                        onFocusCapture={(e) => {
                                            console.log("xxxxxx");
                                            e.stopPropagation();
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
};

const renderManaTitle = (title: string): React.ReactElement => {
    return (
        <>
            {reactStringReplace(title, /{(.+)}/g, (match, i) => {
                return costs.indexOf(match) >= 0 ? <i key={match + i} className={`ms ms-${match} ms-cost ms-shadow`}></i> : <i key={match + i} className={`ms ms-${match}`}></i>;
            })}
        </>
    );
};

const costs = ["2b", "2g", "2r", "2u", "2w", "b", "bg", "bp", "br", "e", "g", "gp", "gu", "gw", "p", "r", "rg", "rp", "rw", "s", "s-mtga", "tap-alt", "u", "ub", "untap", "up", "ur", "w", "wb", "wp", "wu", "x", "y", "z"];

export default Collections;
