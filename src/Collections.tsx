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
} from "react-complex-tree";
import "react-complex-tree/lib/style.css";

import icons from "./icons";

export type TreeItemData = {
    title: string,
    queryId: number | null,
};

export type TreeData = Record<TreeItemIndex, TreeItem<TreeItemData>>;

const Collections: React.FC<{
    treeData: TreeData,
    onSelectQuery: (queryKey: number) => void,
    onAddCollection: () => string,
    onRenameItem: (item: TreeItem<TreeItemData>, name: string, treeId: string) => void,
}> = ({ treeData, onSelectQuery, onAddCollection, onRenameItem }) => {
    const tree = useRef<TreeRef>(null);
    const environment = useRef<TreeEnvironmentRef>(null);

    const [focusedItem, setFocusedItem] = useState<TreeItemIndex>();
    const [expandedItems, setExpandedItems] = useState<Array<TreeItemIndex>>([]);
    const [selectedItems, setSelectedItems] = useState<Array<TreeItemIndex>>([]);

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
                    type={"search"}
                    placeholder={icons["filter-list"].utf + "doesn't work "}
                />
            </span>
            <ControlledTreeEnvironment
                ref={environment}
                items={treeData}
                getItemTitle={(item: TreeItem<TreeItemData>): string => item.data.title}
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
                canDropOnItemWithoutChildren={false}
                onDrop={(_items, target) => console.log(target)}
                onFocusItem={(item: TreeItem<TreeItemData>): void => {
                    setFocusedItem(item.index);
                    if (!item.hasChildren) {
                        onSelectQuery(item.data.queryId as number);
                    }
                }}
                onExpandItem={(item) => setExpandedItems([...expandedItems, item.index])}
                onCollapseItem={(item) =>
                    setExpandedItems(expandedItems.filter((expandedItemIndex) => expandedItemIndex !== item.index))
                }
                onSelectItems={setSelectedItems}
                onStartRenamingItem={console.log}
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
