import React, { useState, useRef, forwardRef, MutableRefObject, useMemo } from "react";

import "./Collections.css";

import { ControlledTreeEnvironment, Tree, TreeRef, TreeItemIndex, TreeItem, TreeEnvironmentRef, InteractionMode, DraggingPosition } from "react-complex-tree";
import "react-complex-tree/lib/style.css";

import icons from "./icons";
import ContextMenu from "./ContextMenu";
import { createCustomRenderers } from "./createCustomRenderers";
import { customInteraction } from "./customInteraction";
import { renderManaTitle } from "./renderManaTitle";

export type TreeItemData = {
    title: string;
    queryId: number | null;
    path: TreeItemIndex[];
};

export type FlatTreeData = Record<TreeItemIndex, TreeItem<TreeItemData>>;

declare global {
    interface Window {
        tree: unknown;
        environment: unknown;
    }
}

const defaultRenderers = createCustomRenderers(1);

type Props = {
    treeData: FlatTreeData;
    onSelectQuery: (queryKey: TreeItemIndex) => void;
    onLoadAsMask: (queryKey: TreeItemIndex) => void;
    onAppendToMask: (queryKey: TreeItemIndex) => void;
    onAddRootCollection: () => Promise<TreeItemIndex>;
    onAddCollection: (underIndex: TreeItemIndex) => Promise<TreeItemIndex>;
    onDuplicate: (afterIndex: TreeItemIndex) => Promise<TreeItemIndex>;
    onRenameItem: (item: TreeItem<TreeItemData>, name: string, treeId: string) => void;
    onDeleteItem: (item: TreeItem<TreeItemData>) => void;
    onDrop: (item: TreeItem<TreeItemData>, target: DraggingPosition) => void;
    filter: string;
    set_filter: (filter: string) => void;
    set_modal: (modal?: JSX.Element) => void;
    focusedItem: TreeItemIndex;
    editingQueryPath: TreeItemIndex[];
};

const Collections = forwardRef<TreeRef, Props>(function Collections(
    {
        onDrop,
        onLoadAsMask,
        onAppendToMask,
        focusedItem,
        treeData,
        onSelectQuery,
        onAddRootCollection,
        onAddCollection,
        onRenameItem,
        filter,
        set_filter,
        onDeleteItem,
        onDuplicate,
        set_modal,
        editingQueryPath,
    },
    fwdTree,
) {

    const environment = useRef<TreeEnvironmentRef>(null);
    // const [focusedItem, setFocusedItem] = useState<TreeItemIndex>();
    const [expandedItems, set_expandedItems] = useState<Array<TreeItemIndex>>(["Fruit", "Lemon", "Berries", "Meals", "America", "Europe", "Asia", "Australia", "Desserts", "Drinks"]);
    const [selectedItem, set_selectedItem] = useState<TreeItemIndex | null>(null);

    const [menuItem, set_menuItem] = useState<TreeItemIndex | undefined>();

    const tree = fwdTree as MutableRefObject<TreeRef>;

    const setContextMenuItem = (item: TreeItem<TreeItemData>, e: HTMLElement | null): void => {
        console.dir(item);
        const close = (): void => {
            set_modal();
            set_menuItem(undefined);
        };
        const doIt = (action: () => void): (() => void) => {
            return () => {
                action();
                close();
            };
        };
        if (!!e) {
            set_menuItem(item.index);
            set_modal(
                <ContextMenu yPos={e.getBoundingClientRect().bottom} onClose={close}>
                    {!!item.hasChildren ? (
                        <>
                            <li
                                onClick={doIt(async () => {
                                    const newIndex = await onAddCollection(item.index);
                                    tree.current?.startRenamingItem(newIndex);
                                    set_expandedItems([...expandedItems, newIndex]);
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
                                onClick={doIt(async () => {
                                    const newIndex = await onDuplicate(item.index);
                                    set_selectedItem(newIndex);
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

    const filterRegExp = useMemo(() => filter === "" ? undefined : new RegExp(`(${filter.split(" ").filter(e => e).join("|")})`, "gi"), [filter]);

    window.tree = tree;
    window.environment = environment;
    return (
        <>
            <span style={{ display: "flex", width: "100%" }}>
                <button
                    className="blueprint-icons-big button-n inverted"
                    onClick={async () => {
                        const newIndex = await onAddRootCollection();
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
                        set_filter(e.target.value);
                    }}
                />
                <button id="clear-filter" className="button-n inverted" onClick={() => set_filter("")}>
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
                            expandedItems: [...expandedItems, ...editingQueryPath],
                            selectedItems: !!selectedItem ? [selectedItem] : !!focusedItem ? [focusedItem] : [],
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
                        set_selectedItem(item.index);
                    }}
                    onExpandItem={(item) => set_expandedItems([...expandedItems, item.index])}
                    onCollapseItem={(item) => set_expandedItems(expandedItems.filter((expandedItemIndex) => expandedItemIndex !== item.index))}
                    onSelectItems={(items) => {
                        console.log("onSelectItems");
                        set_selectedItem(items.at(-1) ?? null);
                    }}
                    {...{ onRenameItem }}
                >
                    <Tree<TreeItemData>
                        treeId="Collections"
                        rootItem="root"
                        ref={tree}
                        renderItemArrow={({ item, context }) =>
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
                                        {renderManaTitle(item.data.title, true, filterRegExp)}
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
                                <button
                                    {...submitButtonProps}
                                    ref={submitButtonRef}
                                    type="submit"
                                    className="ms ms-artist-nib rct-tree-item-renaming-submit-button-sfm"
                                ></button>
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
export default Collections;
