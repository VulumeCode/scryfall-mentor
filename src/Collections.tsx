import React, { useState } from "react";
import { useRef } from "react";

import {
    ControlledTreeEnvironment,
    Tree,
    TreeRef,
    TreeItemIndex,
    TreeItem,
    TreeEnvironmentRef,
    TreeItemRenderContext,
    InteractionMode,
} from "react-complex-tree";
import "react-complex-tree/lib/style.css";

import icons from "./icons";

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

const Collections: React.FC<{
    treeData: TreeData,
    onSelectQuery: (queryKey: number) => void,
    onAddCollection: () => string,
    onRenameItem: (item: TreeItem<TreeItemData>, name: string, treeId: string) => void,
    filter: string,
    setFilter: (filter: string) => void,
}> = ({ treeData, onSelectQuery, onAddCollection, onRenameItem, filter, setFilter }) => {
    const tree = useRef<TreeRef>(null);
    const environment = useRef<TreeEnvironmentRef>(null);
    const [focusedItem, setFocusedItem] = useState<TreeItemIndex>();
    const [expandedItems, setExpandedItems] = useState<Array<TreeItemIndex>>([]);
    const [selectedItems, setSelectedItems] = useState<Array<TreeItemIndex>>([]);


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
                <input
                    className="button-n inverted collections-filter"
                    style={{ width: "100%" }}
                    type={"text"}
                    value={filter}
                    placeholder={icons["filter-list"].utf}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <button
                    id="clear-filter"
                    className="blueprint-icons-big button-n inverted"
                    onClick={() => setFilter("")}
                >
                    {icons["cross"].utf}
                </button>
            </span>
            <ControlledTreeEnvironment
                ref={environment}
                items={treeData}
                getItemTitle={(item: TreeItem<TreeItemData>): string => item.data.title}
                defaultInteractionMode={InteractionMode.ClickArrowToExpand}
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
                // canDropOnItemWithoutChildren
                onDrop={(items, target) => console.log(items, target)}
                onFocusItem={(item: TreeItem<TreeItemData>): void => {
                    setFocusedItem(item.index);
                    if (!item.hasChildren) {
                        onSelectQuery(item.data.queryId as number);
                    }
                }}
                onExpandItem={(item) =>
                    setExpandedItems([...expandedItems, item.index])
                }
                onCollapseItem={(item) =>
                    setExpandedItems(expandedItems.filter((expandedItemIndex) => expandedItemIndex !== item.index))
                }
                onSelectItems={setSelectedItems}
                {...{ onRenameItem }}
            >
                <Tree
                    treeId="Collections"
                    rootItem="root"
                    ref={tree}
                    renderItemArrow={({
                        item,
                        context,
                    }: {
                        item: TreeItem<TreeItemData>,
                        context: TreeItemRenderContext<never>,
                    }) =>
                        item.hasChildren ? (
                            <span
                                className="blueprint-icons"
                                onClick={() => tree.current?.toggleItemExpandedState(item.index)}
                            >
                                {" "}
                                {context.isExpanded ? icons["folder-open"].utf : icons["folder-close"].utf}
                            </span>
                        ) : null
                    }
                    renderItemTitle={({ item }) => (
                        <div onDoubleClick={() => tree.current?.startRenamingItem(item.index)}>{item.data.title}</div>
                    )}
                />
            </ControlledTreeEnvironment>
        </>
    );
};

export default Collections;
